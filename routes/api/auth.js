const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const bcrypt = require('bcryptjs');

const config = require('../../config/keys'); // get config file
const VerifyToken = require('../../auth/VerifyToken');
const User = require('../../models/UserModel');

router.post('/register', function(req, res) {
    const errors = {};
    User.findOne({email: req.body.email})
        .then(user =>{
            if(user) {
                errors.email = "Email already exists";
                res.status(400).json({errors})
            }else {
                const newUser = new User({
                    name: req.body.name,
                    password: req.body.password,
                    email: req.body.email
                })
                // Password hash. Use bcrypt
                bcrypt.genSalt(10, (err,salt) =>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    })
                })
            }
        }).catch(err => console.log(err));
});

router.post('/login', function(req, res){
    const email = req.body.email;
    const password = req.body.password;
    const errors = {};
    // Check user
    User.findOne({email})
        .then(user =>{
            
            errors.email = "User not found";
            if(!user){
                res.status(404).json(errors);
            }
            // Check password
            bcrypt.compare(password, user.password)
                .then(isMatch =>{
                    if(isMatch){
                        // User Matched
                        // Create JWT Payload
                        const payload = { id: user.id, name: user.name};
                        // Sign TOKEN
                        jwt.sign(
                            payload,
                            config.secretOrKey,
                            { expiresIn: 3600 },
                            (err, token) =>{
                                res.json({ succses: true, token: token })
                            });
                    }else{
                        // errors.password = "Password incorrect";
                        res.status(404).json({password: "Password incorrect"});
                    }
                }).catch(err => console.log(err));
        });
});

router.get('/cur',VerifyToken, function(req, res){
    User.findById(req.userId, { password: 0 },function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
      });
});

module.exports = router;