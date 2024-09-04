import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  
  email: {
    type: String,
    //required: function() { return this.role !== 'user'; }, // Required for admin and sub-admin
    unique: true
  },
  password: {
    type: String,
    //required: function() { return this.role !== 'user'; }
  },
  role: {
    type: String,
    enum: ['admin', 'sub-admin', 'user'],
    required: true
  }
  // phoneNumber: {
  //   type: String,
  //   required: function() { return this.role === 'user'; },
  //   unique: true
  // },
  // otp: {
  //   type: String
  // },
  // otpExpiry: {
  //   type: Date
  // }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
