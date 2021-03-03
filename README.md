# Integra WhatsApp com análise de sentimentos através da Twilio e IBM Watson
Este código está relacionado ao webinar em parceria com a IBM realizado em Fevereiro/2021.
Caso tenha interesse em assistir ao webinar, [clique aqui](https://ahoy.twilio.com/webinar-twilio-ibm-integracao-nlu-1)

Esta aplicação funciona como um middleware conectando o webhook da Twilio com uma API desenvolvida em node-red pela IBM que aciona o Watson Assistente e a NLU da IBM em alguns intents (falar com atendente e fallback). Dependendo do valor de alguns atributos retornados pela NLU, o sistema irá chamar a API da Twilio para realizar uma chamada telefônica para o número do WhatsApp que originou a conversa. Ao efetuar a chamada, o usuário é inserido em uma sala de conferência, porém fica em espera até que um segundo participante entre na sala.

Para executar essa aplicação execute os seguintes comandos:
```
npm install
npm start
```

## Teste este chatbot
* Acesse http://twil.io/leao do seu celular para vincular seu número com a nossa sandbox.
* Envie mensagens como se fosse realizar algum tipo de operação em uma companhia aérea.
* Caso deseje ativar o atendimento humano, você precisa enviar algum texto que com emoção que possa ser classificada como raiva ou descontentamento.


## Outros códigos-fonte:
* Código-fonte de uso do IBM Watson Assistente e Análise de Emoções: https://github.com/sergiogama/wa-twilio-emotion-sentiment
* Demo da IBM para uso de NLU: https://www.ibm.com/demos/live/natural-language-understanding/self-service (apenas em Inglês)

##  Documentação
* Twilio Programmable Voice: https://www.twilio.com/docs/voice/tutorials/how-to-make-outbound-phone-calls
* TwiML: https://www.twilio.com/docs/voice/twiml
* WhatsApp API: https://www.twilio.com/docs/whatsapp
* IBM Watson Assistente: https://www.ibm.com/cloud/watson-assistant
* IBM Watson NLU: https://www.ibm.com/cloud/watson-natural-language-understanding


