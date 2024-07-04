const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const uri = "mongodb+srv://tanejakunal533:Kunaldiv%4029@cluster0.pe9gyng.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const URI = process.env.DATABASE


const UserModel = require('./db/User');

const Jwt = require('jsonwebtoken');
const jwtKey = 'SHOPPER';

const app = express();

app.use(cors());
app.use(express.json());

// mongoose.connect("mongodb://127.0.0.1:27017/shopper");
mongoose.connect(uri, {
    useNewUrlParser:true,
    useUnifiedTopology:true,

}).then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log("ERReR: ", err);
})

// mongoose.connect(uri).then(()=>{
//     console.log("connection successful");
// }).catch((err)=>{
//     console.log("ERReR: ", err);
// })


// mongodb://localhost:27017
app.post('/signup', async (req,res)=>{
    if(req.body.password && req.body.email && req.body.name){ 
          let user = new UserModel(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    Jwt.sign({result}, jwtKey, {expiresIn: "2h"}, (err, token)=>{
        if(err){
            res.send({result: 'Some Error Occurs'})
        } 
        res.send({result, auth: token});
    })  
    }
    else  {
        res.send({ result: "No User Created" });
      }

});

app.post('/login', async (req,res)=>{
    console.log(req.body);
    if(req.body.password && req.body.email){
        let user = await UserModel.findOne(req.body).select("-password");
        if(user){
            Jwt.sign({user}, jwtKey, {expiresIn: "2h"}, (err, token)=>{
                if(err){
                    res.send({ result: "Some Error Occurs" })
                }
                console.log('USER:',user)
                res.send({user, auth: token});
            })
        } else {
            res.send({ result: "No User Found1" });
          }
        }    else {
          res.send({ result: "No User Found2" });
        }
      });

    app.post('/addToCartArray', async(req,res)=>{
    // console.log('bodY',req.body);
    try {
        const { userId, productIds } = req.body;
        // console.log('id',userId);

        // Find the user by userId
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the cart array with productIds
        user.cart = productIds;

        // Save the updated user object
        await user.save();
        console.log('user',user);
        return res.status(200).json({ message: 'Product IDs added to the cart successfully' });
    } catch (error) {
        console.error('Error adding product IDs to cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    })

    app.get('/getOrderedArray', async(req,res)=>{
        try{
            // const { userId } = req.body;
            const userId = req.query.userId;
        console.log('id',userId);

        // Find the user by userId
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the cart array with productIds
        // console.log('cart123:',user)
        let users = JSON.stringify(user.cart)
        res.send(users);
        } catch (error) {
            console.error('Error adding product IDs to cart:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    })

    // app.put('/cartEmpty', async(req,res)=>{
    //     let result = await UserModel.updateOne(
    //         {_id: req.params.id},
    //         {
    //             $set: req.body
    //         },
    //     )
    //     res.send(result)
    // })

    app.post('/cart', async(req,res)=>{
        // console.log('bodY',req.body);
        try {
            const { userId, Cart } = req.body;
            console.log('id111',Cart);
    
            // Find the user by userId
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Update the cart array with productIds
            user.cart = Cart;
    
            // Save the updated user object
            await user.save();
            console.log('user1',user);
            return res.status(200).json({ message: 'Cart empty successfully' });
        } catch (error) {
            console.error('Error cart is not empty:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        })

app.listen(5000, ()=>{
    console.log('Server is running....');
})