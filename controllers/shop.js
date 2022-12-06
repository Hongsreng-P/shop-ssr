const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProductPage = (req, res, next) => {
    // the controller takes the result from the product model and display it to the user
    Product.findAll()
        .then((products) => {
            res.render('shop/product-list', {
                title : "Shop",
                prods : products,
                path : "/products",
                isAuthenticated: req.session.isAuthenticated,
                username: req.session.user
            }); 
    });
};

exports.getProductDetail = (req, res, next) => {
    Product.findAll({where : {id : req.params.productId}})
        .then((product) => {
            res.render('shop/product-detail', {
                title: product[0].title,
                prods: product[0],
                path: "/products",
                isAuthenticated: req.session.isAuthenticated,
                username: req.session.user
            });
    });
}

exports.getIndexPage = (req, res, next) => {
    res.render('shop/index', {
        title: "Shop",
        path : "/",
        isAuthenticated: req.session.isAuthenticated,
        username: req.session.user
    });
};

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            cart.getProducts()
                .then(products => { 
                    res.render('shop/cart', {
                        prods: products,
                        title: "Your Cart",
                        path : "/cart",
                        isAuthenticated: req.session.isAuthenticated,
                        username: req.session.user
                    })
                })
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    req.user.getCart()
        .then((cart) => {
            fetchedCart = cart;
            return cart.getProducts({ where : {
                id : prodId
            }});
        })
        .then(products => {
            let product; 
            if (products.length > 0) {
                product = products[0];
            }
            let newQuantity = 1;
            if (product) {
                const OldQuantity = product.cartItem.quantity;
                newQuantity += OldQuantity;
                product.cartItem.quantity = newQuantity;
                product.cartItem.save();
            } else {
                return Product.findByPk(prodId)
                .then(product => {
                    return fetchedCart.addProduct(product, {
                            through : {
                            quantity : newQuantity
                            }
                        })
                })
                .catch(err => {
                    console.log(err);
                })
            }
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        title: "Checkout",
        path : "/checkout",
        isAuthenticated: req.session.isAuthenticated,
        username: req.session.user
    });
};

exports.getOrder = (req, res, next) => {
    req.user
      .getOrders({include: ['products']})
      .then(orders => {
        res.render('shop/order', {
          path: '/orders',
          title: 'Your Orders',
          orders: orders,
          isAuthenticated: req.session.isAuthenticated,
          username: req.session.user
        });
      })
      .catch(err => console.log(err));
  };
  

exports.postDeleteCart = (req, res, next) => {
    const targetId = req.body.prodId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({where : {id : targetId}});
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postCreateOrder = (req, res, next) => {
    let fetchedCart;
    req.user
      .getCart()
      .then(cart => {
        fetchedCart = cart;
        return cart.getProducts();
      })
      .then(products => {
        return req.user
          .createOrder()
          .then(order => {
            return order.addProducts(
              products.map(product => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
              })
            );
          })
          .catch(err => console.log(err));
      })
      .then(result => {
        return fetchedCart.setProducts(null);
      })
      .then(result => {
        res.redirect('/order');
      })
      .catch(err => console.log(err));
  };