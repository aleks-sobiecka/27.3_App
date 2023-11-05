const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const multer  = require('multer');

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads')
    },
    filename: (req,file, cb) => {
      cb(null, file.originalname)
    },
  });
  const upload = multer({storage: storage})

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//app.engine('hbs', hbs());  --> Domyślnie Handlebars będzie szukać go w katalogu views\layouts\ pod nazwą main.handlebars
app.engine('hbs', hbs({ extname: 'hbs', layoutsDir: './views/layouts', defaultLayout: 'main' }));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, '/public')));
  
app.get('/', (req, res) => {
    //res.show('index.html');
    res.render('index')
});
  
app.get('/about', (req, res) => {
    res.render('about', { layout: 'dark' })
});
  
app.get('/contact', (req, res) => {
    res.render('contact')
});
  
app.get('/info', (req, res) => {
    res.render('info')
});
  
app.get('/history', (req, res) => {
    res.render('history')
});

/* app.get('/hello/:name', (req, res) => {
    res.send(`Hello ${req.params.name}`);
}); */

app.get('/hello/:name', (req, res) => {
    res.render('hello', { name: req.params.name });
});

/* app.post('/contact/send-message', (req, res) => {
    res.json(req.body);
}); */

app.post('/contact/send-message', upload.single('image'), (req, res) => {

    const { author, sender, title, message } = req.body;
  
    if(author && sender && title && req.file && message) {
        res.render('contact', { isSent: true, fileName: req.file.originalname });
    }
    else {
        res.render('contact', { isError: true });
    }
});

app.use((req, res) => {
    res.status(404).send('404 not found...');
})

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});