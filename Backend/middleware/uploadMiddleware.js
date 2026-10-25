const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist const uploadDir = "uploads";
const uploadDir = "upload";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

//check file type
function checkFileType(file, cb){
    console.log("file from postman", file);

    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    console.log("Is Extension Valid?", extname); 
    console.log("Is Mimetype Valid?", mimetype);

    if(extname && (mimetype && extname || file.mimetype === 'application/octet-stream')){
        return cb(null, true);
    }else{
        cb("Error: Images Only! Please check file format.");
    }
}

//Initalize uplaod
const upload = multer({
    storage: storage,
    limits: {fileSize: 2 * 1024 * 1024},  //2MB
    fileFilter: function (req, file, cb){
        checkFileType(file,cb);
    },
}); 

module.exports = upload;