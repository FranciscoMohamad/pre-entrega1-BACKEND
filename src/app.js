const express = require('express')
const ProductManager = require('./productManager')

const app = express()
const productManager = new ProductManager("products.json")

app.get('/products', async (req, res) => {
    try {

        const limit = parseInt(req.query.limit)

        if (isNaN(limit) || limit <= 0) {
            return res.status(400).json({ error: 'El parámetro limit debe ser un número mayor que cero' })
        }

        const products = await productManager.getProducts().slice(0, limit)
        res.json(products)
    } catch (error) {
        console.error('Error al obtener productos:', error)
        res.status(500).send('Error al obtener productos')
    }
})

app.get('/product/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid)
        const product = await productManager.getProductsById(productId)
        
        if (product) {
            res.json(product)
        } else {
            res.status(404).json({ error: 'Producto no encontrado' })
        }
    } catch (error) {
        console.error('Error al obtener producto por ID:', error)
        res.status(500).send('Error al obtener producto por ID')
    }
})

// Iniciar el servidor
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`)
})
