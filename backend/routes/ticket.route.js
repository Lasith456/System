import express from "express";
import { predictPriority} from "../controllers/ticket.controller.js";

const router=express.Router();

router.post("/predict",predictPriority);
export default router;