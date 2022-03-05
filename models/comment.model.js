const mongoose = require('mongoose');
const Schema = mongoose.Schema

const commentSchema = new Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number
  }

}, { timestamps: true })

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment

