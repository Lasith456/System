import {User} from "../models/user.model.js";

export const getUsers=async(req, res)=>{
    try {
        const users = await User.find();
        if(!users){
            return res.status(400).json({success:false, message:"Users Not Found"});
        }
        res.status(200).json(users)
    } catch (error) {
        res.status(400).json({message:error.message});
    }
}

export const editUsers=async(req, res)=>{
    const { department, role } = req.body;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { department, role },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user", error });
    }
}
export const deleteUser=async(req, res)=>{

    try {
        await User.findByIdAndDelete(req.params.id);
      
          res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({ message:error.message});
    }
}