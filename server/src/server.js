import express from 'express';
import configViewEngine from './config/viewEngine';
import initWebRoutes from './routes/web.r';
//import connection from './config/connectDB';

require('dotenv').config();
const PORT = process.env.PORT || 8080; //8080 by default

const app = express();

//middleware for crossing origin resource sharing (cors)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.REACT_URL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
})

//config express middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//config view engine
configViewEngine(app);

// //connect to DB
// connection();

//init view engine
initWebRoutes(app);


app.listen(PORT, () => {
    console.log("JWT Server is listening on port " + PORT + ", url: http://localhost:" + PORT);
})