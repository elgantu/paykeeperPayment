require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 5000
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false, limit: '5gb'}))
app.use(bodyParser.json({limit: '5gb'}))

const routes = require('./src/router.js')
routes(app)

app.listen(port, () => {
        console.log(`App listen on port ${port}`)
})