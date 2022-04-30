var express = require("express");
var router = express.Router();
const { hashing, role, hashcompare } = require("../library/auth");
const { dbUrl, mongodb, MongoClient } = require("../dbConfig");

/* GET users listing. */
router.get("/", function (req, res) {
  res.send("respond with a resource");
});

router.post("/register", role, async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("UserData");
    let user = await db.collection("auth").findOne({ email: req.body.email });
    if (user) {
      res.send("User is alredy exist");
    } else {
      const hash = await hashing(req.body.password);
      req.body.password = hash;
      let document = await db.collection("auth").insertOne(req.body);
      res.json({
        message: "Account Created",
      });
    }
  } catch (error) {
    res.send(error);
  } finally {
    client.close();
  }
});

router.post("/login", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("UserData");
    let user = await db.collection("auth").findOne({ email: req.body.email });
    if (user) {
      const compare = await hashcompare(req.body.password, user.password);
      if (compare === true) {
        res.json({
          message: "Login Successful",
        });
      } else {
        res.json({
          message: "Wrong password",
        });
      }
    } else {
      res.json({
        message: "user does not exist",
      });
    }
  } catch (error) {
    res.send(error);
  } finally {
    client.close();
  }
});

router.post("/forgot-password", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("UserData");
    let user = await db.collection("auth").findOne({ email: req.body.email });
    if (user) {
      const hash = await hashing(req.body.password);
      let document = await db
        .collection("auth")
        .updateOne({ email: req.body.email }, { $set: { password: hash } });
      res.json({
        message: "Password changed successfully",
      });
    } else {
      res.json({
        message: "user does not exist",
      });
    }
  } catch (error) {
    res.send(error);
  } finally {
    client.close();
  }
});

router.post("/reset-password", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("UserData");
    let user = await db.collection("auth").findOne({ email: req.body.email });
    if (user) {
      const compare = await hashcompare(req.body.oldPassword, user.password);
      if (compare) {
        const hash = await hashing(req.body.newPassword);
        let document = await db
          .collection("auth")
          .updateOne({ email: req.body.email }, { $set: { password: hash } });
        res.json({
          message: "Password changed successfully",
        });
      }
    } else {
      res.json({
        message: "user does not exist",
      });
    }
  } catch (error) {
    res.send(error);
  } finally {
    client.close();
  }
});

module.exports = router;
