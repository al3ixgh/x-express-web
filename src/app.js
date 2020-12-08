const express = require('express')
const morgan=require('morgan')
const cors = require('cors')

require('../db/mongoose')
const postRouter = require('../routers/post')
const userRouter = require('../routers/user')
const testRouter = require('../routers/test')

const Test = require('../models/test')

const port = process.env.PORT

// express app
const app = express();

// listen for requests
app.listen(port, () => {
  console.log(`Server listening to port ${port}`)
});

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use((req, res, next) => {
  console.log('new request made:');
  console.log('host: ', req.hostname);
  console.log('path: ', req.path);
  console.log('method: ', req.method);
  next();
});

app.get('/', async (req, res) => {
  try {
    const posts = await Test.find({})
    res.render('posts', { title: 'List of posts', posts: posts });
  } catch (e) {
    res.render('posts', { title: 'List of posts', posts: [] });
}
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/posts/create', (req, res) => {
  res.render('post-create', { title: 'Create a new post' });
});

app.get('/tests', async (req, res) => {
    try {
        const tests = await Test.find({})
        res.render('tests', { title: 'List of tests', tests: tests });
      } catch (e) {
        res.render('tests', { title: 'List of tests', tests: [] });
    }
});

app.get('/test/create', (req, res) => {
  res.render('test-create', { title: 'Create a new test' });
});

app.get('/interfaz', (req, res) => {
  res.render('interfaz', { title: 'Interacción con el servidor' });
});


app.use(cors())
app.use(express.json())
app.use('/api', postRouter)
app.use('/api', userRouter)
app.use('/api', testRouter)

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});

