const Product = require("../models/product");
const User = require("../models/user");


exports.getAddProductPage = (req, res, next) => {

    res.render('admin/edit-product', {
        title: "Add-product",
        path : "/admin/add-product",
        editing: "false",
        isAuthenticated: req.session.isAuthenticated,
        username: req.session.user
    });
};

exports.postProduct = (req, res, next) => {
    // controller handle input from the client and update those input to the product model
    const inputTitle = req.body.title;
    const inputPrice = req.body.price;
    req.user.createProduct({
        title: inputTitle,
        price: inputPrice
    })
    .then(result => {
        res.redirect('/');
    })
    .catch(err => {
        console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
    Product.findByPk(req.body.productId)
        .then((product) => {
            product.title = req.body.title;
            product.price = req.body.price;
            product.save();
            res.redirect('/admin/products');
        })
}

exports.postDeleteProduct = (req, res, next) => {
    const targetId = req.params.productId; 
    Product.findByPk(targetId)
        .then(product => {
            product.destroy();
            res.json({
                message: "success"
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                message: "fail"
            });
        });
}

exports.getEditProductPage = (req, res, next) => {
    const editMode = req.query.edit;
    const editId = req.params.productId;
    Product.findByPk(editId).then(product => {
        if (!product) {
            res.redirect('/');
        }
        res.render('admin/edit-product', {
            title: "Edit-product",
            path : "/admin/edit-product",
            editing: editMode,
            product: product,
            isAuthenticated: req.session.isAuthenticated,
            username: req.session.user
        });
    })
};

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('admin/products', {
                title : "Admin Shop",
                prods : products,
                path : "/admin/products",
                isAuthenticated: req.session.isAuthenticated,
                username: req.session.user
            }); 
        })
};