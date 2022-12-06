exports.getErrorPage = (req, res, next) => {
    res.render('error', {
        title: "Error",
        path : "/akdjf",
        isAuthenticated: req.session.isAuthenticated,
        username: req.session.user
    });
};