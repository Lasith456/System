import express from "express";
import { predictPriority,getUserTickets} from "../controllers/ticket.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import authorizeRole from "../middleware/authorizeRole.js";

const router=express.Router();

router.post("/predict",predictPriority);
router.get("/get",getUserTickets);
router.get('/testing',verifyToken,
authorizeRole("admin"), // Only allows users with the "admin" role
(req, res) => {
  res.json({ success: true, message: "Welcome Admin!", user: req.user });
})
export default router;