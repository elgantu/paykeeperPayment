const SessionsModel = require('../models/SessionsModel')

exports.checkSession = async (req,res) => {
    const cheked = await SessionsModel.checkSession(req,res)
    return cheked;
}