const express = require('express')
const router = express.Router()
const productsModel = require('../models/product.model')

// Ruta para obtener todos los productos con paginación y filtrado
router.get('/products', async (req, res) => {
    try {
        // Parámetros de consulta
        const { limit = 10, page = 1, sort, query } = req.query;

        // Convertir a números
        const limitNum = parseInt(limit);
        const pageNum = parseInt(page);

        // Calcular el índice de inicio y fin para la paginación
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = pageNum * limitNum;

        // Construir el objeto de consulta
        const queryObj = query ? { $text: { $search: query } } : {};

        // Ejecutar la consulta
        const products = await productsModel.find(queryObj) // Cambiado de 'product' a 'productsModel'
            .sort(sort)
            .limit(limitNum)
            .skip(startIndex);

        // Calcular la cantidad total de productos
        const totalProducts = await productsModel.countDocuments(queryObj); // Cambiado de 'product' a 'productsModel'

        // Calcular el total de páginas
        const totalPages = Math.ceil(totalProducts / limitNum);

        // Crear objeto de respuesta
        const result = {
            products,
            totalPages,
            currentPage: pageNum,
            totalProducts
        };

        // Enviar respuesta
        res.json(result);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

module.exports = router;