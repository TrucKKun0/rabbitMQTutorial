const amqp = require('amqplib');

async function SMSNotification(){
    try{
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const exchangeName = "new_product_launch_exchange";
        const exchangeType = 'fanout';

        await channel.assertExchange(exchangeName, exchangeType, {durable : true});
        const queue  =  await channel.assertQueue('',{exclusive : true});
        console.log("Waitng for SMS notification",queue);

        await channel.bindQueue(queue.queue, exchangeName , "");
        channel.consume(queue.queue,(message)=>{
            if(message!==null){
                const product = JSON.parse(message.content.toString());
                console.log("SMS notification received for new product launch", product);
                channel.ack(message);
            }
        })
        
    }catch(error){
        console.error("Error receiving SMS notification:", error);
    }
}
SMSNotification();