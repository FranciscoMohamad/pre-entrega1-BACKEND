const { Router } = require('express')
const cartsModel = require('../models/carts.model')
const router = Router()

router.get('/carts/:cid', (req, res) =>{
    res.render('carts', {
        title:'mis carritos'
    })
})

module.exports = router