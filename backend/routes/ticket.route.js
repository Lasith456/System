import express from "express";
import { predictPriority,getUserTickets} from "../controllers/ticket.controller.js";

const router=express.Router();

router.post("/predict",predictPriority);
router.get("/get",getUserTickets);
export default router;