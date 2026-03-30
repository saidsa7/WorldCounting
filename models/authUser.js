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
      type: Schema.Types.ObjectId,
      ref: "Text",
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

const AuthUser = mongoose.model("User", authUserSchema);
module.exports = AuthUser;

// ss
// im now in the refactor-model (branch)
