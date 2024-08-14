const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

var step = "1";

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('message_create', message => {
    
	if (message.body.includes('!ping')) {
        let messageResponse = "";
        if(step == "1"){
            messageResponse = "Buenas tardes cliente que desea saber? \n 1. A que hora abren \n 2. Cuales son sus servicios"
            client.sendMessage(message.from, messageResponse);
            step = "2";
        } else if(step == 2 && message.body == "!ping 1"){
            messageResponse = "Abrimos a las 8:00 AM"
            client.sendMessage(message.from, messageResponse);
            step = "1";
        } else if(step == 2 && message.body == "!ping 2"){
            messageResponse = "Nuestros servicios son:\n 1. Manicure\n 2. Pedicure\n 3. Lavado de cabeza"
            client.sendMessage(message.from, messageResponse);
            step = "1";
        }
	}
});

client.initialize();
