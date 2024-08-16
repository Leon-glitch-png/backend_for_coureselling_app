
const jwt = require("jsonwebtoken");

const secret = "KeY_SeCrEt";
const secretUser = "UsErKeYsEcRet";
function authorization(req, res, next) {


  const auth = req.headers.authorization;
  console.log(auth)
  const token = auth.split(' ')[1];


  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }



  jwt.verify(token, secret, (err, username) => {
    if (err) {
      return res.status(400).json({ message: 'Invalid token' });
    } else {
      req.username = username;
      next();
    }
  });



}


async function verification(req, res, next) {
  auth = req.headers.token;
  if (auth) {

    try {
      const exist = await jwt.verify(auth, secretUser);
      if (exist) {
        req.username = exist;
        next();
      }
    } catch (err) {
      return res.status(400).json({ message: 'Invalid token' });
    }
  }

}

module.exports = {
  authorization,
  verification,
  secret,
  secretUser


}