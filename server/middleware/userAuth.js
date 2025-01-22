import jwt from "jsonwebtoken";

//this middleware fucntion is executed when we hit the endpoint , it take token from the cookie

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;
    if(!token){
        return res.json({success: false, message: "Not Aythorize, Login Again"});
    }

    try {
        //the token will get and decode by jwt and find userid
       const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

       if(tokenDecode.id){
         req.body.userId = tokenDecode.id;
       } else {
        return res.json({success: false, message: "Not Aythorize,Please login Again"});
       }
       //after getting user id we can move to the next middleware, and execute the authcontroller function
       next();

    } catch (error) {
        res.json ({success: false, message: error.message});
    }
}

export default userAuth;