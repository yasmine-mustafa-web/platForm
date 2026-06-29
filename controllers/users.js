const User = require('../models/user');
const passport = require('passport');

module.exports.renderRegisterForm = (req,res) =>{
    res.render('users/register')
}

module.exports.createRegister= async(req,res) =>{
    try{
        const {firstname , lastname , parentphoneNumber , username, stage , password} = req.body;
        const user = new User({firstname , lastname , parentphoneNumber , username, stage});
        const registeredUser = await User.register(user , password);
        req.login(registeredUser, err => {
            if (err) return next(err); 
            
            req.flash('success', 'Welcome to the platform!');
            res.redirect('/'); 
        });
       
    }catch(e) {
        req.flash('error' , e.message);
        console.log(e)
        res.redirect('/register');
    }
}

module.exports.renderLoginForm = (req,res) =>{
    res.render('users/login')
}

module.exports.createLogin = async(req,res) =>{
    try{
        req.flash('success' , 'logged in successfully')
        res.redirect('/')
    }catch(e){
        req.flash('error' , e.message);
        res.redirect('/login');
    }
}