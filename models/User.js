const mongoose = require("mongoose");
const {isEmail} = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: "string",
    required: [true, "please enter an email"],
    unique: true,
    lowercase: true,
    validate : [isEmail,'please enter a valid email']
  },
  password: {
    type: "string",
    required: [true, "please enter an password"],
    minlength: [6, "Minimum password lenght is 6 characters"],
    maxlength: [20, "Maximum password length is 20 characters"],
  },
});



//fire a function after a value is saved to the db
userSchema.post('save',function(doc,next){
    console.log('new user was created and saved in the db',doc);
    next();
});

//fire a function before a data is saved to db
userSchema.pre('save',async function(next){
    // console.log("new user is about to be saved to the db",this);
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

//static method to login user
userSchema.statics.login = async(email,password)=>{
  const user = await userModel.findOne({email});
  if(user){
    const auth = await bcrypt.compare(password,user.password);
    if(auth){
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
}

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
