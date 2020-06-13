const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    //multers disk storage settings
    destination: function (req, file, cb) {
        let destinationFolder = '../public/images';
        cb(null, path.join(__dirname, destinationFolder));
    },
    filename: function (req, file, cb) {
        console.log(file);
        const datetimestamp = Date.now();
        cb(null, 'file-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});

module.exports = multer({
//multer settings
    storage: storage
}).single ('file');