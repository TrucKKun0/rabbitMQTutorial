const amqp = require("amqplib");

async function sendMessage(){
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchangeName = "priority_queue_exchange";
        const exchangeType = "topic";
        const routingKey =  "task.placed";
        const data = [
            {
                title : "High Priority Task",
                priority : 1
            },
            {
                title : "Medium Priority Task",
                priority : 5
            },
            {
                title : "Low Priority Task",
                priority : 10
            }
        ]
        await channel.assertExchange(exchangeName, exchangeType,{durable : true});
        data.forEach((msg)=>{
            channel.publish(exchangeName, routingKey,Buffer.from(msg.title),{
                durable : true,
                priority : msg.priority
            });
        });
        console.log("Messages sent to exchange", exchangeName);
        setTimeout(()=>{
            connection.close();
        },500);

    }catch(error){
        console.log(error);
    }
}
sendMessage();