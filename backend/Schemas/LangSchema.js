const {Schema} = require("mongoose")

const LangSchema = new Schema({
      lang : String,
})

module.exports = {LangSchema};