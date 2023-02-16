const PaykeeperController = require('./controllers/PaykeeperController')
const BaseController = require('./controllers/BaseController')

module.exports = (app) => {
    app.route('/api/v1/generatePaymentLink/:order_uid').get(async (req, res) => {
        //Проверяем авторизован ли пользователь
        const checkSession = await BaseController.checkSession(req,res)

        if(!checkSession){
            return res.status(401).json({ result: false, error: "Not authorized!" });
        }

        PaykeeperController.generatePaymentLink(req,res)

    })

    app.route('/api/v1/check/:order').get(async (req, res) => {

        //Проверяем авторизован ли пользователь
        const checkSession = await BaseController.checkSession(req,res)

        if(!checkSession){
        return res.status(401).json({ result: false, error: "Not authorized!" });
        }

        PaykeeperController.checkPayment(req,res)

    })

    app.route('/api/v1/callbackPayment').all(async (req, res) => {

        //Роут для получения коллбэков

        console.log(req.params)
        console.log(req.query)
        console.log(req.body)
    })
}