const amqp = require("amqplib");

async function consumeMessage(){
    try{
        const connection= await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const queueName = "lazy_notification_queue";
        

        await channel.assertQueue(queueName,{
            durable : true,
            "x-queue-mode" : "lazy"
        });

        channel.consume(queueName, (message)=>{
            if(message !== null){
                console.log("Received message:", message.content.toString());
                channel.ack(message);
            }
            
        })

    }catch(error){
        console.error("Error consuming message:", error);
    }
}
consumeMessage();