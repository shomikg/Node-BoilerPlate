var jwt = require('jsonwebtoken');
var jwt_decode = require('jwt-decode');
const secretStu = "heystudent"
const secretTea = "heyteacher"

const Student = require('../models/student.model.js');
const Teacher = require('../models/teacher.model.js');

var checkToken = (req, res, next) => {
  var token = req.headers['x-access-token'] || req.headers['authorization'] || "";

  Student.findOne({ tok: token }, (err, updatedDoc) => {

    if (updatedDoc === null) {
      Teacher.findOne({ tok: token }, (err, updatedDoc) => {
        if (updatedDoc !== null) {
          jwt.verify(token, secretTea, (err, decoded) => {
            next();
          })
        }
        else {
          return res.json({
            success: false,
            message: 'No User Logged In'
          });
        }
      })
        .catch((err) => {
          return res.send("No User to Log Out");
        }
        )

    }

    else {
      if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
      }

      if (token) {
        jwt.verify(token, secretStu, (err, decoded) => {
          if (req.url.includes("Student") && (req.url.includes("delete") !== true))
            next();
          else
            res.send("You are not Authorized to do that.");
        });
      }
    }
  })
    .catch((err) => {

    })

}

var signout = (req, res) => {
  var token = req.headers['x-access-token'] || req.headers['authorization'];
  Student.findOneAndUpdate({ tok: token }, { $set: { tok: 'No Token' } }, { new: true }, (err, updatedDoc) => {
    if (updatedDoc === null) {
      Teacher.findOneAndUpdate({ tok: token }, { $set: { tok: 'No Token' } }, { new: true }, (err, updatedDoc2) => {
        return res.send("Signed Out User");
      })
    }
    else
      return res.send("Signed Out User");
  })
}


module.exports = {
  checkToken,
  signout
}