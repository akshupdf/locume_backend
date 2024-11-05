import jwt from "jsonwebtoken";
import { CustomError } from "../error/customError.js";
import { asyncMiddleware } from "../error/catchAsynError.js";

const auth = asyncMiddleware(async (req, res, next) => {
    const checkToken = req.headers.authorization
    if (checkToken == undefined) {
        return next(new CustomError("No Token Found", 400))
    } else {
        let token = req.headers.authorization.split(' ')[1]

        const decode = jwt.verify(token, process.env.secretKey)
        if (decode.user_id) {
            req.userId = decode.user_id
            next()
        } else {
            return next(new CustomError("Unauthorized", 400))
        }
    }
})

export default auth