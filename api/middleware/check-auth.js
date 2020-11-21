const jwt = require("jsonwebtoken");

module.exports = (req, res, next)=> {
    const token = req.headers.authorization.split(" ")[1];
    if(!token) return res.status(404).send("access denied");

    // verify the token
    try{
        const verified = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = verified;
        next();
    }catch(err){
        res.status(400).send("invalidtoken");
    }
};