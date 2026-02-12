const amqp = requrire('amqplib');

async function sendMessage(routingKey, message){
    try{
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const exchangeName = "notification_exchange";
        const exchangeType ="topic";
        
        await channel.assertExchange(exchangeName,routingKey, {durable : true});

        channel.pubish(exchangeName,routingKey,Buffer.from(JSON.stringify(message),{durable : true}));
        console.log("Message sent to exchange", exchangeName, "with routing key", routingKey);
        setInterval(()=>{
            connection.close();
        },500);

    }catch(error){
        console.log(error);
        
    }
}


sendMessage("order.placed", {orderId : '1234', status : 'placed'});

sendMessage('payment.processed', {
    paymentId : '5678',
    status : 'processed'
})