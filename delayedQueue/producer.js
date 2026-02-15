const amqp =require('amqplib');

async function sendToDelayedQueue(batchId,orders,delay){
    try{
        const connection = await amqp.connect("amqp:localhost");
        const channel = await connection.createChannel();
        const exchangeName= 'delayed_exchange';
        const exchangeType = 'x-delayed-message';
        const queueName = 'delayed_order_update_queue';

        await channel.assertExchange(exchangeName,exchangeType,{
            arguments : {"x-delayed-type" : "direct"}
        });
        await channel.assertQueue(queueName,{durable : true});
        await channel.bindQueue(queueName,exchangeName,"");
        const message = JSON.stringify({batchId , orders});
        channel.publish(exchangeName,"", Buffer.from(message),{
            headers : {
                'x-delay' : delay
            }
        });
        await channel.close();
        await connection.close();
        console.log(`sent batch ${batchId} to delayed queue with delay of ${delay} ms`);
    }catch(error){
        console.error('Error sending to delayed queue',error);
    }

}
async function processBatchOrders(){
        //batch processing
        const batchId = await generateBatchId();
        const orders = await collectOrderFromBatch();
        console.log(`processing batch ${batchId} with orders : ${JSON.stringify(orders)}` );
        //Update inventroy generate shipping lable and send to delayed queue
        await processOrders(orders);

        //send to delayed queue for further processing
        const delay = 10000; //delay of 1 minute
        await sendToDelayedQueue(batchId,orders,delay);
        

}
async function generateBatchId(){
    return 'batch -' + Date.now();
}
async function collectOrderFromBatch(){
    return [
        {orderId : 1, item : 'item1'},
        {orderId : 2, item : 'item2'},
        {orderId : 3, item : 'item3'},
    ]
}
async function processOrders(order){

}

processBatchOrders();