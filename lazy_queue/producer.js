const amqp = require("amqplib");

async function setUp(message){
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchangeName = "notification_exchange";
        const queueName = "lazy_notification_queue";
        const routingKey = "notification.key";

        await channel.assertExchange(exchangeName, " direct", { durable : true});
        await channel.assertQueue(queueName, {durable : true , arguments : {"x-queue-mode" : 'lazy'}});
        await channel.bindQueue(queueName, exchangeName, routingKey);

        channel.publish(exchangeName,routingKey,Buffer.from(message));

        console.log("Message sent to the queue:", message);
        await channel.close();
        await connection.close();
         

    }catch(error){
        console.error("Error setting up producer:", error);
    }
}

setUp("Hello, this is a message from the producer!");