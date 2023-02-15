const db = require('../settings/database-connect');
const dbWithPromise = db.promise();


class ClientsModel {
    async getUserById(userId){
        try{
                const [user] = await dbWithPromise.query(``,{id:userId})
                return user
        }catch(error){
            console.log(error)
            return false;
        }
    }
}