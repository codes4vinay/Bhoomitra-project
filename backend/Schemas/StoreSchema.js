const {Schema} = require("mongoose")

const StoreSchema = new Schema({
      product:String,
      price: Number,
      qty: Number,
})

module.exports = {StoreSchema};