const amqp = require('amqplib');

async function liveStreamNotification(){
try{
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const exchangeName = "header_exchange";
    const exchangeType  = "headers";

    await channel.assertExchange(exchangeName, exchangeType, {durable : true});
    const queue = await channel.assertQueue('', {exclusive : true});

    await channel.bindQueue(queue.queue, exchangeName, "",{
        "x-match" : "all",
        "notificatin-type" : "live_stream",
        "content-type" : "gaming"
    })
    console.log("Waiting for live stream notification");
    channel.consume(queue.queue,(message)=>{
        if(message!==null){
            const liveStream = JSON.parse(message.content.toString());
            console.log("Received notification for live stream starting", liveStream);
            channel.ack(message);
        }
    })
}catch(error){
    console.error("Error receiving live stream notification:", error);
}
}
liveStreamNotification();