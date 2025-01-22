import Department from "../models/department.model.js";

export const getDepartment=async(req, res)=>{
    try {
        const departments = await Department.find();
        if(!departments){
            return res.status(400).json({success:false, message:"Department Not Found"});
        }
        res.status(200).json(departments)
    } catch (error) {
        res.status(400).json({message:error.message});
    }
}
export const addDepartment=async(req, res)=>{
    try {
        const department = new Department({ name: req.body.name });
        await department.save();
        return res.status(200).json(department);
    } catch (error) {
        res.status(400).json({message:error.message});
    }
}
export const editDepartment=async(req, res)=>{

    try {
        const department = await Department.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true }
          );
          return res.status(200).json(department);
    } catch (error) {
        res.status(400).json({message:error.message});
    }
}
export const deleteDepartment=async(req, res)=>{

    try {
        await Department.findByIdAndDelete(req.params.id);
        return  res.json({ message: "Department deleted" });
    } catch (error) {
        res.status(400).json({ message:error.message});
    }
}