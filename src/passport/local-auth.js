const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});


passport.use('local-signup', new LocalStrategy({
    usernameField: 'email', //aqui le indicamos como se llama el campo que voy a recibir como usuario
    passwordField: 'password',//aqui le indicamos como se llama el campo que voy a recibir como contrase;a
    passReqToCallback: true //true para usar la funcion u procesar los datos.
} , async (req, email, password, done) => { //le agregamos async para agregar el metodo como asincrono
    
    const user = await User.findOne({'email': email});
    console.log(user);
    
    if(user){
        return done(null, false, req.flash('signupMessage' , 'El email ya existe'));
    }

    //se crea el usuario con el modelo de mongo
    const newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encrypPassword(password);
    await newUser.save(); //el await dice que termine de guardarlo continua con la siguiente linea.
    done(null, newUser); // esto me devuelve null para el error o el usuario si fue exitoso.

}));


passport.use('local-signin', new LocalStrategy({
    usernameField: 'email', //aqui le indicamos como se llama el campo que voy a recibir como usuario
    passwordField: 'password',//aqui le indicamos como se llama el campo que voy a recibir como contrase;a
    passReqToCallback: true //true para usar la funcion u procesar los datos.
}, async (req, email, password, done) =>{

    console.log(email);
    console.log(password);

    const user = await User.findOne({'email': email});
    console.log(user);
    
    if(!user){
        return done(null, false, req.flash('signinMessage' , 'El usuario no existe'));
    }

    if(!user.comparePassword(password)){
        return done(null, false, req.flash('signinMessage' , 'Password Incorrecto'));
    }

    done(null,user);
}));