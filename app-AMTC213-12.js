const express = require('express')
const app = express()
const port = 3000

// directing express to static assets
app.use(express.static('public'))

//body parser middleware
app.use(express.urlencoded({extended: true}));

// --- set ejs to generate dynamic html pages--
app.set('view engine', 'ejs');
app.set('views', [__dirname + "/views",__dirname + "/views/users"]);

/* routes relating to http://localhost:3000/users/ have been stored seperately
for separation of concerns */
require('./routes/userroutes')(app);

// --- use GET method to render home page
app.get("/", (req,res) => {
    res.render("index");
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})