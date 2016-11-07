var User = require('../user/user');

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.send('Hello demo!');
    });

    app.post('/user/signup',User.signup);

    app.post('/user/signin',User.signin);

    app.put('/user/resetpwd',User.resetpwd);

    app.delete('/user/deleteuser',User.deleteuser)
}