const fs = require('fs')

//!Cmabios generales: reemplace funciones sync por fs.promises. y la funcion que corresponda.

class ProductManager {
  #ultimoId = 1

  constructor(path) {
      //!El path por parametros y se inicializa dentro del constructor
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

  async getProducts() {
      const products = await this.cargarProductosDesdeArchivo()
      return products
  }

  #getNuevoId() {
      const id = this.#ultimoId
      this.#ultimoId += 1
      return id
  }

  //La funcion addProducts primero valida y luego hace un push de los productos.

  async addProducts({ title, description, price, thumbnail, code, stock }) {
      const products = await this.getProducts()
      console.log("prods------------------\n", products)
      //verificacion del campo code.

      const ProductCode = products.some(prod => prod.code === code)

      if (ProductCode) {
          return console.error(`el producto ${code} ya existe`)
      }

      //verificacion de las propiedades del producto.

      if (!title || !description || !price || !thumbnail || !code || !stock) {
          return console.log("Faltan propiedades del producto")
      }

      const product = {
          id: this.#getNuevoId(),
          title,
          description,
          price,
          thumbnail,
          code,
          stock
      }

      products.push(product)

      await this.guardarProductosEnArchivo(products)

  }

 //!Modificacion de la funcion para que reciba los productos por parametros y reescriba el archivo con los nuevos datos
  async guardarProductosEnArchivo(products) {
      //! cambie el 2 por \t

      await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'), (err) => {
          if (err) {
              console.error('Error al guardar productos:', err)
          } else {
              console.log('Productos guardados en el archivo products.json')
          }
      })
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
          //! Uso el spread operator para asignarle a un objeto ya existente nuevas propiedades
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


}

module.exports = ProductManager

//? ----------------- Test --------------------

const main = async () => {
  const productManager = new ProductManager("products.json")
  console.log(await productManager.getProducts())

  await productManager.addProducts({ title: "soy un titulo 1", description: "soy una descripcion", price: 20, thumbnail: "no image", code: "sdasd1651", stock: 4 }) // producto #1
  await productManager.addProducts({ title: "soy un titulo 2", description: "soy una descripcion", price: 20, thumbnail: "no image", code: "sdasd16512", stock: 4 }) // producto #1
  await productManager.addProducts({ title: "soy un titulo 3", description: "soy una descripcion", price: 20, thumbnail: "no image", code: "sdasd16513", stock: 4 }) // producto #1


  console.log(await productManager.getProducts())
  console.log(await productManager.getProductsById(1))
  await productManager.updateProduct(2, { title: "updated product" })
  await productManager.deleteProduct(2)
}
main()