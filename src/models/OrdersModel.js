const db = require('../settings/database-connect');
const dbWithPromise = db.promise();


class OrdersModel {
    constructor(table){
        this.table = table
    }
    //Метод получения информации о заказе
    async getOrder(order_uid){
        try{
                const [order] = await dbWithPromise.query(``,{order_uid:order_uid})
                return order
        }catch(error){
            console.log(error)
            return false;
        }
    }
}

module.exports = new OrdersModel(`orders`);