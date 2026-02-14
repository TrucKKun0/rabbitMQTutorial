const amqp = require("amqplib");

async function receiveMail(){
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel =  await connection.createChannel();

        await channel.assertQueue('user_mail_queue', {durable : false});
        
        channel.consume('user_mail_queue',(message)=>{
            if(message!==null){
                console.log("Message received for Normal User",JSON.parse(message.content));
                channel.ack(message);
                
            }
        })
    }catch(error){
        console.log(error);
        
    }
}
receiveMail();