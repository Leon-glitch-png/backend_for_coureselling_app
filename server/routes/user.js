const express = require("express");
const { Admin, User, Course } = require("../db/index");
const { verification, secretUser } = require("../middleware/auth");

const router = express.Router();
router.post('/signup', async (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  let user = await User.findOne({ username });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }
  const newUser = new User({ username, password });
  const token = jwt.sign(username, secretUser);
  await newUser.save();
  res.status(200).json({ message: 'User created successfully', Authorization: token });


});


router.post('/login', async (req, res) => {
  // logic to log in user
  const username = req.headers.username;
  const password = req.headers.password;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign(username, secretUser);
    res.status(200).json({ message: 'Logged in successfully', Authorization: token });

  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

router.get('/users/courses', verification, async (req, res) => {
  // logic to list all courses
  const courses = await Course.find({ publish: true });
  res.status(200).json(courses);
});

router.post('/courses/:courseId', verification, async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  console.log(course);
  if (course) {
    const user = await User.findOne({ username: req.username });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});


router.get('/users/purchasedCourses', verification, async (req, res) => {
  const user = await User.findOne({ username: req.username }).populate('purchasedCourses');
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: 'User not found' });
  }
});


module.exports = router;