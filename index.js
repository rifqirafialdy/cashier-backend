const express = require('express')
const PORT = 8001
const app = express()
const { db, query } = require("./database")
const { productsRoute } = require('./Routes')
const cors = require('cors');

app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use('/products',productsRoute)


app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT)
})