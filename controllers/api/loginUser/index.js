'use strict';
var jwtGenerator = require('../../../lib/jwt-generator');
var UserModel = require('../../../models/user');

module.exports = function (router) {

    router.post('/', function (req, res) {

        var data = req.body;
        var username = data.username;
        var password = data.password;

        //Validate mandatory data
        if (!username || !password) {
            return res.status(400).end();
        }

        UserModel.findOne({
            username: username,
            password: password
        }).exec(function (err, user) {
            if (err) {
                return res.status(500).json({err: err.message}).end();
            }

            if (!user) {
                return res.status(401).end();
            }

            var dataForPayload = {
                username: username,
                nombre: user.nombre,
                apellido: user.apellido
            };
            
            var nombre = user.nombre;

            var token = jwtGenerator.generateToken(dataForPayload);
            
            return res.status(201).json({token: token, nombre: nombre}).end();

        });

    });
};
