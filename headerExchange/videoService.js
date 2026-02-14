const amqp = require('amqplib');

async function videoNotification(){
try{
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const exchangeName = "header_exchange";
    const exchangeType = "headers";
    
    await channel.assertExchange(exchangeName, exchangeType , {durable : true});
    const queue = await channel.assertQueue('',{exclusive : true});

    console.log("waiting for notification");
    await channel.bindQueue(queue.queue,exchangeName,"",{
        "x-match" : "all",
        "notification-type" : "new_video",
        "content-type" : "video"
    });
    channel.consume(queue.queue,(message)=>{
        if(message!==null){
            const video = JSON.parse(message.content.toString());
            console.log("Received notification for new video release", video);
            channel.ack(message);
        }
    })
    
}catch(error){
    console.error("Error receiving video notification:", error);
}
}
videoNotification();