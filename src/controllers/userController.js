import users from "../database/users.js";
import crypto from "crypto";

export function createUser(request, response) {
  const idUsuario = request.user.id;
  const currentUser = users.find((u) => u.id === idUsuario);

  const isAdmin = currentUser.type === "admin";

  if (!isAdmin) {
    return response.status(403).json({ message: "User unauthorized." });
  }

  try {
    const { name, email, type, password } = request.body;

    if (!name || !email || !type || !password) {
      return response.status(400).json({ message: "Missing required fields" });
    }

    const invalidEmail = users.some((u) => u.email === email);

    if (invalidEmail) {
      return response
        .status(400)
        .json({ message: "Email already registered!" });
    }

    const id = crypto.randomUUID();

    users.push({ id, name, email, type, password });
    response.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    return response.status(400).json({ message: "Unable to register." });
  }
}

export function getUser(request, response) {
  const idUsuario = request.user.id;
  const currentUser = users.find((u) => u.id === idUsuario);

  const isAdmin = currentUser.type === "admin";
  try {
    if (isAdmin) {
      const userId = request.query.id || request.params.id;

      if (!userId) {
        return response.status(400).json({ message: "User ID is required." });
      }

      const requestedUser = users.find((u) => u.id === userId);

      if (!requestedUser) {
        return response.status(404).json({ message: "User not found." });
      }
      return response.json(requestedUser);
    } else {
      const requestedRegularUser = users.find((u) => u.id === idUsuario);
      return response.json(requestedRegularUser);
    }
  } catch (error) {
    return response.status(500).json({ message: "Unable to get user info." });
  }
}

export function getUsers(request, response) {
  const idUsuario = request.user.id;
  const currentUser = users.find((u) => u.id === idUsuario);

  const isAdmin = currentUser.type === "admin";

  if (!isAdmin) {
    return response.status(403).json({ message: "User unauthorized." });
  }

  try {
    if (users.length > 0) {
      return response.json(users);
    } else {
      return response.status(404).json({ message: "No users found." });
    }
  } catch (error) {
    return response.status(500).json({ message: "Unable to get user info." });
  }
}

export function updateUser(request, response) {
  try {
    if (!request.user || !request.user.id) {
      return response
        .status(401)
        .json({ message: "Unauthorized: Token is invalid or missing." });
    }

    const idUsuario = request.user.id;
    const currentUser = users.find((u) => u.id === idUsuario);

    if (!currentUser) {
      return response.status(404).json({ message: "Current user not found." });
    }

    const isAdmin = currentUser.type === "admin";
    const { id, name, email, type, password } = request.body;

    const toBeUpdated = isAdmin
      ? users.find((u) => u.id === id)
      : users.find((u) => u.id === idUsuario);

    if (!toBeUpdated) {
      return response.status(404).json({ message: "User not found." });
    }

    if (!name && !email && !type && !password) {
      return response
        .status(400)
        .json({ message: "No fields provided for update." });
    }

    if (email && email !== toBeUpdated.email) {
      const emailExists = users.some(
        (u) => u.email === email && u.id !== toBeUpdated.id
      );

      if (emailExists) {
        return response
          .status(400)
          .json({ message: "Email already registered!" });
      }

      toBeUpdated.email = email;
    }

    if (name) toBeUpdated.name = name;
    if (email) toBeUpdated.email = email;
    if (type && isAdmin) toBeUpdated.type = type;
    if (password) toBeUpdated.password = password;

    return response
      .status(200)
      .json({ message: "User updated successfully!", user: toBeUpdated });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return response.status(500).json({ message: "Unable to update user." });
  }
}

export function deleteUser(request, response) {
  if (!request.user || !request.user.id) {
    return response.status(401).json({ message: "Token is invalid " });
  }
  const idUsuario = request.user.id;

  const currentUser = users.find((u) => u.id == idUsuario);

  const isAdmin = currentUser.type === "admin";

  const { id } = request.body;

  try {
    if (isAdmin && id === idUsuario) {
      return response
        .status(404)
        .json({ message: "User cannot delete himself." });
    }

    const toBeDeleted = isAdmin
      ? users.findIndex((u) => u.id === id)
      : users.findIndex((u) => u.id === idUsuario);

    if (toBeDeleted === -1) {
      return response.status(404).json({ message: "User not found" });
    }

    users.splice(toBeDeleted, 1);
    response.json({ message: "User deleted successfully." });
  } catch {
    return response.status(400).json({ message: "Unable to delete user." });
  }
}
