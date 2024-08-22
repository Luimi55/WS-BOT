import type {Conversation} from './models/Conversation'
import type {Message} from './models/Message'
import messagesData from './conf/messages.json' assert { type: 'json' };
import LogService from './services/LogService';
import { Option } from './models/Option';

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
            log.WriteLog('message_create')

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
                if(lastSentMessage != undefined){
                    let foundOption: Option | undefined = lastSentMessage.options.find(opt=>opt.option == msg.body);
                    if (foundOption != undefined) {
                        let nextMessage: Message | undefined = messages.find(message=>message.id == foundOption.messageId);
                        if(nextMessage != undefined){
                            client.sendMessage(conversation.userId, nextMessage.text);
                            conversations.map(newConv => {
                                    if (newConv.userId = conversation.userId) {
                                        newConv.lastMessageId = nextMessage.id
                                    }
                                }
                            )
                        } else {
                            log.WriteLog(`Technical error: MessageId ${foundOption.messageId} is not configured in messages.json`)
                        }
                    } else {
                        //client.sendMessage(conversation.userId, 'Esa opción no existe');
                    }
                } else {
                    log.WriteLog(`Technical error: The las sent message id ${conversation.lastMessageId} not found in messages.json`)
                }

            }
        }
    } catch (ex) {
        log.WriteLog(ex)
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


