import express from "express";
import { predictPriority,getUserTickets,getAssignTickets,getAllTickets,deleteTicket,updateTicket,getCounts,getDepartmentTickets,assignTicket} from "../controllers/ticket.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import authorizeRole from "../middleware/authorizeRole.js";

const router=express.Router();

router.post("/predict",predictPriority);
router.get("/get",getUserTickets);
router.get("/get_department_tickets",getDepartmentTickets);
router.get("/counts",getCounts);
router.get('/allTicket',verifyToken,authorizeRole("admin"),getAllTickets)
router.delete('/:id',verifyToken,
authorizeRole("admin"), deleteTicket)
router.post("/update_status",verifyToken,updateTicket)
router.post("/assign",verifyToken,assignTicket);
router.get("/assign",getAssignTickets);

export default router;