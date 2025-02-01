import express from "express";
import { getUsers,deleteUser,editUsers} from "../controllers/users.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import authorizeRole from "../middleware/authorizeRole.js";

const router=express.Router();

// Only allows users with the "admin" role and Departments Handling
router.get('/users',verifyToken,
authorizeRole("admin"), getUsers)

router.put('/users/:id',verifyToken,
authorizeRole("admin"), editUsers)


router.delete('/users/:id',verifyToken,
authorizeRole("admin"), deleteUser)

export default router;