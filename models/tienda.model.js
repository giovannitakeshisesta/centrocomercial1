const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tiendaSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Enter at least 10 characters ']
  },
  image: {
    type: String,
    default: 'https://res.cloudinary.com/dly7e46yt/image/upload/v1645129550/ironhack/multer-example/icon-round-logo.png',
  },
  description: {
    type: String,
    minlength: [10, 'Enter at least 10 characters ']
  },
  categories: {
    type: [String],
    default: ['sport','yeah'],
  }
}, { timestamps: true })


const Tienda = mongoose.model('Tienda', tiendaSchema)
module.exports = Tienda

























