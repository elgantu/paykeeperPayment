
class PC {
    #login = process.env.PK_LOGIN
    #password = process.env.PK_PASSWORD
    #url = process.env.PK_URL

    Login(){
        return this.#login;
    }

    Password(){
        return this.#password;
    }

    Url(){
        return this.#url;
    }
} 

module.exports = new PC()