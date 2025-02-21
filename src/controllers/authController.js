import jwt from "jsonwebtoken";
import users from "../database/users.js";
import keys from "../constants/keys.js";

export function login(request, response) {
  const { email, password } = request.body;

  if (!email || !password) {
    return response
      .status(401)
      .json({ message: "Email and Password required!" });
  }

  const authUser = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!authUser) {
    return response.status(401).json({ message: "Invalid email or password" });
  }
  const Token = jwt.sign(
    { email: authUser.email, type: authUser.type, id: authUser.id },
    keys.Jwt_Key,
    { expiresIn: "1h", algorithm: "HS256" }
  );

  response.json({ Token, type: authUser.type, id: authUser.id });
}
