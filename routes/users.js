const router = require("express").Router();
const { User, validate } = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/sendEmail");
const { default: mongoose } = require("mongoose");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user = await new User({ ...req.body, password: hashPassword }).save();

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url = `${process.env.FRONT_END_URL}/users/${user.id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify Email", url);

    res
      .status(201)
      .send({ message: "An Email sent to your account please verify" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


router.get("/:id/verify/:token", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.id);

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(400).send({ message: "Invalid user" });
    }

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) {
      return res.status(400).send({ message: "Invalid token" });
    }

    user.verified = true;
    await user.save();
    setTimeout(async () => {
      await token.deleteOne();
      console.log("Token valid only for 5 seconds");
    }, 10000);

    res.status(200).send({ message: "Email verified successfully" });
    console.log("Email verified successfully");

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
