const userSchema = require('../models/users');
const mongoose = require('mongoose');
const devise = require('mongoose-devise');
const ObjectId = mongoose.Types.ObjectId;
const usersCollection = mongoose.model('user', userSchema, 'users');

// Create new user
exports.user_create = function (req, res) {
    usersCollection.aggregate([
        //query
    ])
    .exec((err, data) => {
        if (err) {
            console.log(err);
            res.status(404).send({error:'Could not create new user'});
        }
        res.send(data);
    });
};

// Delete user
exports.user_delete = function (req, res) {
    usersCollection.aggregate([
        //query
    ])
    .exec((err, data) => {
        if (err) {
            console.log(err);
            res.status(404).send({error:'Could not delete user'});
        }
        res.send(data);
    });
};

// Update user
exports.user_update = function (req, res) {
    usersCollection.aggregate([
        //query
    ])
    .exec((err, data) => {
        if (err) {
            console.log(err);
            res.status(404).send({error:'Could not update user'});
        }
        res.send(data);
    });
};

// user details
exports.user_detail = function (req, res) {
    usersCollection.aggregate([
        //query
    ])
    .exec((err, data) => {
        if (err) {
            console.log(err);
            res.status(404).send({error:'Could not display user.'});
        }
        res.send(data);
    });
};

// user list
exports.user_list = function (req, res) {
    usersCollection.aggregate([
        //query
    ])
    .exec((err, data) => {
        if (err) {
            console.log(err);
            res.status(404).send({error:'Could not display users.'});
        }
        res.send(data);
    });
};

// user list
exports.user_search = function (req, res) {
    usersCollection.aggregate([
        //query
    ])
    .exec((err, data) => {
        if (err) {
            console.log(err);
            res.status(404).send({error:'Could not display users.'});
        }
        res.send(data);
    });
};

// user list
exports.user_total = function (req, res) {
    usersCollection.aggregate([
        //query
    ])
    .exec((err, data) => {
        if (err) {
            console.log(err);
            res.status(404).send({error:'Could not display users.'});
        }
        res.send(data);
    });
};




