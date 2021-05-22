const mongoose = require('mongoose')

const UploadSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        max: 50,
    },
    razmer: {
        type:String,
        required: true,
    },
    MimeType: {
        type:String,
        required: true,
    },
},
{timestamps: true}
)

module.exports = mongoose.model("Upload", UploadSchema)