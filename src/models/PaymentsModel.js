const db = require('../settings/database-connect');
const dbWithPromise = db.promise();


class PaymentsModel {
    constructor(table){
        this.table = table
    }

    async insertPayment({order, client, status, paytype, sum, invoice_id}){
        try{
            const [payementInser] = await dbWithPromise.query(``, {order, client, status, paytype, sum, invoice_id})
            if(payementInser.affectedRows == 1){

                return true;

            }else {

                return false;

            }
        }catch(error){
            console.log(error)
            return false;
        }
    }

    async updatePayment({invoice_id, status}){
        try{
            const [payementInser] = await dbWithPromise.query(``, {status, invoice_id})
            if(payementInser.affectedRows == 1){

                return true;

            }else {

                return false;

            }
        }catch(error){
            console.log(error)
            return false;
        }
    }
    async getLastPayment({order}){
        try{
            const [lastPayment] = await dbWithPromise.query(``,{order})
            console.log(lastPayment)
            if(lastPayment.length > 0){

                return lastPayment;

            }else {

                return false;

            }
        }catch(error){
            console.log(error)
            return false;
        }
    }
}

module.exports = new PaymentsModel(`payments`);