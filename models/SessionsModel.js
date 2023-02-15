const db = require('../settings/database-connect');
const dbWithPromise = db.promise();


class SessionsModel {
    constructor(table){
        this.table = table
    }

    //Пример проверки сессии по присланному токену
    async checkSession(req,res){
        try{
            if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                const token = req.headers.authorization.split(' ')[1];
                const [getSession] = await dbWithPromise.query(``,{token:token})
                if (!getSession || getSession.length === 0) {
                    return res.status(401).json({ result: false, error: "Not authorized!" });
                }
                return true;
            }
            return res.status(401).json({ result: false, error: "Not authorized!" });
        }catch(error){
            console.log(error)
            return false;
        }
    }
}

module.exports = new SessionsModel(`sessions`);