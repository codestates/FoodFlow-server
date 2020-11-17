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
const { Console } = require('console');
try {
    fs.readdirSync('uploads');
} catch (err) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성함')
    fs.mkdirSync('uploads');
}

app.use(
    session({secret: "@switzerland", resave: false, saveUninitialized: true}),
    
);
app.use(cors({
    // origin: ["http://im23-foodflow.s3-website.ap-northeast-2.amazonaws.com"],
    origin: ["http://localhost:3002"],
    method: [
        "GET", "POST", "PUT", "DELETE"
    ],
    credentials: true
}));

app.use(morgan("dev"));

app.use(bodyParser.json());

////////////////////// main page (끝)

app.get('/', (req, res) => {
    
  post
        .findAll({
             
            include: [
                {
                    model: user,
                    required: false,
                    attributes: ['email','username', 'profileImage']
                }, {
                    model: food,
                    required: false,
                    attributes: ['name','foodCategory']
                }
            ],
            raw: true, //가져오는 데이터 형태를 객체로 정리
            nest: true, //가져오는 데이터 형테를 객체로 한번 더 정리
        })
        .then(data => {
            console.log(data);
            return res
                .status(200)
                .send(data);
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500); // Server error
        });
 })


/////////////////////////회원가입 (끝)

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
///////////로그인 (끝)
app.post("/user/signin", (req, res) => {

    const {email, password} = req.body;

    req
        .session
        .regenerate(() => {
            user
                .findOne({
                    where: {
                        email: email,
                        password: password
                    }
                })
                .then((data) => {
                  console.log(data.id)
                    if (!data) {
                        return res
                            .status(404)
                            .send("이미있는유저");
                    }
                    req.session.userid = data.id;
                    res
                        .status(200)
                        .json(
                          {
                            id: data.id, email: data.email, username: data.username, profileImage: data.profileImage, createdAt: data.createdAt, updatedAt: data.updatedAt,
                          session:req.session.userid}
                        );
                })
                .catch((err) => {
                    res
                        .status(404)
                        .send(err);
                });
        });
});

////////////////////로그아웃 (테스트 필요)

  app.post("user/signout", (req, res) => {
     req.session.destroy(() => {
      res.status(205).send('로그아웃 ㅋㅋㅋㅋㅋㅋㅋㅋㅋ ')
    });
  });


// /////////////////// my page(끝)

app.get('/mypage', (req, res) => {
  console.log('세션?', req.session)
  
  const sess = req.session;
  if (sess.userid) {
      post
        .findAll({
          where: {
            userId: req.session.userid
          },         
            include: [
                {
                    model: user,
                    required: false,
                    attributes: ['email','username', 'profileImage']
                }, {
                    model: food,
                    required: false,
                    attributes: ['name','foodCategory']
                }
            ],
            raw: true, //가져오는 데이터 형태를 객체로 정리
            nest: true, //가져오는 데이터 형테를 객체로 한번 더 정리
        })
        .then((data) => {
          if (data) {
            console.log('마이페이지에서 던지는 데이터', data)
            return res.status(200).json(data);
          }
          res.sendStatus(204);
        })
        .catch((err) => {
          console.log(err);
          res.sendStatus(500);
        });
    } else {
  console.log('세션없다')
      res.status(401).send("Not found Session");
    }
  })
  












/////////write (테스트필요)
app.post('/food/write', (req, res) => {
  
   const sess = req.session;
  
  if (sess.userid) {
  
    food.
    findOrCreate({
      where: {
        name: req.body.name,
      },
      defaults: {
        name: req.body.name
      }
    }).then(async ([food, created]) => {
      if (!created) {
      return res.status(409).send('응 그래ㅋㅋ')
      } else {
         const data = await food.get({plain: true});
       return res.status(201).json(data)
      }
    })
      .catch((err) => { res.status(500).send('글쓰기 에러ㅋㅋ') })

    
  }else {
  console.log('세션없다')
      res.status(401).send("Not found Session");
    }
  
  
  })

  ////////////write 2(테스트필요)
  app.post('/posts/write', (req, res) => {
    post.
    create({
      text: req.body.text,
      rating: req.body.rating,
      foodImage: req.body.foodImage,
      userId: req.session.userid,
      foodId: req.body.id //나중에 수정
    })
    .then((data) => {
      res.status(201).json(data)
    })
  })



///////////update /////////(테스트필요)
app.put('posts/edit', (req, res) => {
  
  if (req.session.userid) { 

  post.update({
    text:req.body.text 
  }, {
    where: { id:req.body.postId  }///?
  })
 .then(result => {
     res.json(result);
  })
  .catch(err => {
     console.error(err);
     console.log('글수정 성공 ㅋ')
  });
    
  }else {
  console.log('세션없다')
      res.status(401).send("Not found Session");
    }
});


////////////////delete //////////(테스트필요)
app.delete('posts/delete', (req, res) => {
  if (req.session.userid) { 
  post.destory({
    where:{id:req.body.postId}//?
  })
    .then((data) => {
    res.redirect('/')
    })
    .catch(err => {
     console.error(err);
    console.log('글삭제 실패 ㅋㅋ')
  })
    
  }else {
  console.log('세션없다')
      res.status(401).send("Not found Session");
    }
})




//////////////////association 테스트

// app.get('/test', (req, res) => {
//     post
//         .findAll({
//             where: {
//                 id: 3 //추후 req.email
//             },
//             include: [
//                 {
//                     model: user,
//                     required: false,
//                     attributes: ['email']
//                 }, {
//                     model: food,
//                     required: false,
//                     attributes: ['name']
//                 }
//             ],
//             raw: true, //가져오는 데이터 형태를 객체로 정리
//             nest: true, //가져오는 데이터 형테를 객체로 한번 더 정리
//         })
//         .then(data => {
//             console.log(data);
//             return res
//                 .status(200)
//                 .send(data);
//         })
//         .catch(err => console.log('에러 서버'))
//     })


//multer(테스트필요)
const upload = multer({
    storage: multer.diskStorage({
        //destination : 멀티파트 파일을 저장할 위치를 정함
        destination: (req, file, cb) => {
            cb(null, 'uploads/')
        },
        //filename : 어떤 이름으로 저장할지를 정함
        filename: (req, file, cb) => {
            cb(null, new Date().valueOf() + path.extname(file.originalname));
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

//하나만 업로드 시 upload.single 미들웨어, 여러 개의 경우 multiple 미들웨어를 사용해야함
app.post('/user/upload/profile', upload.single('file'), async (req, res) => {
    const {email} = req.body
    const {originalname} = req
        .file
        console
        .log("req.body.email : " + email)
    console.log("req.file.path : " + req.file.path)

    user
        .update({
            profileImage: req.file.path
        }, { // EC2 서버에서 경로를 바꿔야할 수 있음
            where: {
                email: email
            }
        })
        .then(() => {
            res.send(req.file.filename)
        })
})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
