const fs = require('fs')
const express = require('express')
const router = express.Router()

let nextCartId = 1

try {
    const carts = JSON.parse(fs.readFileSync('carrito.json', 'utf8'))
    if (carts.length > 0) {
        nextCartId = carts[carts.length - 1].id + 1
    }
} catch (error) {
    console.error('Error al leer los carritos existentes:', error)
}

// Ruta POST para crear un carrito
router.post('/', (_, res) => {
    try {
        // Creo un nuevo carrito con un ID autoincrementado y un array vacío de productos
        const newCart = {
            id: nextCartId++,
            products: []
        }

        // leo los carritos existentes dentro de carrito.json
        let carts = []
        try {
            carts = JSON.parse(fs.readFileSync('carrito.json', 'utf8'))
        } catch (error) {
            console.error('Error al leer los carritos existentes:', error)
        }

        carts.push(newCart)
        fs.writeFileSync('carrito.json', JSON.stringify(carts, null, 2))

        res.status(201).json(newCart)
    } catch (error) {
        console.error('Error al crear el carrito:', error)
        res.status(500).send('Error interno del servidor al crear el carrito')
    }
})


router.get('/:cid', (req, res) => {
    try {
        const cartId = parseInt(req.params.cid)
        const carts = JSON.parse(fs.readFileSync('carrito.json', 'utf8'))
        const cart = carts.find(cart => cart.id === cartId)

        if (cart) {
            res.json(cart)
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' })
        }
    } catch (error) {
        console.error('Error al obtener el carrito:', error)
        res.status(500).send('Error interno del servidor al obtener el carrito')
    }
})

// Ruta POST para añadir un producto a el carrito por su ID
router.post('/:cid/product/:pid', (req, res) => {
    try {
        // extraigo el id del producto y de los parametros
        const cartId = parseInt(req.params.cid)
        const productId = parseInt(req.params.pid)

        let carts = JSON.parse(fs.readFileSync('carrito.json', 'utf8'))

        const cart = carts.find(cart => cart.id === cartId)

        if (cart) {
            const quantity = req.body.quantity || 1
            cart.products.push({ id: productId, quantity })

            
            fs.writeFileSync('carrito.json', JSON.stringify(carts, null, 2))

            
            res.status(200).json(cart)
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' })
        }
    } catch (error) {
        console.error('Error al añadir el producto al carrito:', error)
        res.status(500).send('Error interno del servidor al añadir el producto al carrito')
    }
})

module.exports = router