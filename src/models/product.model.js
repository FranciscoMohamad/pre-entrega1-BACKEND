const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')


const schema = new mongoose.Schema({

    // indicamos a mongoose que nuestros documentos 'products' tendrán un campo firstName del tipo string
    id: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    thumbnail: {type: String},
    code: {type: String, required: true},
    stock: {type: Number, required: true}
    // indicamos a mongoose que no permita crear 2 usuarios con el mismo email
    // email: {
    //     type: String,
    //     // unique: true
    // }
})

schema.plugin(mongoosePaginate)

module.exports = mongoose.model('Product', schema, 'products')