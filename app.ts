import type {Conversation} from './models/Conversation'
import type {Message} from './models/Message'

const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

let messages: Message[] = [
    {
        id: "0",
        text: "Hola elija una opcion:\nElejir 1\nElejir 2",
        validValues: ["1", "2"]
    },
    {
        id: "1",
        text: "Opcion 1:\nElejir 1\nElejir 2",
        validValues: ["1", "2"]
    },
    {
        id: "2",
        text: "Opcion 2\nElejir 1",
        validValues: ["1"]
    },
    {
        id: "1.1",
        text: "Opcion 1.1:\nFin",
        validValues: []
    },
    {
        id: "1.2",
        text: "Opcion 1.2:\nFin",
        validValues: []
    },
    {
        id: "2.1",
        text: "Opcion 2.1:\nFin",
        validValues: []
    },

]

let conversations: Conversation[] = [];


client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('message_create', msg => {
    try {
        const conversation: Conversation | undefined = conversations.find(conv => conv.userId == msg.from);
        if (msg.body.includes('!nexo')) {

            if (conversation === undefined) {
                conversations.push({
                    userId: msg.from,
                    lastMessageId: "0"
                })
                client.sendMessage(msg.from, messages[0].text)
            }

        } else {
            if (conversation != undefined) {
                let lastSentMessage: Message | undefined = messages.find(messsage => messsage.id == conversation.lastMessageId);
                let isValidResponse: boolean | undefined = lastSentMessage?.validValues.some(val => val == msg.body);
                if (isValidResponse) {
                    let nextMessage: Message | undefined;
                    let nextMessageId: string;
                    if (lastSentMessage?.id == "0") {
                        nextMessageId = msg.body;
                        nextMessage = messages.find(messsage => messsage.id == msg.body);
                    } else {
                        nextMessageId = `${conversation.lastMessageId}.${msg.body}`;
                        nextMessage = messages.find(messsage => messsage.id == nextMessageId);
                    }
                    if(nextMessage != undefined){
                        client.sendMessage(conversation.userId, nextMessage.text);
                        conversations.map(newConv => {
                                if (newConv.userId = conversation.userId) {
                                    newConv.lastMessageId = nextMessage.id
                                }
                            }
                        )
                    } else {
                        // Log: Error tecnico: El id nextMessageId no esta configurado en el JSON de mensajes
                        //client.sendMessage(conversation.userId, 'Ha ocurrido un error. Favor intentar en unos segundos.');
                    }
                } else {
                    //client.sendMessage(conversation.userId, 'Esa opción no existe');
                }
            }
        }
    } catch (ex) {
        console.log(ex)
    }
});

client.initialize();
