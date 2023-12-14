const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// UPDATE
router.put("/:id", async (req, res) => {
  console.log("BODY: ", req.body, " PARAMS: ", req.params);
  if (req.body.userID === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      // hash plain text password
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (e) {
        return res.status(500).json(e);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        /* this is another way to write user.set(req.body) */
        $set: req.body,
      });
      res.status(200).json(`Account updated: ${user}`);
    } catch (e) {
      return res.status(500).json(e);
    }
  } else {
    return res.status(403).json("You can only update your account.");
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  if (req.body.userID === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account deleted.");
    } catch (e) {
      return res.status(500).json(e);
    }
  } else {
    return res.status(403).json("You can only delete your account.");
  }
});

// GET USER
router.get("/", async (req, res) => {
  // query is localhost:5000/users?username=test&userID=asasdasd
  const userID = req.query.userID;
  const username = req.query.username;
  try {
    const user = userID
      ? await User.findById(userID)
      : await User.findOne({ username: username });
    // _doc carries the whole object
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (e) {
    res.status(500).json(e);
  }
});

// GET USER FRIENDS
router.get("/friends/:userID", async (req, res) => {
  try {
    const user = await User.findById(req.params.userID);
    // promise since we have multiple fetches
    const friends = await Promise.all(
      user.following.map((friendID) => User.findById(friendID))
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (e) {}
});

// FOLLOW USER
router.put("/:id/follow", async (req, res) => {
  if (req.body.userID !== req.params.id) {
    try {
      const userToFollow = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userID);
      if (!userToFollow.followers.includes(req.body.userID)) {
        await userToFollow.updateOne({ $push: { followers: req.body.userID } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("User has been followed");
      } else {
        res.status(401).json("Already following the user.");
      }
    } catch (e) {
      res.status(500).json(e);
    }
  } else {
    res.status(403).json("You can't follow yourself.");
  }
});

// UNFOLLOW USER
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userID !== req.params.id) {
    try {
      const userToUnfollow = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userID);
      if (userToUnfollow.followers.includes(req.body.userID)) {
        await userToUnfollow.updateOne({
          $pull: { followers: req.body.userID },
        });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(401).json("Not following the user.");
      }
    } catch (e) {
      res.status(500).json(e);
    }
  } else {
    res.status(403).json("You can't unfollow yourself.");
  }
});

module.exports = router;
