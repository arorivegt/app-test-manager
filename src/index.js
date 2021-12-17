/* express es un framwork para trabajar con NodeJS */
const express = require('express');
//este modulo es para el motor de vistas
const engine = require('ejs-mate');
/*con este modulo puedo obetner la direccion de algun archivo para no teclear
manualmente la direccion, pues esta puede cambiar de sistema operativo y podria
dar problemas al cambiar de ambiente.*/
const path = require('path');
/*este modulo es un moddleware que es un intermediario que nos dice que peticion
son lanzaran desde el cliente al servidor y podemos ver como si realizo
GET / POST / DELETE ..etc y ademas el tiempo de respuesta Ejemplo: GET / 304 6.239 ms - -
 */
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

//Initializations
const app = express();
require('./databases');
require('./passport/local-auth');

// settings
/*  path.join(__dirname) me dueelve la direccion donde se ejecuta el archivo, 
    y asi le indico que en la carpeta views estaran mis vistas para el motor
    ejs.
*/
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
/*con la variable process.env.PORT puedo obtener el puerto del sistema operativo 
o que me proveen en caso contrario proveeo el puerto 3000*/
app.set('port', process.env.PORT || 3000);

/*Middlewares
son funciones que se ejecutan antes de entrar en la rutas
*/
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'myllavedesesion',
    resave: false,
    saveUninitialized: false
}))
/*flash debe ir despues de sesiones y antes de passport porque hace uso de las sessiones y luego viene passport para la validacion de la contrase;a*/
app.use(flash()); 
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.signupMessage = req.flash('signupMessage');
    app.locals.signinMessage = req.flash('signinMessage');
    app.locals.user = req.user;
    next();
});

/*Router 
app.use le indica a express que use esta ruta cuando ingrese el usuario  */
app.use('/' , require('./routes/index'));

//starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port ', app.get('port'));
});