import jwt from "jsonwebtoken";


const userAuth = async (req, res, next) => {
    const {token} = req.cookies;
    if(!token){
        return res.json({success: false, message: "Please login to access this resource"});
    }

    try {
       const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

       if(tokenDecode.id){
        req.user = tokenDecode.id;
       } else {
        return res.json({success: false, message: "Please login Again"});
       }
       next();

    } catch (error) {
        res.json ({success: false, message: error.message});
    }
}

export default userAuth;