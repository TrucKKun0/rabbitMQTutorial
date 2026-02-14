const amqp = require("amqplib");

async function consumeMessage(){
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchangeName = "priority_queue_exchange";
        const exchangeType = "topic";
        const queueName = "priority_queue";

        await channel.assertExchange(exchangeName,exchangeType,{durable : true});
        await channel.assertQueue(queueName, {durable : true,arguments:{"x-max-priority" : 10}});
        await channel.bindQueue(queueName, exchangeName, "task.*");
        console.log("Waiting for messages");
        channel.consume(queueName,(message)=>{
            if(message !== null){
                const task = message.content.toString();
                console.log("Received task", task);
                channel.ack(message);
            }
        })

        
    }
    catch(error){
        console.log(error);
    }
}
consumeMessage();