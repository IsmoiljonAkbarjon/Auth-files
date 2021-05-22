const router = require('express').Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const Upload = require('../models/upload')
const https = require('http');


//Render EJS

router.get('/getupload', (req, res) => {
    res.render('index')
})

// Multiple file Upload
var storage = multer.diskStorage({

    destination: function (req, file, callback) {
        var dir = "./uploads"
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
        callback(null, dir)
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
})
var upload = multer({ storage }).array('files', 12)
var upload1 = multer()

// uploadFile  POST request

router.post('/upload', upload, (req, res, next) => {

    const files = req.files
    if (!files) {
        const error = new Error("Please upload a file")
        error.httpStatusCode = 400
        next(error)
    }
    req.files.map(file => {
        (new Upload({
            name: file.originalname,
            razmer: file.size,
            MimeType: file.mimetype
        })).save();
    }
    )
    res.send(files)
})

router.put('/file/update/:id', upload1.single("file"),async (req, res, next) => {
    console.log(req.params.id)
    console.log(req)
    const updateFile = Upload.updateOne(
        { "_id": req.params.id }, // Filter
        {
            name: req.file.originalname,
            razmer: req.file.size,
            MimeType: req.file.mimetype
        }
    ).then(files => {
        res.json(updateFile)
    })
        .catch(err => res.status(500).json({ message: "Something went wrong" }));
})

// AllUploadFile  GET request

router.get("/getAll", async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10; // Make sure to parse the limit to number
        const skip = req.query.skip ? parseInt(req.query.skip) : 0;// Make sure to parse the skip to number
        const files = await Upload.find().skip(skip).limit(limit)
            .then(files => {
                res.json(files)
            })
            .catch(err => res.status(500).json({ message: "Something went wrong" }));

    } catch (err) {
        return res.status(500).json(err)
    }
})

// UploadFile  GET By Id request

router.get("/get/:id", async (req, res) => {
    // console.log(req)
    try {
        const file = await Upload.findById(req.params.id)
        console.log(file)
        const { name, updatedAt, ...other } = file._doc
        res.status(200).json(other)
    } catch (err) {
        return res.status(500).json(err)
    }
})

// Delete Upload File by Id

router.delete("/:id", async (req, res) => {
    try {
        const file = await Upload.findById(req.params.id)

        await Upload.findByIdAndDelete(req.params.id,);
        // delete a file
    fs.unlink('./uploads/' + file.name, (err) => {
        if (err) {
            throw err;
        }

        console.log("File is deleted.");
    });
        res.status(200).json("file has been deleted")
    } catch (err) {
        return res.status(500).json(err)
    }
})

router.get('/download/:id', async (req,res)=>{
  
// URL of the image
const file = await Upload.findById(req.params.id)
console.log(__dirname)
    res.download('./uploads/' + file.name, __dirname +'/upload_folder/'+file.name);

})




module.exports = router