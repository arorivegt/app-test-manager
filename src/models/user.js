const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const {Schema} = mongoose;

const userSchemma = new Schema({
    email: String,
    password: String
});

userSchemma.methods.encrypPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchemma.methods.comparePassword = function(password){
    console.log(this.password);
    console.log(password);
    return bcrypt.compareSync(password, this.password); //compara las contrase;as de la base de datos y lo enviado.
};

module.exports = mongoose.model('user', userSchemma);