module.exports = function (req, res, next) {
    if(req.session.username == undefined){
        return res.redirect('/');
    }
    else
        return next();
};