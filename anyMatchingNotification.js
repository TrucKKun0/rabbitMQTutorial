const amqp = require('amqplib');

async function AnyMatchingNotification(){
    try{
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannle();
        const exchangeName = "header_exchange";
        const exchangeType = "headers";

        await channel.assertExchange(exchangeName , exchangeType, {durable : true});
        const queue = await channel.assertQueue('',{exclusive : true});
        console.log("Waiting for any matching notification", queue);

        await channel.bindQueue(queue.queue, exchangeName, "",{
            "x-match" : "any",
            "notification-type-like" : "like",
            "notification-type-comment" : "comment",
        })
        channel.consume(queue.queue,(message)=>{
            if(message!==null){
                const notification = JSON.parse(message.content.toString());
                console.log("Received notification for any matching notification", notification);
                channel.ack(message);
            }
        })
    }catch(error){
        console.error("Error receiving notification:", error);
    }
}

AnyMatchingNotification();