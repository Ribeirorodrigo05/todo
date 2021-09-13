//dependecies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const handlebars = require('express-handlebars');
const moment = require('moment');
const path = require('path')

//modules required
require('dotenv').config()
const users = require('./src/routes/APIs/usersApi')
const task = require('./src/routes/APIs/taskApi')

//new instance express
const app = express();

//static files
app.use(express.static(path.join(__dirname , "./public")))

//template engine
app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    helpers:{
        formatDate:(date) =>{
            return moment(date).format('DD/MM/YYYY')
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}))
app.set('view engine','handlebars')

//instance of body-parser
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.json())

//connect of database
mongoose.connect(process.env.MONGODB_URL_LOCAL_KEY).then(()=> console.log('connected'))

//Routes and APIs 
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use('/', users);
app.use('/', task);




//instance PORT 
const PORT = 5000
app.listen(PORT, ()=>console.log('server is running: '+ PORT))
