const axios = require('axios').default;

class PaykeeperProvider {
    constructor(login, password, url) {
        this.login = login
        this.password = password
        this.url = url
    }

    //Получение идентификационного токена от PayKeeper
    async getSecureToken(){
        try{

        const {data} = await axios({
            method: 'GET',
            url: `${this.url}/info/settings/token/`,
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
            },
            auth: {
                username: this.login,
                password: this.password
            }
          });
          return data.token;

        }catch(e){
            console.log(e)
            return false;
        }
    }

    //Метод формирования платежной информации(Совет: провалидировать данные, данные пользователей могут быть uid,цифры, любые другие комбинации)
    async builderCorrectPaymentData({amount, clientId, orderId, clientEmail, serviceName, clientPhone}){
        try{

            return {
                "pay_amount": amount, //Цена
                "clientid": clientId, //Идентификатор пользователя
                "orderid": orderId, //Идентификатор заказа
                "client_email": clientEmail, // Email клиента
                "service_name": serviceName, //Название услуги
                "client_phone": clientPhone //Номер телефона клиента
            }

        }catch(e){
            console.log(e)
            return false;
        }
    }

    //Метод создания Счета
    async createInvoice(token, paymentData){
        try{
        const tokenWithPaymentData = Object.assign({token:token}, paymentData)
        const {data} = await axios({
            method: 'POST',
            url: `${this.url}/change/invoice/preview/`,
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
            },
            auth: {
                username: this.login,
                password: this.password
            },
            data: tokenWithPaymentData
          });
          return data.invoice_id;

        }catch(e){
            console.log(e)
            return false;
        }
    }

    //Метод получения счета
    async getInvoice(invoice_id){
        try{
        const {data} = await axios({
            method: 'GET',
            url: `${this.url}/info/invoice/byid/?id=${invoice_id}`,
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
            },
            auth: {
                username: this.login,
                password: this.password
            }
          });
          return data;

        }catch(e){
            console.log(e)
            return false;
        }
    }

    //Генерация корректной ссылки на оплату, для возврата клиенту
    async buildCorrectLink(invoice_id){
        try{
            return `${this.url}/bill/${invoice_id}/`
        }catch(e){
            console.log(e)
            return false;
        }
    }
    
}

module.exports = PaykeeperProvider