const express = require('express');
const router = express.Router();
const controller = require("./controller");
const {body} = require('express-validator');
const User = require("./models/user");

router.get("/",controller.renderHomePage);

router.get("/article/add",controller.ensureAuthenticated,controller.renderAddArticle);

router.post("/article/add",controller.addArticle);

router.get("/article/:id",controller.renderArticle);

router.get("/article/edit/:id",controller.ensureAuthenticated,controller.renderEditPage);

router.post("/article/edit/:id",controller.editArticle);

router.get("/article/delete/:id",controller.ensureAuthenticated,controller.deleteArticle);

router.get("/user/register",controller.renderRegister);

router.post("/user/register",[ body('email',"InvalidEmail").exists().isEmail(),
body('pass',"Password must be 6 characters").exists().isLength({min:6}),
body('cpass',"Password does not match").exists().custom((val,{req})=>val === req.body.pass)],
controller.registerUser);

router.get("/user/login",controller.renderLogin);

router.post("/user/login",controller.loginUser);

router.get("/user/logout",controller.logout);
module.exports = router;