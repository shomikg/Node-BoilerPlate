const Student = require('../models/student.model.js');
const jwt = require('jsonwebtoken');
const secretKey = "heystudent"

exports.login = (req,res) =>{
    Student.find()
    .then(tasks => {
        tasks.forEach((task)=>
    {
        if(req.body.user === task.user && req.body.pass === task.pass)
        {
            let token = jwt.sign({user: req.body.user, pass: req.body.pass, rl:"Student"},
            secretKey,
            { expiresIn: '24h'
            }
          );
          Student.findByIdAndUpdate(task._id.valueOf(), {
            firstName: task.firstName, 
            lastName: task.lastName,
            user : task.user,
            pass : task.pass,
            roll : task.roll,
            tok : token
        }).then((stu)=>{
            return res.json({
            success: true,
            message: 'Student Authentication successful!',
            token: token
          });
        }).catch((stu)=>{console.log("token not inserted");});
          
        }
    });
    }).catch(err => {
        return res.status(500).send({
            message: err.message || "Some error occurred while retrieving student Details."
        });
    });
}

exports.register = (req,res,next) =>{
    if(!(req.body.firstName || req.body.lastName || req.body.user || req.body.pass)) {
        return res.status(400).send({
            message: "Student details cannot be empty"
        });
    }
    const data = {
        firstName: req.body.firstName, 
        lastName: req.body.lastName,
        user : req.body.user,
        pass : req.body.pass,
        roll : req.body.roll
    }
    const stu = new Student(data);

    stu.save()
    .then(data2 => {
          res.json({
            success: true,
            message: 'Successfully Registered!',
          });
        
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating a student."
        });
    });
}

exports.findAll = (req, res) => {
    Student.find()
    .then(tasks => {
        res.send(tasks);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving student Details."
        });
    });
};

exports.findOne = (req, res) => {
    Student.findById(req.params.stuId)
    .then(task => {
        if(!task) {
            return res.status(404).send({
                message: "Student not found with id " + req.params.stuId
            });            
        }
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Student not found with id " + req.params.stuId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving student with id " + req.params.stuId
        });
    });
};

exports.update = (req, res) => {
    if(!(req.body.firstName || req.body.lastName || req.body.user || req.body.pass)) {
        return res.status(400).send({
            message: "Student details cannot be empty"
        });
    }
    Student.findByIdAndUpdate(req.params.stuId, {
        firstName: req.body.firstName, 
        lastName: req.body.lastName,
        user : req.body.user,
        pass : req.body.pass,
        roll : req.body.roll
    })
    .then(stu => {
        if(!stu) {
            return res.status(404).send({
                message: "Student not found with id " + req.params.stuId
            });
        }
        return res.send({message: "Student updated"})
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Student not found with id " + req.params.stuId
            });                
        }
        return res.status(500).send({
            message: "Error updating student details with id " + req.params.stuId
        });
    });
};

exports.delete = (req, res) => {
    Student.findByIdAndRemove(req.params.stuId)
    .then(stu => {
        if(!stu) {
            return res.status(404).send({
                message: "Student not found with id " + req.params.stuId
            });
        }
        res.send({message: "Student details deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Student not found with id " + req.params.stuId
            });                
        }
        return res.status(500).send({
            message: "Could not delete student details with id " + req.params.stuId
        });
    });
};