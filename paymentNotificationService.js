const amqp = require('amqplib');

async function receiveOrderNotification(){

    try{
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const exchangeName = "notification_exchange";
        const exchangeType = 'topic';
        const queueName = 'payment_queue';

        await channel.assertExchange(exchangeName, exchangeType,{durable : true});
        await channel.assertQueue(queueName, {durable : true});

        await channel.bindQueue(queueName , exchangeName, 'payment.*');
        channel.consume(queueName, (message)=>{
            if(message !== null){
                console.log("Payment notification received", JSON.parse(message.content));
                channel.ack(message);
            }
        })


    }catch(error){
        console.error("Error receiving order notification:", error);
    }

}
receiveOrderNotification();