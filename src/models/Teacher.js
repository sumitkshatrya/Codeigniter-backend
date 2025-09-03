import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        university_name: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true,
        },
        year_joined: { 
            type: Number, 
            required: true 
        },
        department: { 
            type: String, 
            required: true 
        },
    }, 
    { timestamps: true }
);

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;