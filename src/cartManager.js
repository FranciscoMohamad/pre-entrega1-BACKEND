const fs = require('fs').promises
const express = require('express')
const router = express.Router() // Importa express y crea una instancia de Router

class ProductManager {
    constructor(filePath) {
        this.path = filePath
    }

    async guardarProductosEnArchivo(products) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
            console.log('Productos guardados en el archivo products.json')
        } catch (err) {
            console.error('Error al guardar productos:', err)
        }
    }

    async getProducts() {
        try {
            const productsData = await fs.readFile(this.path, 'utf8')
            return JSON.parse(productsData) || []
        } catch (error) {
            throw new Error('Error al leer los productos')
        }
    }

    async getProductsById(id) {
        const prods = await this.getProducts()
        const product = prods.find(prod => prod.id === id)

        if (product) {
            return product
        } else {
            console.error("Product not found")
        }
    }

    async updateProduct(id, updates) {
        const prods = await this.getProducts()
        const productIndex = prods.findIndex(prod => prod.id === id)

        if (productIndex !== -1) {
            prods[productIndex] = { ...prods[productIndex], ...updates }
            await this.guardarProductosEnArchivo(prods)
            console.log(`Producto con ID ${id} actualizado`)
        } else {
            console.error("Producto no encontrado")
        }
    }

    async deleteProduct(id) {
        const prods = await this.getProducts()
        const productIndex = prods.findIndex(prod => prod.id === id)

        console.log("ID del producto a eliminar:", id)
        console.log("Índice del producto en el arreglo:", productIndex)
        console.log("Productos antes de la eliminación:", prods)

        if (productIndex !== -1) {
            prods.splice(productIndex, 1)
            await this.guardarProductosEnArchivo(prods)
            console.log(`Producto con ID ${id} eliminado`)
        } else {
            console.error("Producto no encontrado")
        }

        console.log("Productos después de la eliminación:", prods)
    }

    // Método router que devuelve el enrutador
    router() {
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
    console.log(await productManager.getProducts())
    console.log(await productManager.getProductsById(1))
    await productManager.updateProduct(2, { title: "updated product" })
    await productManager.deleteProduct(2)
}
main()