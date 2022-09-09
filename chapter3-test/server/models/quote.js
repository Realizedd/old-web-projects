// require mongoose
var mongoose = require('mongoose');
// create the schema
var QuoteSchema = new mongoose.Schema({
  name: { type: String, required: true},
  quote: { type: String, required: true}
}, {timestamps: true})
// register the schema as a model
var Quote = mongoose.model('Quote', QuoteSchema);