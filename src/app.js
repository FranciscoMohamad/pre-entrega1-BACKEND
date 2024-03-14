const express = require('express')
const bodyParser = require('body-parser')
const ProductManager = require('./productManager')
const CartManager = require('./CartManager')

const app = express()
const productManager = new ProductManager("products.json")
const cartManager = new CartManager()

app.use(bodyParser.json())

// Definir el enrutador de carritos
const cartRouter = cartManager.getRouter()
app.use('/api/carts', cartRouter)

// Método POST para agregar un nuevo producto
app.post('/api/products', async (req, res) => {
    try {
        const requiredFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category']
        for (const field of requiredFields) {
            if (!(field in req.body)) {
                return res.status(400).send(`El campo '${field}' es obligatorio`)
            }
        }

        // ID único
        let newId
        do {
            newId = Math.floor(Math.random() * 1000000)
        } while (await productManager.getProductsById(newId))

        const { title, description, code, price, status, stock, category, thumbnails } = req.body

        // Nuevo producto con id autogenerado
        const newProduct = {
            id: newId,
            title,
            description,
            code,
            price,
            status: status !== undefined ? status : true,
            stock,
            category,
            thumbnails: thumbnails !== undefined ? thumbnails : []
        }

        await productManager.addProducts(newProduct)

        res.status(201).send('Producto agregado correctamente')
    } catch (error) {
        console.error('Error al procesar la solicitud POST de productos:', error)
        res.status(500).send('Error interno del servidor al agregar un producto')
    }
})

// Definir las demás rutas para las operaciones CRUD de productos aquí...

// Ruta para actualizar un producto por su ID
app.put('/api/products/:productId', async (req, res) => {
    try {
        const productId = parseInt(req.params.productId)

        // Obtener los datos del producto a actualizar
        const { title, description, price, thumbnail, code, stock } = req.body

        // Verificación de los campos
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            return res.status(400).send('Todos los campos son obligatorios')
        }

        // Actualización del producto en products.json
        await productManager.updateProduct(productId, { title, description, price, thumbnail, code, stock })

        res.status(200).send(`Producto con ID ${productId} actualizado correctamente`)
    } catch (error) {
        console.error('Error al actualizar el producto:', error)
        res.status(500).send('Error interno del servidor al actualizar el producto')
    }
})

// Ruta para eliminar un producto por su ID
app.delete('/api/products/:productId', async (req, res) => {
    try {
        const productId = parseInt(req.params.productId)
        await productManager.deleteProduct(productId)
        res.status(200).send(`Producto con ID ${productId} eliminado correctamente`)
    } catch (error) {
        console.error('Error al eliminar el producto:', error)
        res.status(500).send('Error interno del servidor al eliminar el producto')
    }
})

// Ruta para obtener todos los productos
app.get('/api/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit)
        const products = await productManager.getProducts()
        if (limit) {
            const prods = products.slice(0, limit)
            return res.json(prods)
        }
        return res.json(products)
    } catch (error) {
        console.error('Error al obtener productos:', error)
        res.status(500).send('Error al obtener productos')
    }
})

// Ruta para obtener un producto por su ID
app.get('/api/products/:productId', async (req, res) => {
    try {
        const productId = parseInt(req.params.productId)
        const product = await productManager.getProductsById(productId)
        if (product) {
            res.json(product)
        } else {
            res.status(404).json({ error: 'Producto no encontrado' })
        }
    } catch (error) {
        console.error('Error al obtener el producto por ID:', error)
        res.status(500).send('Error al obtener el producto por ID')
    }
})

const PORT = 8080
app.listen(PORT, () => {
    console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`)
})
