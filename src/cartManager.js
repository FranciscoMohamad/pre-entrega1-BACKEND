const fs = require('fs').promises;
const express = require('express');

class CartManager {
    constructor() {
        this.cartFilePath = 'carrito.json';
        this.router = express.Router();
        this.router.get('/', this.getAllCartsHandler.bind(this));
        this.router.post('/', this.createCartHandler.bind(this));
        this.router.get('/:cartId', this.getCartByIdHandler.bind(this));
        this.router.post('/:cartId/products/:productId', this.addProductToCartHandler.bind(this));
        this.nextCartId = this.getNextCartId();
    }

    async getAllCartsHandler(req, res) {
        try {
            const carts = await this.readCarts();
            res.json(carts);
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
            res.status(500).send('Error interno del servidor');
        }
    }

    async createCartHandler(req, res) {
        try {
            const newCart = await this.createCart();
            res.status(201).json(newCart);
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            res.status(500).send('Error interno del servidor');
        }
    }

    async getCartByIdHandler(req, res) {
        try {
            const cartId = parseInt(req.params.cartId);
            const cart = await this.getCartById(cartId);
            res.json(cart);
        } catch (error) {
            console.error('Error al obtener el carrito por ID:', error);
            res.status(500).send('Error interno del servidor');
        }
    }

    async addProductToCartHandler(req, res) {
        try {
            const cartId = parseInt(req.params.cartId)
            const productId = parseInt(req.params.productId)
            const quantity = req.body.quantity || 1; // Establecer el valor predeterminado a 1 si no se proporciona en la solicitud
            const updatedCart = await this.addProductToCart(cartId, productId, quantity)
            res.json(updatedCart)
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error)
            res.status(500).send('Error interno del servidor')
        }
    }

    async readCarts() {
        try {
            const cartsData = await fs.readFile(this.cartFilePath, 'utf8');
            return JSON.parse(cartsData) || [];
        } catch (error) {
            throw new Error('Error al leer los carritos existentes');
        }
    }

    async saveCarts(carts) {
        try {
            await fs.writeFile(this.cartFilePath, JSON.stringify(carts, null, 2));
        } catch (error) {
            throw new Error('Error al guardar los carritos');
        }
    }

    async getNextCartId() {
        try {
            const carts = await this.readCarts();
            const maxId = carts.reduce((max, cart) => Math.max(max, cart.id), 0);
            return maxId + 1;
        } catch (error) {
            console.error('Error al obtener el próximo ID de carrito:', error);
            throw error;
        }
    }

    async createCart() {
        try {
            const newCartId = await this.getNextCartId(); // Obtenemos el próximo ID de carrito
            const newCart = {
                id: newCartId, // Asignamos el nuevo ID al carrito
                products: []
            };
    
            const carts = await this.readCarts();
            carts.push(newCart);
            await this.saveCarts(carts);
    
            return newCart;
        } catch (error) {
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const carts = await this.readCarts();
            const cart = carts.find(cart => cart.id === cartId);

            if (cart) {
                return cart;
            } else {
                throw new Error('Carrito no encontrado');
            }
        } catch (error) {
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const carts = await this.readCarts();
            const cart = carts.find(cart => cart.id === cartId);

            if (cart) {
                cart.products.push({ id: productId, quantity });
                await this.saveCarts(carts);
                return cart;
            } else {
                throw new Error('Carrito no encontrado');
            }
        } catch (error) {
            throw error;
        }
    }

    // Método para obtener el router
    getRouter() {
        return this.router;
    }
}

module.exports = CartManager;