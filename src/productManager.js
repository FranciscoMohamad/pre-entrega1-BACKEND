const fs = require('fs')
const express = require('express')
const router = express.Router()



class ProductManager {
  #ultimoId = 1

  constructor(path) {
      this.path = path

  }

  async cargarProductosDesdeArchivo() {
      try {
          //!agregue el guion en utf8
          const data = await fs.promises.readFile(this.path, 'utf-8')
          return JSON.parse(data)
      } catch (err) {
          console.error('Error al cargar productos desde el archivo:', err)
          return []
      }
  }
   // Método para obtener todos los productos con get para la ruta /api/products.
   async getAllProducts(req, res) {
    try {
        const limit = parseInt(req.query.limit)
        const products = await this.cargarProductosDesdeArchivo()

        if (limit) {
            const prods = products.slice(0, limit)
            return res.json(prods)
        }

        return res.json(products)
    } catch (error) {
        console.error('Error al obtener todos los productos:', error)
        res.status(500).send('Error al obtener todos los productos')
    }
}

  async getProducts() {
      const products = await this.cargarProductosDesdeArchivo()
      return products
  }


  //La funcion addProducts primero valida y luego hace un push de los productos.

  async addProducts({ title, description, price, thumbnail, code, stock }) {
    try {
        // Leer productos actuales del archivo
        const products = await this.cargarProductosDesdeArchivo()

        // Obtener el ID más alto actualmente en uso
        const highestId = Math.max(...products.map(prod => prod.id))

        // Crear el nuevo producto con un ID único y uno mayor que el ID más alto actualmente en uso
        const newProduct = {
            id: highestId + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        products.push(newProduct)

        await this.guardarProductosEnArchivo(products)

        console.log('Producto agregado correctamente.')
    } catch (error) {
        console.error('Error al agregar el producto:', error)
        throw error
    }
}

 async guardarProductosEnArchivo(products) {
    try {
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
        console.log('Productos guardados en el archivo products.json')
    } catch (err) {
        console.error('Error al guardar productos:', err)
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

  router() {
    router.get('/products', this.getAllProducts.bind(this))
    return router
}


}

module.exports = ProductManager

//? ----------------- Test --------------------

const main = async () => {
    
  const productManager = new ProductManager("products.json")
  console.log(await productManager.getProducts())

  console.log(await productManager.getProducts())
  console.log(await productManager.getProductsById(1))
  await productManager.updateProduct(2, { title: "updated product" })
  await productManager.deleteProduct(2)
}
main()