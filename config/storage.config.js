const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const CloudinaryStorage = require('multer-storage-cloudinary').CloudinaryStorage;


// Configurar cloudinary donde tiene que apuntar para que nos autentique 
// crea una instancia de configuracion de cloudinary
// 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

// creo una instancia de cloudinary storage para generar la configuracion de los settings de cloudinary , carpeta y formato file

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ironhack/centro-comercial',
    allowed_formats: ['jpg', 'png'],
  }
})

//const maxSize = 10 *  0.1048576
//module.exports = multer({ storage, limits:{fileSize:maxSize} })
// esportamos la configuracion del middleware storage
module.exports = multer({ storage})