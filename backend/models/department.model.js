import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Department = mongoose.model('Department', DepartmentSchema);

export default Department;
