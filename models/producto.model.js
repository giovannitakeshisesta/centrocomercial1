const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productoSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Enter at least 3 characters ']
  },
  description: {
    type: String,
    minlength: [10, 'Enter at least 10 characters ']
  },
  precio: {
    type: Number,
    required: true
  },
  image1: {
    type: String,
    default: 'https://www.clinicafeito.com/wp-content/uploads/2020/12/tshirt-2.jpg'
  },
  image2: {
    type: String,
    default: 'https://www.clinicafeito.com/wp-content/uploads/2020/12/tshirt-2.jpg'
  },
  tienda: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tienda',
    //required: true,
  }
  
}, { timestamps: true })


const Producto = mongoose.model('Producto', productoSchema)
module.exports = Producto

























