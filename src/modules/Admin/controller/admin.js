import { create, findOne } from "../../../../DB/DBMethod.js";
import resultModel from "../../../../DB/model/result.model.js";
import studentAddModel from "../../../../DB/model/StudentAdd.model.js";
import userModel from "../../../../DB/model/user.model.js";
import { asyncHandler } from "../../../services/errorHandling.js";



export const addStudentNationalID= asyncHandler(
    async(req,res,next)=>{
        const {NationalID}= req.body
        const student= await findOne({
            model:studentAddModel,
            filter:{NationalID:NationalID}
        })
        if (student) {
            next(new Error('u can not Add this student because he is Already Add ',{cause:409}))
        } else {
            const newStu= await create({
                model:studentAddModel,
                data:{NationalID}
            })
            newStu ? res.status(201).json({message:"done",newStu}) : next(new Error('fail to add new student ',{cause:400}))
        }
    }
)


export const addResult= asyncHandler(
    async(req,res,next)=>{
        const {NationalID,Degree,userName,subjectName}= req.body
        const student= await findOne({model:userModel,
            filter:{NationalID:NationalID},
            select:'userName'
        })
        if (!student) {
            next(new Error('he is not student in faculty or he is not register in site',{cause:400}))
        } else {
            if (student.userName === userName) {
                const addRes= await create({model:resultModel,
                data:{NationalID,Degree,userName,subjectName,studentId:student._id}})
                addRes ? res.status(201).json({message:"done", addRes}) :  next(new Error(`fail to add result to ${student.userName}`,{cause:400}))
            } else {
                next(new Error('plz Enter userName or NationalID true',{cause:400}))
            }
        }
    }
)