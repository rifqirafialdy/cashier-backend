const express = require('express')
const { productsController } = require('../controllers')
const upload = require('../middleware/multer')

const router = express.Router()
router.post('/add-product',upload.single('file') ,productsController.addProduct)
router.post('/add-category',productsController.addCategory)
router.post('/edit-product/:id',productsController.editProduct)
router.post('/show-products', productsController.fetchProducts)
router.get('/show-categories', productsController.fetchCategories)
router.get('/show-allproduct', productsController.fetchAllData)
router.post('/edit-category/:id', productsController.editCategories)
router.post('/filter-products', productsController.filterProducts)
router.delete('/delete-product/:id', productsController.deleteProduct)
router.post('/activate/:id',productsController.setIsActive)

module.exports= router