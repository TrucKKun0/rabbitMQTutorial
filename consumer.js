const amqp = require('amqplib');

async function receiveMail(){

    try{
        const connection = await amqp.connect('amqp:/localhost');
        const channel = await connection.createChannel();
        //Create an queue from where we will consume the message
        await channel.assertQueue('mail_queue', {durable : false});
        //Consuming message from queue
        //channel.consume() is used to consume messages from the queue. It takes the queue name and a callback function as arguments. 
        // The callback function is called whenever a message is received from the queue. 
        // The message is passed as an argument to the callback function. 
        // We can use channel.ack() to acknowledge that we have received the message and processed it. 
        // If we do not acknowledge the message, it will be requeued and sent to another consumer.
        channel.consume('mail_queue',(message)=>{
            if(message!== null){
                console.log("mail received", JSON.parse(message.content));
                channel.ack(message);
            }

        })
        
    }catch(error){
        console.log(error);
    }

}

receiveMail();