const express = require('express')
const mongoose = require('mongoose')

//handlebars-websockets
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')

//Routes
const productRouter = require('./routes/product.router')

const bodyParser = require('body-parser')
const ProductManager = require('./productManager')
const CartManager = require('./cartManager')

const app = express()
const productManager = new ProductManager("products.json")
const cartManager = new CartManager()

// configurar handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

// permitir envío de información mediante formularios y JSON
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// setear carpeta public como estática
app.use(express.static(`${__dirname}/../public`))

app.use('/', require('./routes/product.router'))


app.use(bodyParser.json())


const httpServer = app.listen(8080, () => {
    console.log('Servidor listo!')
})

// creamos un servidor para WS desde el servidor HTTP que nos da express
const socketServer = new Server(httpServer)

// escuchamos al evento "cliente conectado"
socketServer.on('connection', socket => {
    console.log(`Nuevo cliente conectado: ${socket.id}`)
})

// Definir el enrutador de carritos
const cartRouter = cartManager.getRouter()
app.use('/api/carts', cartRouter)

                //RUTAS CRUD en localHost
// Método POST para agregar un nuevo producto
app.post('/api/products', async (req, res) => {
    try {
        // ... Validación de campos y otros procesos ...

        const { title, description, code, price, status, stock, category, thumbnails } = req.body

        // Nuevo producto sin especificar el ID
        const newProduct = {
            title,
            description,
            code,
            price,
            status: status !== undefined ? status : true,
            stock,
            category,
            thumbnails: thumbnails !== undefined ? thumbnails : []
        }

        await productManager.addProduct(newProduct)

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
        const products = await productManager.getAllProducts();
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener productos');
    }
});

// Ruta para obtener un producto por su ID
app.get('/api/products/:productId', async (req, res) => {
    try {
        const productId = parseInt(req.params.productId)
        const product = await productManager.getProductById(id.toString());

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

const main = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://elmoha624:Horacio2001@mydatabase.d2i56hu.mongodb.net/?retryWrites=true&w=majority&appName=MyDataBase',
            {
                dbName: 'MyDataBase'
            }
        );
        console.log('Conexión exitosa a la base de datos MongoDB');
    } catch (error) {
        console.error('Error al conectar con la base de datos MongoDB:', error);
        throw error; // Agregamos esto para propagar el error y detener la ejecución si hay un problema de conexión
    }
}

const PORT = 8081
app.listen(PORT, () => {
    console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`)
})

main()
