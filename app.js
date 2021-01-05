const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const setFileSize = 999999;
//Storage
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() +
            path.extname(file.originalname)); //Få rätt fil prefix
    }

});

//init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: setFileSize },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('upload'); //Kan sättas så man kan ladda upp fler filer, ex ett array.


//Check Func
function checkFileType(file, cb) {
    //Tillåtna prefix
    const filetypes = /jpeg|jpg|png|gif/;
    //Check prefix
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    //Check mime:A MIME type is a label used to identify a type of data. 
    //It is used so software can know how to handle the data.
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only..the 90s kids broke the internett!');
    }

}

const app = express();

const port = 3006;

//EJS presentation
app.set('view engine', 'ejs');

//Public Folder där vi skall spara bilder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });

        } else {
            if (req.file == undefined) {
                res.render('index', {
                    msg: 'Error: No File Selected!'
                });
            } else {
                res.render('index', {
                    msg: 'File Uploaded!',
                    file: `uploads/${req.file.filename}`
                });
            }
        }
    });


});


app.listen(port, () => console.log(`Server started on port ${port}`));