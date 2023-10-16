"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const router = require('express').Router();
const db = require("../models");
const bcrypt = require('bcrypt');
const { User } = db;
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield User.findOne({
        where: { email: req.body.email }
    });
    if (!user || !(yield bcrypt.compare(req.body.password, user.passwordDigest))) {
        res.status(404).json({ message: 'Invalid email or password' });
    }
    else {
        req.session.userId = user.userId;
        res.json({ user });
    }
}));
router.get('/profile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.session.userId);
    try {
        let user = yield User.findOne({
            where: {
                userId: req.session.userId
            }
        });
        res.json(user);
    }
    catch (_a) {
        res.json(null);
    }
}));
module.exports = router;
