const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const Sequelize = require("sequelize");
const flash = require('connect-flash');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');
const sequelize = require('./utils/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const PORT = 3000;
const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({extended: true}));
// expose static content for request
app.use(express.static(path.join(__dirname, 'public')));

// Session database connection middleware
let SequelizeStore = require("connect-session-sequelize")(session.Store);

let sessionStore = new SequelizeStore({
    db: sequelize,
  }); 

app.use(
  session({
    secret: "mysecret",
    store: sessionStore,
    resave: false,
    proxy: true, 
  })
);
sessionStore.sync();

// User session identifier middleware
app.use('/', (req, res, next) => {
    if (!req.session.user) {
        next();
    } else {
        User.findByPk(req.session.user.id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });
    }
});

app.use(flash());

// Template engine configuration
app.set("view engine", "ejs");
app.set("views", "views");

app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/', shopRoutes);

// Error route
app.use('/', errorController.getErrorPage);

app.use((error, req, res, next) => {
    console.log("HIHHIHIHIHIHIHIHIHIHIHIHIHIHI and error's type is: ", error.message);
})

// Database's table association
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
    .sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`server is running in http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.log(err);
    });