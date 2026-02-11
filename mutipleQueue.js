const ampq = require('amqplib');

async function sendMail(){
    try{
        const connection = await ampq.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const message = {
            to : 'test1@gmail.com',
            from : 'test2@gmail.com',
            subject : 'test mail',
            body : 'This is a test mail'
        };
        const message2 = {
            to : 'test3@gmail.com',
            from : 'test4@gmail.com',
            subject : 'test mail',
            body : 'This is a test mail'
        }

        const exchangeName = 'mail_exchange';
        const routingKeyForSubUser = 'send_mail_to_subscribed_user';
        const routingKeyForNormalUser = 'send_mail_to_users';

        await channel.assertExchange(exchangeName,'direct', {durable : false});

        await channel.assertQueue('subscribed_user_queue', { durable : false});
        await channel.assertQueue('user_mail_queue', {durable : false});

        await channel.bindQueue('subscribed_user_queue', exchangeName , routingKeyForSubUser);
        await channel.bindQueue('user_mail_queue',exchangeName, routingKeyForNormalUser);

        channel.publish(exchangeName, routingKeyForSubUser, Buffer.from(JSON.stringify(message)));
        console.log("Message has been sent to subscribed user ", message);

        channel.publish(exchangeName, routingKeyForNormalUser, Buffer.from(JSON.stringify(message2)));
        console.log("Message has been sent to normal user ", message2);

        setInterval(()=>{
            connection.close();
        },5000);
        

    }catch(error){
        console.log(error);
        
    }
}
sendMail();