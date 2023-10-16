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
const { Place, Comment, User } = db;
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.pic) {
        req.body.pic = 'http://placekitten.com/400/400';
    }
    if (!req.body.city) {
        req.body.city = 'Anytown';
    }
    if (!req.body.state) {
        req.body.state = 'USA';
    }
    const place = yield Place.create(req.body);
    res.json(place);
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const places = yield Place.findAll();
    res.json(places);
}));
router.get('/:placeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let placeId = Number(req.params.placeId);
    if (isNaN(placeId)) {
        res.status(404).json({ message: `Invalid id "${placeId}"` });
    }
    else {
        const place = yield Place.findOne({
            where: { placeId: placeId },
            include: {
                association: 'comments',
                include: 'author'
            }
        });
        if (!place) {
            res.status(404).json({ message: `Could not find place with id "${placeId}"` });
        }
        else {
            res.json(place);
        }
    }
}));
router.put('/:placeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let placeId = Number(req.params.placeId);
    if (isNaN(placeId)) {
        res.status(404).json({ message: `Invalid id "${placeId}"` });
    }
    else {
        const place = yield Place.findOne({
            where: { placeId: placeId },
        });
        if (!place) {
            res.status(404).json({ message: `Could not find place with id "${placeId}"` });
        }
        else {
            Object.assign(place, req.body);
            yield place.save();
            res.json(place);
        }
    }
}));
router.delete('/:placeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let placeId = Number(req.params.placeId);
    if (isNaN(placeId)) {
        res.status(404).json({ message: `Invalid id "${placeId}"` });
    }
    else {
        const place = yield Place.findOne({
            where: {
                placeId: placeId
            }
        });
        if (!place) {
            res.status(404).json({ message: `Could not find place with id "${placeId}"` });
        }
        else {
            yield place.destroy();
            res.json(place);
        }
    }
}));
router.post('/:placeId/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const placeId = Number(req.params.placeId);
    req.body.rant = req.body.rant ? true : false;
    const place = yield Place.findOne({
        where: { placeId: placeId }
    });
    if (!place) {
        res.status(404).json({ message: `Could not find place with id "${placeId}"` });
    }
    const author = yield User.findOne({
        where: { userId: req.body.authorId }
    });
    if (!author) {
        res.status(404).json({ message: `Could not find author with id "${req.body.authorId}"` });
    }
    const comment = yield Comment.create(Object.assign(Object.assign({}, req.body), { placeId: placeId }));
    res.send(Object.assign(Object.assign({}, comment.toJSON()), { author }));
}));
router.delete('/:placeId/comments/:commentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let placeId = Number(req.params.placeId);
    let commentId = Number(req.params.commentId);
    if (isNaN(placeId)) {
        res.status(404).json({ message: `Invalid id "${placeId}"` });
    }
    else if (isNaN(commentId)) {
        res.status(404).json({ message: `Invalid id "${commentId}"` });
    }
    else {
        const comment = yield Comment.findOne({
            where: { commentId: commentId, placeId: placeId }
        });
        if (!comment) {
            res.status(404).json({ message: `Could not find comment with id "${commentId}" for place with id "${placeId}"` });
        }
        else {
            yield comment.destroy();
            res.json(comment);
        }
    }
}));
module.exports = router;
