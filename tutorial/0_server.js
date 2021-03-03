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
});

// Webhook para mensagens recebidas via WhatsApp
app.post('/mensagem', (req, res) => {
    const user_id = req.body.From;
    const mensagem = req.body.Body;
});


app.listen(PORT, function(){
    console.log(`Servidor pronto na porta ${PORT}`);
});
