const express = require('express')
const { productsController } = require('../controllers')
const upload = require('../middleware/multer')

const router = express.Router()


module.exports= router