const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productoSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  // ,
  // description: {
  //   type: String,
  //   minlength: [10, 'Enter at least 10 characters ']
  // },
  // precio: {
  //   type: Number,
  //   required: true
  // }
  // image1: {
  //   type: String,
  //   default: 'https://res.cloudinary.com/dly7e46yt/image/upload/v1644856628/ironhack/multer-example/q4a4ney5aqmwuziylmdh.png',
  // },
  // image2: {
  //   type: String,
  //   default: 'https://res.cloudinary.com/dly7e46yt/image/upload/v1644856628/ironhack/multer-example/q4a4ney5aqmwuziylmdh.png',
  // },
  // image3: {
  //   type: String,
  //   default: 'https://res.cloudinary.com/dly7e46yt/image/upload/v1644856628/ironhack/multer-example/q4a4ney5aqmwuziylmdh.png',
  // },
  tienda: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tienda',
    //required: true,
  }
  
}, { timestamps: true })


const Producto = mongoose.model('Producto', productoSchema)
module.exports = Producto

























