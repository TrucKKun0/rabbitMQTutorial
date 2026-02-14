const amqp = require('amqplib');

async function sendMail(){
    try{
        const connection =  await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const exchangeName = 'mail_exchange';
        const routingKey = 'send_mail';
        const message = {
            to: 'test@gmail.com',
            from : 'test1@gmail.com',
            subject : 'Test mail',
            body : 'This is a test mail' 
        };
        //Create an exchange
        //Use channel.assertExchange() to create an exchange with the exchange name, 
        //exchange type(direct, fanout and other) and options.
        //durable means that the exchange will survive a broker restart. 
        // If durable is set to false, the exchange will be deleted when the broker restarts.
        await channel.assertExchange(exchangeName, 'direct', {durable : false});

        //Create a queue
        //Use channel.assertQueue() to create a queue with the queue name and options.
        await channel.assertQueue('mail_queue',{durable : false});
        
        //Bind the queue to exchange
        //Use channel.bindQueue() to bind the queue to the exchange with the routing key.
        await channel.bindQueue('mail_queue', exchangeName,routingKey);

        //Publish a message to the exchange
        //Use channel.publish() to publish a message to the exchange with the routing key and message content.
         channel.publish(exchangeName , routingKey,Buffer.from(JSON.stringify(message)));
        console.log("Mail has been sent");
        
        setInterval(()=>{
                connection.close();
        },5000);
    }catch(err){
        console.log(err);
    }
}
sendMail();