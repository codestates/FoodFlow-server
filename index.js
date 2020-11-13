const express = require('express')
const app = express()
const port = 3000
const bodyParser = require("body-parser");
const {user} = require('./models');
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");


app.use(
  cors({
    origin: ["http://im23-foodflow.s3-website.ap-northeast-2.amazonaws.com"],
    method: ["GET", "POST", "PATCH"],
    credentials: true,
  })
);

app.use(
  session({
    secret: "@switzerland",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(morgan("dev"));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    user
        .findAll()
        .then(result => {
            if (result) {
                res
                    .status(200)
                    .json(result);
            } else {
                res.sendStatus(204);
            }
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500); // Server error
        });
})

//할일 -> post 요청 (signup, signin) //////////////////

app.post('/user/signup', (req, res) => {

    const {email, password, username} = req.body;
  user
        .findOrCreate({
            where: {
                email: email
            },
            defaults: {
                username: username,
                password: password
            }
        })
        .then(async ([user, created]) => {

            if (!created) {
                return res
                    .status(409)
                    .send('이메일 있음 ㅋㅋ')
            } else {
                const data = await user.get({plain: true});
                res
                    .status(201)
                    .json(data);
            }
        })
        .catch(err => {
            console.log('회원가입 오류뜸 ㅋㅋ');
            console.error(err);
            res.sendStatus(500); // Server error
        });
})

app.post("/user/signin", (req, res) => {
 
  const { email, password } = req.body;
 
  req.session.regenerate(() => {
      user
        .findOne({
          where: {
            email: email,
            password: password,
          },
        })
        .then((data) => {
          if (!data) {
            return res.status(404).send("이미있는유저");
          }
          req.session.userid = data.id;
          res.status(200).json({
            email: data.email,
            username: data.username,
            profile_image: data.profile_image,
            createdAt: data.createdAt,
            updatedAt:data.updatedAt
          });
        })
        .catch((err) => {
          res.status(404).send(err);
        });
    });
});






/////////////////////

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
