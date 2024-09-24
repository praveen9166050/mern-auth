import jwt from "jsonwebtoken";
import CustomError from "../utils/CustomError.js";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new CustomError(401, "Unauthorized");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new CustomError(401, "Unauthorized");
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(error);
  }
}

export default verifyToken;