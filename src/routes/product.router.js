const { Router } = require('express')
const productsModel = require('../models/product.model')

const router = Router()

router.get('/products', async (req, res) => {

    const page = req.query.page || 1
    const products = await productsModel.paginate({}, { limit:5, page, lean: true })
        console.log(products)
        res.render('products', {
            title:'todos los productos',
            products
        })
})

module.exports = router