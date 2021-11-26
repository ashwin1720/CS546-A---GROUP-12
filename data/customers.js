const mongoCollections = require('./../config/mongoCollections');

const users = mongoCollections.users;
//const u = mongoCollections.users
let { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 16;