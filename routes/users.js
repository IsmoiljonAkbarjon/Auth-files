const User = require('../models/user')
const router = require('express').Router()
const bcrypt = require('bcrypt')

//get user
router.get("/info", async (req, res) => {
    try {
         const users = await User.find()
         res.json(users)            
    } catch (err) {
        return res.status(500).json(err)
    }
})



module.exports = router