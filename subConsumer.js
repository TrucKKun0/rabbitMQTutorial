const amqp = require('amqplib');

async function receiveMail(){
    try{
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertQueue('subscribed_user_queue', { durable : false});

        channel.consume('subscribed_user_queue', (message)=>{
            if(message !==null){
                console.log("message has been received for subscribed user recive", JSON.parse(message.content));
                channel.ack(message);
            }
        })


    }catch(error){
        console.log(error);
        
    }
}
receiveMail();