const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const collection = 'carts'

const schema = new mongoose.Schema({

    // indicamos a mongoose que nuestros documentos 'carts' tendrán un campo firstName del tipo string
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: String,
    stock: Number

    // // indicamos a mongoose que no permita crear 2 usuarios con el mismo email
    // email: {
    //     type: String,
    //     unique: true
    // }
})

schema.plugin(mongoosePaginate)

module.exports = mongoose.model(collection, schema)