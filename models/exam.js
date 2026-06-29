const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
    questionText: {
        type: String,
        required: true
    },
    options: [
        {
            type: String,
            required: true
        }
    ],
    correctAnswer: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 1
    }
}, { _id: false });

const examSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    stage: {
        type: Number,
        required: true
    },
    questions: [questionSchema]
},
    { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
