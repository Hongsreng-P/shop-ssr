const User = require("../models/user");
const bcryptjs = require('bcryptjs');

exports.getLoginPage = (req, res, next) => {
    res.render('shop/login', {
        title : "Login",
        path : "/login",
        isAuthenticated : req.session.isAuthenticated,
        username: req.session.user,
        errorMessage: req.flash('error-login')
    });  
}

exports.postLogin = (req, res, next) => {
    const name = req.body.username;
    const password = req.body.password;

    if (name === '' || password === '') {
        return res.redirect('/auth/login');
    }

    User.findOne({
        where: {
            name: name
        }
    })
    .then(user => {
        if (user) {
            bcryptjs.compare(password, user.password)
            .then(doMatch => {
                if (doMatch) {
                    req.session.user = user;
                    req.session.isAuthenticated = true;
                    res.redirect('/');
                } else {
                    req.flash('error-login', 'Invalid username or password');
                    res.redirect('/auth/login');
                }
            })
            .catch(err => {
                console.log(err);
            })
        } else {
            req.flash('error-login', 'Invalid username or password');
            res.redirect('/auth/login');
        }
    })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
}

exports.getSignupPage = (req, res, next) => {
    res.render('shop/signup', {
        title : "Signup",
        path : "/signup",
        isAuthenticated : req.session.isAuthenticated,
        username: req.session.user,
        errorMessage: req.flash('error-signup')
    });  
}

exports.postSignup = (req, res, next) => {
    const name = req.body.username;
    const password = req.body.password;
    User.findOne({
        where : {name : name}
    })
        .then(user => {
            if (user) {
                req.flash('error-signup', 'Username is already exists');
                return res.redirect('/auth/signup');
            }
            bcryptjs.hash(password, 12)
            .then(hashedPassword => {
                User.create({
                    name : name,
                    password : hashedPassword,
                })
                    .then(user => {
                        user.createCart();
                        req.session.user = user;
                        req.session.isAuthenticated = true;
                        res.redirect('/');
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }) 
            .catch(err => {
                console.log(err);
            })
        })
        .catch(err => {
            console.log(err);
        })
}