const fs = require('fs').promises

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath
    }

    async getProducts() {
        try {
            const productsData = await fs.readFile(this.filePath, 'utf8')
            return JSON.parse(productsData) || []
        } catch (error) {
            throw new Error('Error al leer los productos')
        }
    }

    async getProductsById(productId) {
        try {
            const products = await this.getProducts()
            return products.find(product => product.id === productId)
        } catch (error) {
            throw new Error('Error al obtener el producto por ID')
        }
    }

    async addProducts(product) {
        try {
            const products = await this.getProducts()
            products.push(product)
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2))
        } catch (error) {
            throw new Error('Error al agregar el producto')
        }
    }

    async updateProduct(productId, updatedProduct) {
        try {
            const products = await this.getProducts()
            const index = products.findIndex(product => product.id === productId)
            if (index !== -1) {
                products[index] = { id: productId, ...updatedProduct }
                await fs.writeFile(this.filePath, JSON.stringify(products, null, 2))
            } else {
                throw new Error('Producto no encontrado')
            }
        } catch (error) {
            throw new Error('Error al actualizar el producto')
        }
    }

    async deleteProduct(productId) {
        try {
            let products = await this.getProducts()
            products = products.filter(product => product.id !== productId)
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2))
        } catch (error) {
            throw new Error('Error al eliminar el producto')
        }
    }
}

module.exports = ProductManager