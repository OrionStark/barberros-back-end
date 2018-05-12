const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('dev'))

app.get('*', (req, res, next) => {
    /* Nanti checking session disini, sementara kosong dulu */
    next()
})


const server = app.listen(process.env.PORT || 8080, () => {
    var port = server.address().port
    console.log("Barberros started on " + port)
})
