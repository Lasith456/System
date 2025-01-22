import express from "express";
import { predictPriority,getUserTickets,getAllTickets,deleteTicket} from "../controllers/ticket.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import authorizeRole from "../middleware/authorizeRole.js";

const router=express.Router();

router.post("/predict",predictPriority);
router.get("/get",getUserTickets);
router.get('/allTicket',verifyToken,authorizeRole("admin"),getAllTickets)
router.delete('/:id',verifyToken,
authorizeRole("admin"), deleteTicket)

export default router;