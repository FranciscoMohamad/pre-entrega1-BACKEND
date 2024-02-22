const fs = require('fs')

class ProductManager {
    #ultimoId = 1
    #products
    #path

    constructor() {
        this.#path = "products.json"
        if (fs.existsSync(this.#path)) {
            this.#products = this.#cargarProductosDesdeArchivo()

            if (this.#products.length > 0) {
                this.#ultimoId = this.#products[this.#products.length - 1].id + 1
            }
        } else {
            this.#products = []
        }
    }

    #cargarProductosDesdeArchivo() {
        try {
            const data = fs.readFileSync(this.#path, 'utf8')
            return JSON.parse(data) || []
        } catch (err) {
            console.error('Error al cargar productos desde el archivo:', err)
            return []
        }
    }

    getProducts() {
        return this.#products
    }

    #getNuevoId() {
        const id = this.#ultimoId
        this.#ultimoId += 1
        return id
    }

    //La funcion addProducts primero valida y luego hace un push de los productos.

    addProducts(title, description, price, thumbnail, code, stock) {

        //verificacion del campo code.

        const ProductCode = this.#products.some(prod => prod.code === code)

        if (ProductCode) {
            console.error(`el producto ${code} ya existe`)
            return
        }

        //verificacion de las propiedades del producto.

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            return console.log("Faltan propiedades del producto")
        }

        const products = {
            id: this.#getNuevoId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        this.#products.push(products)

        this.#guardarProductosEnArchivo()

    }

    //Metodo para guardar los productos en el JSON.
    #guardarProductosEnArchivo() {
        fs.writeFile(this.#path, JSON.stringify(this.#products, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar productos:', err)
            } else {
                console.log('Productos guardados en el archivo products.json')
            }
        })
    }

    getProductsById(id) {
        const product = this.#products.find(prod => prod.id === id)

        if (product) {
            return product
        } else {
            console.error("Product not found")
        }
    }


    //Estemetodo toma el id, campo y valor para actualizarlos. Busca elk indice del producto con  su id, actualiza y lo guarda en json.
    updateProduct(id, field, value) {
        const productIndex = this.#products.findIndex(prod => prod.id === id)

        if (productIndex !== -1) {
            this.#products[productIndex][field] = value
            this.#guardarProductosEnArchivo()
            console.log(`Producto con ID ${id} actualizado`)
        } else {
            console.error("Producto no encontrado")
        }
    }

    deleteProduct(id) {
        const productIndex = this.#products.findIndex(prod => prod.id === id)

        console.log("ID del producto a eliminar:", id)
        console.log("Índice del producto en el arreglo:", productIndex)
        console.log("Productos antes de la eliminación:", this.#products)

        if (productIndex !== -1) {
            this.#products.splice(productIndex, 1)
            this.#guardarProductosEnArchivo()
            console.log(`Producto con ID ${id} eliminado`)
        } else {
            console.error("Producto no encontrado")
        }

        console.log("Productos después de la eliminación:", this.#products)
    }


}

const productManager = new ProductManager()

productManager.addProducts("soy un titulo", "soy una descripcion", 20, "dasdasasddas", "sdasd1651", 4) // producto #1
productManager.addProducts("soy un titulo", "soy una descripcion", 20, "dasdasasddas", "sdasd1551", 4) // producto #1
productManager.addProducts("soy un titulo", "soy una descripcion", 20, "dasdasasddas", "sdasd481", 4) // producto #1


console.log(productManager.getProducts())
console.log(productManager.getProductsById(8))
productManager.updateProduct(2, "price", 25)
productManager.deleteProduct(2)

