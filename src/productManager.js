const fs = require('fs').promises
const express = require('express')

class ProductManager {
    constructor(filePath) {
        this.path = filePath
    }

    async guardarProductosEnArchivo(products) {
        try {
            await fs.writeFile(this.path, JSON.stringify(products, null, '\t'))
            // console.log('Productos guardados en el archivo products.json')
        } catch (err) {
            console.error('Error al guardar productos:', err)
        }
    }

    async getProducts() {
        try {
            const productsData = await fs.readFile(this.path, 'utf8')
            return JSON.parse(productsData) || []
        } catch (error) {
            console.error('Error al leer los productos:', error)
            throw new Error('Error al leer los productos')
        }
    }

    async getProductsById(id) {
        const prods = await this.getProducts()
        const product = prods.find(prod => prod.id === id)

        if (product) {
            return product
        } else {
            throw new Error("Producto no encontrado")
        }
    }

    async updateProduct(id, title, updates) {
        const prods = await this.getProducts()
        const productIndex = prods.findIndex(prod => prod.id === id && prod.title === title)
    
        if (productIndex !== -1) {
            prods[productIndex] = { ...prods[productIndex], ...updates }
            await this.guardarProductosEnArchivo(prods)
            // console.log(`Producto con ID ${id} actualizado`)
            return // Retorna después de guardar los cambios
        } else {
            // console.error("Producto no encontrado")
            return // Evitar acciones adicionales después de este punto
        }
    }

    async deleteProduct(id) {
        const prods = await this.getProducts()
        const productIndex = prods.findIndex(prod => prod.id === id)

        // console.log("ID del producto a eliminar:", id)
        // console.log("Índice del producto en el arreglo:", productIndex)
        // console.log("Productos antes de la eliminación:", prods)

        if (productIndex !== -1) {
            prods.splice(productIndex, 1)
            await this.guardarProductosEnArchivo(prods)
            // console.log(`Producto con ID ${id} eliminado`)
            return // Retorna después de guardar los cambios
        } else {
            // console.error("Producto no encontrado")
            return // Evitar acciones adicionales después de este punto
        }

    }

    // Método router que devuelve un nuevo enrutador cada vez
    router() {
        const router = express.Router()
        router.get('/products', this.getAllProducts.bind(this))
        return router
    }

    async getAllProducts(req, res) {
        try {
            const products = await this.getProducts()
            res.json(products)
        } catch (error) {
            console.error('Error al obtener productos:', error)
            res.status(500).send('Error al obtener productos')
        }
    }
}

module.exports = ProductManager

// Prueba
const main = async () => {
    const productManager = new ProductManager("products.json")
    // console.log(await productManager.getProducts())
    // console.log(await productManager.getProductsById(4))
    await productManager.updateProduct(13, { title: "updated product" })
    await productManager.deleteProduct(7)
}
main()