import type {Conversation} from './models/Conversation'
import type {Message} from './models/Message'
import messagesData from './conf/messages.json' assert { type: 'json' };
import LogService from './services/LogService';

const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

const log = LogService();

let messages: Message[] = messagesData;

let conversations: Conversation[] = [];


client.on('ready', () => {
    log.WriteLog('Client is ready!')
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

const main = () => {
    try {
        log.CreateDirIfNotExist();
        client.initialize();
    } catch (error) {
        console.log(error)
    }
}

main();


