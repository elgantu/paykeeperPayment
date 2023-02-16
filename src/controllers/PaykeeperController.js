const PC = require('../settings/paykeeper-config')
const PaykeeperProvider = require('../Providers/PaykeeperProvider')
const OM = require('../models/OrdersModel')
const PI = new PaykeeperProvider(PC.Login(), PC.Password(), PC.Url())
const PM = require('../models/PaymentsModel')


//Обрабатываем и работаем с счетом от подготовки данных, до выдачи ссылки на оплату.
exports.generatePaymentLink = async (req, res) => {
    try {

        const order = {
            amount: 0,
            clientId: '',
            orderId: '',
            clientEmail: '',
            serviceName: '',
            clientPhone: ''
        }


        if (order === false) {
            return res.status(400).json({ result: false, error: "Неккоректный uid заказа" })
        }

        const payment = await PI.builderCorrectPaymentData({ order })

        if (payment === false) {
            return res.status(400)
        }


        const token = await PI.getSecureToken()

        if (token === false) {
            return res.status(400)
        }

        //Получаем id созданного счета
        const invoice_id = await PI.createInvoice(token, payment)

        if (invoice_id === false) {
            return res.status(400)
        }


        //Пример что делать дальше, например обратимся к таблице БД PaymentModel и создадим счет в нашей таблице.
        // const insertPayment = await PM.insertPayment()

        // if(insertPayment === false){
        //     return res.status(400)
        // }

        const correctLink = await PI.buildCorrectLink(invoice_id)

        if (correctLink === false) {
            return res.status(400)
        }

        return res.status(200).json({ result: true, link: correctLink })
    } catch (e) {
        return res.status(500).json({ result: false, message: 'Server error[generatePaymentLink]' })
    }

}


//Метод получения информации о статусе счета. Т.к. человек может инициализировать несколько счетов для оплаты одного заказа, нам необходимо получить, либо текущий, либо последний инициализированный счет
//Здесь описан пример логики по получению последнего счета и присвоения ему статуса
exports.checkPayment = async (req, res) => {
    try {

        const order = await OM.getOrder(req.params.order) //Получаем заказ


        if (order === false) {
            return res.status(400).json({ result: false, error: "Неккоректный uid заказа" })
        }

        const lastPayment = await PM.getLastPayment({ order: order[0]['id'] })


        if (lastPayment === false) {
            return res.status(400).json({ result: false, error: "Неккоректный uid заказа" })
        }

        if (lastPayment[0].status == 2) {
            return res.status(200).json({ result: true, status: "Успешно оплачен", status_id: lastPayment[0].status })
        }

        if (lastPayment[0].status == 3) {
            return res.status(200).json({ result: true, status: "При оплате возникла ошибка", status_id: lastPayment[0].status })
        }

        if (lastPayment[0].status == 1) {
            const invoice = await PI.getInvoice(lastPayment[0].invoice_id)

            if (invoice.status == 'paid') {
                const updatePayment = await PM.updatePayment({ invoice_id: lastPayment[0].invoice_id, status: 2 })
                if (updatePayment == true) {
                    return res.status(200).json({ result: true, status: "Успешно оплачен", status_id: 2 })
                }
            }
            if (invoice.status == 'created') {
                return res.status(200).json({ result: true, status: "Создан", status_id: lastPayment[0].status })
            }
        }

        return res.status(400).json({ result: false, error: "Что-то пошло не так" })
    } catch (e) {
        return res.status(500).json({ result: false, message: 'Server error[checkPayment]' })
    }
}