 
class LogInuser{

    async userLogIn(req, res){
        if(req.body.email === '')
            res.render('login/index',{email: req.body.email, password: req.body.password, error: true, errorMessage: 'Please Enter Email Id'});
        else if(req.body.password === '')
            res.render('login/index',{email: req.body.email, password: req.body.password, error: true, errorMessage: 'Please Enter Password'});
        else{
            if(req.body.email ==='admin@admin.com' && req.body.password === 'password'){
                req.session.username = 'admin';
                res.redirect('/manageContacts');
            }
            else
                res.render('login/index',{email: req.body.email, password: req.body.password, error: true, errorMessage: 'Invalid Credentials'});
        }
    }

}

module.exports = new LogInuser();