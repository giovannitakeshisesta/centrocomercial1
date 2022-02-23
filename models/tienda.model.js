const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tiendaSchema = new Schema({
  ownerId: {
    type: String
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Enter at least 10 characters ']
  },
  description: {
    type: String,
    //minlength: [10, 'Enter at least 10 characters '],
    default : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. '
  },
  categories: {
    type: [String],
    default: ['sport','yeah'],
  },
  officialWeb: {
    type: String,
    required: [true, 'Official Web Site is required'],
    default: 'https://www.youtube.com/'
  },
  logo: {
    type: String,
    required: [true, 'A logo is required'],
    default: 'https://res.cloudinary.com/dly7e46yt/image/upload/v1645129550/ironhack/multer-example/icon-round-logo.png'
  },
  image1: {
    type: String,
    default: 'https://res.cloudinary.com/dly7e46yt/image/upload/v1645380028/ironhack/multer-example/images_zalqux.jpg'
  },
  image2: {
    type: String,
    default: 'https://res.cloudinary.com/dly7e46yt/image/upload/v1645380207/ironhack/multer-example/image2_xjz29k.jpg'
  },
  image: {
    type : String,
    default : 'https://res.cloudinary.com/dly7e46yt/image/upload/v1644841363/ironhack/multer-example/avatar_i8pt1k.png'
  }
}, { timestamps: true })


const Tienda = mongoose.model('Tienda', tiendaSchema)
module.exports = Tienda

























