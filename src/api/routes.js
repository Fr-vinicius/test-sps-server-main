import { Router } from "express";
import { authentication } from "../middlewares/authMiddleware.js";
import { login } from "../controllers/authController.js";
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const routes = Router();

routes.post("/login", login);
routes.post("/createUser", authentication, createUser);
routes.post("/updateUser", authentication, updateUser);
routes.post("/deleteUser", authentication, deleteUser);
routes.get("/getUsers", authentication, getUsers);
routes.get("/getUser", authentication, getUser);

export default routes;
