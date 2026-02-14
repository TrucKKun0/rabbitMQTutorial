const amqp = require('amqplib');

async function receivePushNotification(){
    try{
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const excahngeName =  "new_product_launch_exchange";
        const exchangeType = 'fanout';

        await channel.assertExchange(excahngeName,exchangeType,{durable: true});

        const queue = await channel.assertQueue('', {exclusive: true});
        console.log("waiting for messages", queue);
        //queue.queue is the name of the temporary queue created by rabbitmq, it is unique for each consumer
        await channel.bindQueue(queue.queue,excahngeName,'');

        channel.consume(queue.queue,(message)=>{
            if(message !== null){
                const product = JSON.parse(message.content.toString());
                console.log("New product launched", product);
                channel.ack(message);
            }
        })
        
    }catch(error){
        console.error("Error receiving push notification:", error);
    }
}
receivePushNotification();