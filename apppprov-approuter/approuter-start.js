const approuter = require('@sap/approuter');

var ar = approuter();
ar.beforeRequestHandler.use('/logoutJL', function (req, res, next) {     
    if (!req.user) {
        res.statusCode = 403;
        res.end(`Missing JWT Token`);
    } else {
        var oAuthorization = JSON.parse(req._passport.session.user);
        req.logout();
        req.session.destroy();
        //res.statusCode = 200;
        //res.end(`My session is logoff JL 1`);
        req._passport.destroy();
        next();
    } 
});
ar.start();