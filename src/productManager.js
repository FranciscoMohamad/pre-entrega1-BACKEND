const mongoose = require('mongoose');
const { Product } = require('./models');

class ProductManager {
    async addProduct(newProduct) {
        try {
            const product = new Product(newProduct);
            await product.save();
            console.log('Producto agregado correctamente');
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            throw new Error('Error al agregar el producto');
        }
    }

    async getAllProducts() {
        try {
            const products = await Product.find();
            return products;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw new Error('Error al obtener productos');
        }
    }

    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            if (product) {
                return product;
            } else {
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
            throw new Error('Error al obtener el producto por ID');
        }
    }

    async updateProduct(id, updates) {
        try {
            const product = await Product.findByIdAndUpdate(id, updates, { new: true });
            if (product) {
                console.log(`Producto con ID ${id} actualizado correctamente`);
            } else {
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            throw new Error('Error al actualizar el producto');
        }
    }

    async deleteProduct(id) {
        try {
            const product = await Product.findByIdAndDelete(id);
            if (product) {
                console.log(`Producto con ID ${id} eliminado correctamente`);
            } else {
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw new Error('Error al eliminar el producto');
        }
    }
}

module.exports = ProductManager;
