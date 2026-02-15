const amqp = require("amqplib");

async function processOrderUpdate(){
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const queueName = 'delayed_order_update_queue';

        await channel.assertQueue(queueName,{durable : true});

        channel.consume(queueName,async (batch)=>{
            if (batch !== null){
                const {batchId} = JSON.parse(batch.content.toString());
                console.log(`Received batch ${batchId} from delayed queue for further processing`);
                await updateOrderStatus(batchId);
                channel.ack(batch);
            }
        },{
            noAck : false
        })
    }catch(error){
        console.log(error);
        
    }
}
function updateOrderStatus(batchId){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            console.log(`Order status for batch ${batchId} updated to shipped`);
            resolve();
        },2000);
    });
}
processOrderUpdate();