const express = require('express');
const path = require('path');
const app = express();
const blog = require(path.join(__dirname, './routes/blog.js'));

const { engine } = require('express-handlebars')


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


app.use(express.static(path.join(__dirname, 'static')));
app.use('/', blog);


const port = 3000;
app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`);
});
