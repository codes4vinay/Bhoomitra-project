const {Schema} = require("mongoose")

const UserSchema = new Schema({
      name: String,
      contact: Number,
      location: String,
})

module.exports = {UserSchema};