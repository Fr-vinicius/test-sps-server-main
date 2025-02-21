import keys from "../constants/keys.js";
import jwt from "jsonwebtoken";

export function authentication(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(403).json({ message: "Token not provided." });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return response.status(403).json({ message: "Invalid token format." });
  }

  const Token = parts[1];

  try {
    const decoded = jwt.verify(Token, keys.Jwt_Key);
    request.user = decoded;
    next();
  } catch (error) {
    return response.status(403).json({ message: "Invalid token." });
  }
}
