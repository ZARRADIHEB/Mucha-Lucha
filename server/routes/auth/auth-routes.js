import express from "express";
import {
  authMiddleware,
  getAllUsers,
  login,
  logout,
  register,
} from "../../controllers/auth/auth-controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    message: "Authenticated user!",
    success: true,
    user,
  });
});

router.get("/allUsers", getAllUsers);

export default router;
