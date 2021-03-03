require('dotenv').config();

// AVISAR: Números sem prefixo 9 registrados anteriormente no WhatsApp
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
    res.send('Encerrando todas as chamadas...');
});

// Webhook da música de espera da sala de conferência
app.post('/espera', (req, res) => {
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
    
    console.log('- - - - - - -');
    console.log(mensagem);
    console.log('- - - - - - -');
    console.log();
    
    const twiml = new twilio.twiml.MessagingResponse();

    // chamada da API desenvolvida em Node.red que conecta com o IBM Watson Assistente e NLU 
    axios.get(WATSON_ENDPOINT, {
        params: {
            user_id,
            mensagem
        }
    })
    .then(function (response) {
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
    .catch(function (error) {
        console.log('ERR => ', error);
        twiml.message('Ocorreu um erro inesperado neste assistente.');
        twiml.message('Tente novamente mais tarde por favor.');
        res.send(twiml.toString());
    });    
});


app.listen(PORT, function(){
    console.log(`Servidor pronto na porta ${PORT}`);
});
