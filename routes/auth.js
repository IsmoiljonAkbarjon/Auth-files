const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt')
let refreshTokens = []

//Register

router.post("/signup", async (req,res)=>{
   try{
       //generate hash pass
       const salt = await bcrypt.genSalt(10)
       const hashedPassword = await bcrypt.hash(req.body.password, salt)
       
       //create new user
       const newUser = await new User({
        //    username: req.body.username,
           email: req.body.email,
           password: hashedPassword
        })
        //save user
        const user = await newUser.save();
        res.status(200).json({message:"Success"})
   }
   catch(err){
    res.status(500).json(err)
   }
})

//Login
router.post('/signin', async (req, res)=>{
    try{
            const user = await User.findOne({email: req.body.email})
            !user && res.status(404).send("user not found")

            const validPassword = await bcrypt.compare(req.body.password, user.password)
            !validPassword && res.status(400).json("wrong password")

            let accessToken = jwt.sign({user}, 'access', {expiresIn: '70s'})
            let refreshToken =   jwt.sign({user}, 'refresh', {expiresIn: '10m'})
            refreshTokens.push(refreshToken)

            return res.status(201).json({
                accessToken,
                refreshToken
            })

        } catch(err){
        res.status(500).json(err)
    }
})

 router.get('/logout', (req, res) => {
    
    const refreshtoken = req.headers.authorization

    if(refreshtoken in refreshTokens)
        delete refreshTokens[refreshtoken];
   
    
    res.send("Logout successful");

    

}); 


router.post('/post', verifyToken, (req, res)=>{

    jwt.verify(req.token, 'access', (err, data)=>{
        if(err){
            res.sendStatus(403)
        }else{

            res.status(200).send("ishladi")
        }
    })

})

router.post('/refreshAccess', (req,res)=>{
    const refreshtoken = req.body.token
    if(!refreshtoken || !refreshTokens.includes(refreshtoken)){
        return res.status(403).json({message: "User not authenticated"})
    }
    jwt.verify(refreshtoken, 'refresh', (err, user)=>{
        if(!err){
            console.log(user.name)
            const accessToken = jwt.sign({username: user.name}, 'access', {expiresIn: "70s"})
            return res.status(201).json({accessToken})
        }else{
          return res.status(403).json({message: "User not authenticated"})
        }
    })
})

function verifyToken(req, res, next){
    //get auth header value
    const bearerHeader = req.headers['authorization']
    //check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        // split as a spase
        const bearer = bearerHeader.split(' ')
        //get token from array
        const bearerToken = bearer[1]
        //set the token
        req.token = bearerToken
         //next middleware 
         next()
    }else{
        //Forbidden
        res.sendStatus(403)
    }
   
}

module.exports = router