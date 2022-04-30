const bcrypt = require("bcryptjs");
const hashing = async (value) => {
  try {
    const salt = await bcrypt.genSalt(10);
    console.log("salt ", salt);
    const hash = await bcrypt.hash(value, salt);
    return hash;
  } catch (error) {
    return error;
  }
};

const hashcompare = async (password, hashvalue) => {
  try {
    return await bcrypt.compare(password, hashvalue);
  } catch (error) {
    return error;
  }
};

const role = async (req, res, next) => {
  switch (req.body.role) {
    case 1:
      console.log("Admin");
      next()
      break;
    case 2:
      console.log("Student");
      next()
      break;
    default:
      res.send({message:"Default case"});
      break;
  }
};

module.exports = { hashing, hashcompare, role };
