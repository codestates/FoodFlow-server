const express = require('express')
const app = express()
const port = 3000
const bodyParser = require("body-parser");

const {user} = require('./models');
const {post} = require('./models');
const {food} = require('./models');

const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");

// 정적 파일을 다루기 위한 설정
app.use(express.static('uploads'));

const multer = require('multer');
//저장경로 단일화 모듈
const path = require('path');

//multer 모듈 사용 시, 저장용 폴더 생성을 위한 fs 모듈
const fs = require('fs');
try {
  fs.readdirSync('uploads');
} catch(err) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성함')
  fs.mkdirSync('uploads');
}

app.use(
  cors({
    // origin: ["http://im23-foodflow.s3-website.ap-northeast-2.amazonaws.com"],
    origin: ["http://localhost:3001"],
    method: ["GET", "POST", "PUT", "DELETE"],
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
            profileImage: data.profileImage,
            createdAt: data.createdAt,
            updatedAt:data.updatedAt
          });
        })
        .catch((err) => {
          res.status(404).send(err);
        });
    });
});
//////////////////association 테스트


app.get('/test', (req, res) => {
  post
    .findAll({
      where: {
        id: 3  //추후 req.email
      },
      include: [
        {
          model: user,
          required: false,
          attributes:['email'],
        },
        {
          model: food,
          required: false,
          attributes:['name'],
        },
      ],
      raw: true, //가져오는 데이터 형태를 객체로 정리
      nest:true, //가져오는 데이터 형테를 객체로 한번 더 정리
    })
    .then(data => {
      console.log(data);
      return res.status(200).send(data);
    })
    .catch(err => console.log('에러 서버'))
})


//multer
const upload = multer({
  storage: multer.diskStorage({
    //destination : 멀티파트 파일을 저장할 위치를 정함
    destination: (req, file, cb) => {
      cb(null, 'uploads/')
    },
    //filename : 어떤 이름으로 저장할지를 정함
    filename: (req, file, cb) => {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024},
})

//하나만 업로드 시 upload.single 미들웨어, 여러 개의 경우 multiple 미들웨어를 사용해야함
app.post('/user/upload/profile', upload.single('file'), async (req, res) => {
  const { email } = req.body
  const { originalname } = req.file
  console.log("req.body.email : " + email)
  console.log("req.file.path : " + req.file.path)
  
  user
    .update({
      profileImage: req.file.path }, // EC2 서버에서 경로를 바꿔야할 수 있음
      {where : {email : email}
    })
    .then(() => {
      res.send(req.file.filename)
    })
})



/////////////////////

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
