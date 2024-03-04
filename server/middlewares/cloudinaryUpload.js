const cloudinary = require('cloudinary').v2
const multer = require('mutler')
const fs = require('fs')


if(!fs.existsSync('./uploads')){
    fs.mkdirSync('./uploads')
}

