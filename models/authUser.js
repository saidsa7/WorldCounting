const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const authUserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  profileImage: String,

  texts: [
    {
      title: { type: String, trim: true },
      text: { type: String, trim: true },
      wordsTotal: { type: String, trim: true },
      withoutRepetition: { type: String, trim: true },
      //   createdAt: Date,
      //   updatedAt: Date,
      // updatedAt: { type: Date, default: Date.now},
    },
  ],
});

// ====== IMPORTANT: use normal function NOT arrow function
authUserSchema.pre("save", async function () {
  // إذا لم يتغير الباسورد فلا تعمل شيئًا
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

const AuthUserText = mongoose.model("UserText", authUserSchema);
module.exports = AuthUserText;
