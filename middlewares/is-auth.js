const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        const err = new Error('Not Authorization!');
        err.statusCode = 401;
        throw err;
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, 'thisislongstringfortoken', (err, result) => {
        if(err){
            err.statusCode = 500;
            throw err;
        }
        if(!result){
            const err = new Error('Not Authorization!');
            err.statusCode = 401;
            throw err;
        }
        req.userId = result.userId;
        next();
    });

}