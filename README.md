# Integra WhatsApp com análise de sentimentos através da Twilio e IBM Watson
Este código está relacionado ao webinar em parceria com a IBM realizado em Fevereiro/2021.
Caso tenha interesse em assistir ao webinar, [clique aqui](https://ahoy.twilio.com/webinar-twilio-ibm-integracao-nlu-1)

Esta aplicação funciona como um middleware conectando o webhook da Twilio com uma API desenvolvida em node-red pela IBM que aciona o Watson Assistente e a NLU da IBM em alguns intents (falar com atendente e fallback). Dependendo do valor de alguns atributos retornados pela NLU, o sistema irá chamar a API da Twilio para realizar uma chamada telefônica para o número do WhatsApp que originou a conversa. Ao efetuar a chamada, o usuário é inserido em uma sala de conferência, porém fica em espera até que um segundo participante entre na sala.

## Teste este chatbot
* Acesse http://twil.io/leao do seu celular para vincular seu número com a nossa sandbox.
* Envie mensagens como se fosse realizar algum tipo de operação em uma companhia aérea.
* Caso deseje ativar o atendimento humano, você precisa enviar algum texto que com emoção que possa ser classificada como raiva ou descontentamento.

## Quer rodar como tutorial?

Antes de iniciar o programa você precisa realizar alguns procedimentos:
* Criar uma conta Twilio
* Configurar o ambiente do Watson Assistente e Watson NLU usando este [código-fonte](https://github.com/sergiogama/wa-twilio-emotion-sentiment)
* Preencher as variáveis do arquivo `.env.sample`
* Modificar o nome do arquivo de `.env.sample` para `.env`


Para rodar essa aplicação execute os seguintes comandos no seu terminal:
```
npm install
npm start
```

Veja as etapas a seguir, cada passo implementa uma função específica:
* [0_server.js](tutorial/0_server.js) Esqueleto básico, inicializando as bibliotecas e webhooks possíveis
* [1_server.js](tutorial/1_server.js) Resposta do webhook do WhatsApp e chamando API da IBM
* [2_server.js](tutorial/2_server.js) Fazendo a chamada telefônica caso a API da IBM retorne necessidade de contato humano (e verificação do nono dígito)
* [3_server.js](tutorial/3_server.js) Resposta do webhook de início da chamada para adicionar na sala de espera
* [4_server.js](tutorial/4_server.js) Resposta do webhook da sala de espera da conferência
* [5_server.js](tutorial/5_server.js) Código final com comando para encerrar todas as ligações ativas




## Outros códigos-fonte:
* Código-fonte de uso do IBM Watson Assistente e Análise de Emoções: https://github.com/sergiogama/wa-twilio-emotion-sentiment


##  Documentação
* Twilio Programmable Voice: https://www.twilio.com/docs/voice/tutorials/how-to-make-outbound-phone-calls
* TwiML: https://www.twilio.com/docs/voice/twiml
* WhatsApp API: https://www.twilio.com/docs/whatsapp
* IBM Watson Assistente: https://www.ibm.com/cloud/watson-assistant
* IBM Watson NLU: https://www.ibm.com/cloud/watson-natural-language-understanding
* Demo da IBM para uso de NLU: https://www.ibm.com/demos/live/natural-language-understanding/self-service (apenas em Inglês)





Caso tenha alguma dúvida, entre em contato com lleao [arroba] twilio.com.