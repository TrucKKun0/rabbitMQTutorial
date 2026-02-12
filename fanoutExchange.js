const amqp = require('amqplib');

async function sendNotification(message){
    try{
        
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const exchangeName = "new_product_launch_exchange";
        const exchangeType = 'fanout';
        //fanout exchange does not require routing key, it will send message to all the queues binded to it
        //fanout exchange is used when we want to send message to all the queues binded to it
        //it uses temporary queues to send message to all the queues binded to it
        await channel.assertExchange(exchangeName , exchangeType, {durable : true});
        channel.publish(exchangeName, '',Buffer.from(JSON.stringify(message)));
        console.log("Sent nofification");
        setTimeout(()=>{
            connection.close();
        },500);
        
    }catch(error){
        console.log("Error while send Notification");
        
    }
}
sendNotification({id : '123', name : 'Pen', price : '100'})