const amqp = require('amqplib');

async function headerExchange(headers,message){
    try{
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const exchangeName = "header_excahnge";
        const exchangeType = "headers";

        await channel.assertExchange(exchangeName, exchangeType,{durable : true});
        channel.publish(exchangeName , "",Buffer.from(JSON.stringify(message)),{persistent : true,headers});
        console.log("Sent notification with headers", headers);
            setTimeout(()=>{
            connection.close();
        },500);
    }catch(error){
        console.log(error);
    }

}
headerExchange({
    "x-header" : "all",
    "notification-type" : "new_video",
    "content-type" : "video"
},{
    title : "New Video Released",
    description : "Check out our latest video on RabbitMQ header exchange!"
});

headerExchange({
    "x-header" : "all",
    "notification-type": "live_stream",
    "content-type" : "gaming"
},{
    title : "Live Stream Starting",
    description : "Join us for an exciting live stream on gaming!"
});

headerExchange({
    "x-match" : "any",
"notification-type-like" : "like"


},
   { 
    description : "New Like on the vlog"}
);
headerExchange({
    "x-match" : "any",
    "notification-type-comment" : "comment",
    
},{
    description : "New Comment on the vlog"
})