require('dotenv').config();

const nonoDigito = (number) => {
    switch(number.substring(1, 3)) {
        case '55':
            if (number.length === 13) {
                return number.substring(0, 5) + '9' + number.substring(5);
            }
            else {
                return number;
            }
            break;
        default:
            return number;
    }
};

const PORT = process.env.PORT;
const WATSON_ENDPOINT = process.env.WATSON_ENDPOINT;
const PHONE_NUMBER = process.env.PHONE_NUMBER;

const bodyParser = require('body-parser')
const twilio = require('twilio')
const axios = require('axios');
const client = twilio( process.env.TWILIO_ACCOUNT_ID, process.env.TWILIO_AUTH_TOKEN );

const express = require('express');
const app = express();
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.send('OK');
});

// Encerrar apenas chamadas em progresso
app.get('/kill', (req, res) => {
    client.calls.each(call => {
        if (call.status === 'in-progress') {
            const twiml = new twilio.twiml.VoiceResponse();
            twiml.say({ voice: 'alice', language: 'pt-BR' }, 'Então é isso pessoal! Obrigado por participar do nosso uébinar.');

            client.calls(call.sid)
                .update({ twiml: twiml.toString() })
                .then(call => console.log('encerrada: ', call.to));
        }
    })
    res.send('Encerrando todas as chamadas...');

});

// Webhook da música de espera da sala de conferência
app.post('/espera', (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.play({ loop: 1 }, 'http://demo.twilio.com/docs/classic.mp3');
    twiml.say({ voice: 'alice', language: 'pt-BR' }, 'Você será conectado em breve. Aguarde por favor.');
    twiml.pause({ length: 3 });
    twiml.redirect({
        method: 'POST'
    }, 'https://leao.ngrok.io/espera');
    res.send(twiml.toString());
});

// Webhook para resposta quando uma chamada telefônica é realizada e atendida
app.post('/atendente', (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();

    twiml.pause({ length: 1 });
    twiml.say({ voice: 'alice', language: 'pt-BR' }, 'Obrigado por utilizar a Corujéti. Já vamos conectar você com um dos nossos atendentes.');
    twiml.dial().conference({
        region: 'br1',
        startConferenceOnEnter: true,
        waitUrl: 'https://leao.ngrok.io/espera' // TwiML para espera
    }, 'Webinar');
    res.send(twiml.toString());
});

// Webhook para mensagens recebidas via WhatsApp
app.post('/mensagem', (req, res) => {
    const user_id = req.body.From;
    const mensagem = req.body.Body;

    const twiml = new twilio.twiml.MessagingResponse();
    axios.get(WATSON_ENDPOINT, {
        params: {
            user_id,
            mensagem
        }
    }).then(function (response) {
        let { resposta, watson, humano } = response.data;
        console.log();
        console.log('mensagem: ', mensagem);
        console.log('humano: ', humano);
        console.log();
        if (watson) {
            console.log('watson: ', watson);
            console.log();
        }

        twiml.message(resposta);
        res.send(twiml.toString());

        // se vier o parâmetro "humano", fazer a chamada
        if (humano) {
            console.log('iniciando ligação... ', nonoDigito(user_id.replace('whatsapp:', '')));
            client.calls
                .create({
                    url: 'https://leao.ngrok.io/atendente',
                    to: user_id.replace('whatsapp:', ''),
                    from: PHONE_NUMBER
                })
                .then(call => console.log(call.sid));
        }
    })
});


app.listen(PORT, function(){
    console.log(`Servidor pronto na porta ${PORT}`);
});
