const Teacher = require('../models/teacher.model.js');
const jwt = require('jsonwebtoken');
const secretKey = "heyteacher";

exports.login = (req,res,next) =>{
    Teacher.find()
    .then(tasks => {
        tasks.forEach((task)=>
    {
        if(req.body.user === task.user && req.body.pass === task.pass )
        {
            let token = jwt.sign({user: req.body.user, pass: req.body.pass, rl:"Teacher"},
            secretKey,
            { expiresIn: '24h'
            }
          );
          Teacher.findByIdAndUpdate(task._id.valueOf(), {
            firstName: task.firstName, 
            lastName: task.lastName,
            user : task.user,
            pass : task.pass,
            roll : task.roll,
            tok : token
        }).then((stu)=>{
            return res.json({
                success: true,
                message: 'Teacher Authentication successful!',
                token: token
              
          });
        }).catch((stu)=>{console.log("token not inserted");});
          
        }
    });
    next();
    }).catch(err => {
        return res.status(500).send({
            message: err.message || "Some error occurred while retrieving teacher Details."
        });
    });
}

exports.register = (req,res,next) =>{
    if(!(req.body.firstName || req.body.lastName || req.body.user || req.body.pass || req.body.role)) {
        return res.status(400).send({
            message: "Teachers details cannot be empty"
        });
    }
    const data = {
        firstName: req.body.firstName, 
        lastName: req.body.lastName,
        user : req.body.user,
        pass : req.body.pass,
        role: req.body.role
    }
    const tea = new Teacher(data);

    tea.save()
    .then(data2 => {
          res.json({
            success: true,
            message: 'Successfully Registered!'
          });
        
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating a teacher."
        });
    });
}

exports.findAll = (req, res) => {
    Teacher.find()
    .then(tasks => {
        res.send(tasks);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Teacher Details."
        });
    });
};

exports.findOne = (req, res) => {
    Teacher.findById(req.params.teaId)
    .then(task => {
        if(!task) {
            return res.status(404).send({
                message: "Teacher not found with id " + req.params.teaId
            });            
        }
        res.send(task);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Teacher not found with id " + req.params.teaId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving teacher with id " + req.params.teaId
        });
    });
};

exports.update = (req, res) => {
    if(!(req.body.firstName || req.body.lastName || req.body.user || req.body.pass || req.body.role)) {
        return res.status(400).send({
            message: "Teacher details cannot be empty"
        });
    }
    Teacher.findByIdAndUpdate(req.params.teaId, {
        firstName: req.body.firstName, 
        lastName: req.body.lastName,
        user : req.body.user,
        pass : req.body.pass,
        role: req.body.role
    }, {new: true})
    .then(tea => {
        if(!tea) {
            return res.status(404).send({
                message: "Teacher not found with id " + req.params.teaId
            });
        }
        return res.send({message: "Teacher updated"})
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Teacher not found with id " + req.params.teaId
            });                
        }
        return res.status(500).send({
            message: "Error updating Teacher details with id " + req.params.teaId
        });
    });
};

exports.delete = (req, res) => {
    Teacher.findByIdAndRemove(req.params.teaId)
    .then(tea => {
        if(!tea) {
            return res.status(404).send({
                message: "Teacher not found with id " + req.params.teaId
            });
        }
        res.send({message: "Teacher details deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Teacher not found with id " + req.params.teaId
            });                
        }
        return res.status(500).send({
            message: "Could not delete teacher details with id " + req.params.teaId
        });
    });
};