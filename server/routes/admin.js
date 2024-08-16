const mongoose = require("mongoose");
const express = require("express");
const { Admin, User, Course } = require("../db/index");
const { secret, authorization } = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const router = express.Router();


// const app = express();

router.get("/me", authorization, async (req, res) => {
  let admin = await Admin.findOne({ username: req.username });
  if (admin) {
    res.json({ username: admin.username })

  } else {
    res.json({ message: "Admin doesn't exist!" });
  }
})

router.post('/signup', async (req, res) => {

  // logic to sign up admin

  const { username, password } = req.body;

  let admin = await Admin.findOne({ username });

  console.log(admin);

  if (admin) {
    return res.status(400).json({ message: "Admin already exists" });
  } else {
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();
    token = jwt.sign(username, secret);
    return res.status(200).json({ message: "Admin created successfully", Authorization: token });
  }
});

router.post('/login', async (req, res) => {
  // logic to log in admin
  const username = req.headers.username;
  const password = req.headers.password;

  const admin = await Admin.findOne({ username, password });
  if (admin) {
    token = jwt.sign(username, secret);
    res.status(200).json({ message: 'Logged in successfully', Authorization: token });

  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }




});



router.post('/courses', authorization, async (req, res) => {
  // logic to create a course
  const { title, description, price, imageLink } = req.body;
  const newCourse = new Course({ title, description, price, imageLink });
  const id = newCourse["_id"];

  await newCourse.save();
  res.status(200).json({ message: 'Course created successfully', id: id });


});

router.put('/courses/:courseId', authorization, async (req, res) => {
  // logic to edit a course
  const courseId = req.params.courseId;
  const updatedCourse = req.body;
  try {
    const updated = await Course.findByIdAndUpdate(courseId, updatedCourse, { new: true });
    res.status(200).json({ message: 'Course updated successfully', updatedCourse: updated });
  } catch (err) {
    res.status(400).json({ message: 'Error updating course', error: err.message });
  }


});

router.get('/courses', authorization, async (req, res) => {
  // logic to get all courses
  const courses = await Course.find();
  res.status(200).json(courses);
});

router.get("/courses/:courseId", authorization, async (req, res) => {
  // logic to get a course by id
  const courseId = req.params.courseId;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Error getting course', error: err.message });
  }
})


router.delete(`/courses/delete/:courseId`, authorization, async (req, res) => {
  const courseId = req.params.courseId;
  const deleteCourse = await Course.findByIdAndDelete(courseId);
  if (deleteCourse) {

    res.json({ message: 'Course deleted successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});
module.exports = router;