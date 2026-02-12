const amqp = require('amqplib');

async function receiveOrderNotification(){
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const exchangeName = "notification_exchange";
    const exchangeType = "topic";
    const queueName = 'orderQueue';

    await channel.assertExchange(exchangeName,exchangeType,{durable : true});

    await channel.assertQueue(queueName, {durable : true});
    // Bind the queue to the exchange with a routing key pattern to receive order-related messages
    await channel.bindQueue(queueName, exchangeName, "order.*");
    
    channel.consume(queueName,(message)=>{
        if(message !== null){
            console.log("Order has been received",JSON.parse(message.content));
            channel.ack(message);
        }
    })
}
receiveOrderNotification();