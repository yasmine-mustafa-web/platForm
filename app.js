const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localPassport = require('passport-local');
const { isLoggedIn } = require('./middleware');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

main().catch(err => {
    console.log(err);
    console.log('there is an errorr');
});
async function main() {
    await mongoose.connect('mongodb://yasminealyy:yasmina12@ac-slz8z22-shard-00-00.nuxgayy.mongodb.net:27017,ac-slz8z22-shard-00-01.nuxgayy.mongodb.net:27017,ac-slz8z22-shard-00-02.nuxgayy.mongodb.net:27017/platform?ssl=true&replicaSet=atlas-11c28c-shard-0&authSource=admin&appName=Cluster0');
    console.log('connected')
}

const Subscriber = require('./models/subscribe');
const Exam = require('./models/exam');
const Result = require('./models/result');
const User = require('./models/user');
const userRoutes = require('./routes/user');
const Contact = require('./models/contact');
const users = require('./controllers/users');


app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})




app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', userRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/contactForm', async (req, res) => {
    try {
        const newContact = new Contact({
            email: req.body.email,
            message: req.body.message
        });
        await newContact.save();
        req.flash('success', 'message sent!')
        res.redirect('/');
    } catch (e) {
        req.flash('error', 'failed')
        console.log(e);
    }


})

app.get('/examResults', isLoggedIn, async (req, res) => {
    try {
        const results = await Result.find({ student: req.user._id })
            .populate('exam')
            .populate('student');
        console.dir(results[results.length - 1].answers)
        res.render('courses/examResults', { results })
    } catch (e) {
        req.flash('error', "can't load results");
        res.redirect('/');
        console.log(e)
    }

})

app.get('/exams/:id', isLoggedIn, async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        console.log("SHOW EXAM ID:", exam._id);
        if (!exam) {
            req.flash('error', 'Exam not found');
            res.redirect('/');
        }
        res.render('exams/exam', { exam });
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
})


app.post('/exams/:id/submit', isLoggedIn, async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        const submittedAnswers = req.body.answers || {};

        let score = 0;
        let totalPointsAvailable = 0;
        const processedAnswers = [];
        exam.questions.forEach((question, index) => {
            totalPointsAvailable += question.points;
            const studentSelection = submittedAnswers[index] ? submittedAnswers[index].trim() : "No Answer Given";

            const isCorrect = studentSelection === question.correctAnswer;

            if (isCorrect) {
                score += question.points;
            }

            processedAnswers.push({
                questionText: question.questionText,
                submittedAnswer: studentSelection,
                isCorrect: isCorrect
            });
        });

        const result = new Result({
            student: req.user._id,
            exam: exam._id,
            answers: processedAnswers,
            score: score,
            totalPointsAvailable: totalPointsAvailable
        });

        await result.save();

        req.flash('success', 'Your answers are saved successfully');
        res.redirect('/');
    } catch (e) {
        console.error("Submission Error Details:", e);
        req.flash('error', 'Something went wrong while submitting.');
        res.redirect('/');
    }
});


app.get('/show', (req, res) => {
    res.render('courses/show');
})
app.get('/senior3', isLoggedIn, (req, res) => {
    res.render('sessions/senior3');
})
app.get('/subscribe', isLoggedIn, (req, res) => {
    res.render('sessions/subscribe');
})
app.post('/subscribe', async (req, res) => {
    const Subscriber = new Subscriber({ user: req.body.user, image: req.file.path })
    await Subscriber.save();
    res.redirect('courses/course<%=currentUser.stage%>');
})

app.get('/courses/22', isLoggedIn, async (req, res) => {
    try {
        const exam = await Exam.findOne({ title: "vectors Quiz" });


        const lessonExamId = exam ? exam._id : null;

        let hasCompletedExam = false;

        if (lessonExamId) {
            const examSubmission = await Result.findOne({
                student: req.user._id,
                exam: lessonExamId
            });
            hasCompletedExam = examSubmission !== null;
        } else {
            hasCompletedExam = true;
        }

        res.render('courses/course22', { exam, lessonExamId, hasCompletedExam });
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});
app.get('/courses/2', isLoggedIn, async (req, res) => {
    try {
        const exam = await Exam.findOne({ title: "vectors Quiz" });

        const lessonExamId = exam ? exam._id : null;

        let hasCompletedExam = false;

        if (lessonExamId) {
            const examSubmission = await Result.findOne({
                student: req.user._id,
                exam: lessonExamId
            });
            hasCompletedExam = examSubmission !== null;
        } else {
            hasCompletedExam = true;
        }

        res.render('courses/course2', { exam, lessonExamId, hasCompletedExam });
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

app.get('/courses/3', isLoggedIn, async (req, res) => {
    try {
        const exam = await Exam.findOne({ title: "vectors Quiz" });

        const lessonExamId = exam ? exam._id : null;

        let hasCompletedExam = false;

        if (lessonExamId) {
            const examSubmission = await Result.findOne({
                student: req.user._id,
                exam: lessonExamId
            });
            hasCompletedExam = examSubmission !== null;
        } else {
            hasCompletedExam = true;
        }

        res.render('courses/course3', { exam, lessonExamId, hasCompletedExam });
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

app.listen(PROCESS.ENV.port, () => {
    console.log('listen on port')
})