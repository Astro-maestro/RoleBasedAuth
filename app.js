const express = require('express');
const dot_env = require('dotenv');
const connectDb = require('./app/config/db');
const productRouter = require('./router/product.router');
const bodyParser = require('body-parser');
const cors = require('cors');  
const authRouter = require('./router/auth.router') ;
const categoryRouter = require('./router/category.router') ;

const app = express();
dot_env.config();
connectDb();
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(express.static('uploads'));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.get('/', (req, res) => {
    res.send('This is a practice code for CRUD operation in MongoDB.')
})

app.use('/api', productRouter);
app.use('/api/auth', authRouter);
app.use('/api', categoryRouter);

const PORT = process.env.PORT || 5200;

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    
})