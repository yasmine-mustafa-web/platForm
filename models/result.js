const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = require('./user');

const studentAnswerSchema = new Schema({
    questionText: {
        type: String, 
        required: true
    },
    submittedAnswer: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    }
});

const resultSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exam: {
        type: Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    answers: [studentAnswerSchema], 
    score: {
        type: Number,
        required: true
    },
    totalPointsAvailable: {
        type: Number,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);