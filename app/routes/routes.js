const middleware = require("../controllers/middleware");
const students = require('../controllers/student.controller.js');
const teachers = require('../controllers/teacher.controller.js');

module.exports = (app) => {

    app.post('/login', teachers.login, students.login);

    app.post('/registerStudent', students.register);

    app.get('/getStudents', middleware.checkToken, students.findAll);

    app.get('/getStudentByID/:stuId', middleware.checkToken, students.findOne);

    app.post('/updateStudentbyID/:stuId', middleware.checkToken, students.update);

    app.delete('/deleteStudentByID/:stuId', middleware.checkToken, students.delete);

    app.post('/registerTeacher', teachers.register);

    app.get('/getTeachers', middleware.checkToken, teachers.findAll);

    app.get('/getTeacherByID/:teaId', middleware.checkToken, teachers.findOne);

    app.patch('/updateTeacherbyID/:teaId', middleware.checkToken, teachers.update);

    app.delete('/deleteTeacherByID/:teaId', middleware.checkToken, teachers.delete);

    app.get('/signout', middleware.signout);
}
