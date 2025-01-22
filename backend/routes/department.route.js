import express from "express";
import { getDepartment,addDepartment,editDepartment,deleteDepartment} from "../controllers/department.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import authorizeRole from "../middleware/authorizeRole.js";

const router=express.Router();

// Only allows users with the "admin" role and Departments Handling
router.get('/departments',verifyToken,
authorizeRole("admin"), getDepartment)

router.post('/departments',verifyToken,
authorizeRole("admin"), addDepartment)

router.put('/departments/:id',verifyToken,
authorizeRole("admin"), editDepartment)


router.delete('/departments/:id',verifyToken,
authorizeRole("admin"), deleteDepartment)

export default router;