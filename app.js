const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const router = require('./routes/routes')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(router)
app.use(router)
const server = app.listen(process.env.PORT || 8080, () => {
    var port = server.address().port
    console.log("Barberros started on " + port)
})
