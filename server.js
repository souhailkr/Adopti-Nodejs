const Sequelize = require('sequelize')
const express = require('express')
const app = express()
const port = 3000


var multer, path, crypto;
multer = require('multer')


path = require('path');
crypto = require('crypto');

const mysql = require('mysql');

// Create connection
const dbi = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'demo'
});


//JWT AUTH
const jwt = require('jsonwebtoken')


//connection




var db = require('./models')
const petModel = require('./models/pet')
const userModel = require('./models/user')
const Pet = petModel(db.sequelize,Sequelize)
const User = userModel(db.sequelize,Sequelize)
User.belongsToMany(User, { as: "Follower", foreignKey: "FollowerId", through: "Follower_Followeds" })
User.belongsToMany(User, { as: "Followed", foreignKey: "FollowedId", through: "Follower_Followeds" })

Pet.belongsTo(User);

db.sequelize.sync({alter:false}).then(function(){
    app.listen(port, function () {
        console.log('listening to port ' + port)
    })
});











var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


//uploadimage

var fs = require('fs');


//follow
app.post('/follow/:id', function(req, res) {

            var id = req.params.id ;



    User.findByPk(req.body.id).then(user =>
                //res.send(user)
                user.addFollowed(id).then(res.send('followed'))
            )

});

//showFollower

app.post('/showFollowers', function (req, res) {


    User.findByPk(req.body.id).then(user =>
        user.getFollower().then(followings =>
            res.send(followings)
        )
    )
});





//test/
app.post('/data', function(req, res){
    var username=req.body.name;
    connection.query("INSERT INTO `names` (name) VALUES (?)", username.toString(), function(err, result){
        if(err) throw err;
        console.log("1 record inserted");
    });
    res.send(username);
});
//************
storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        return crypto.pseudoRandomBytes(16, function(err, raw) {
            if (err) {
                return cb(err);
            }
            return cb(null,

                file.originalname)

                ;
        });
    }
});




//............


app.get('/uploads/:upload', function (req, res){
    file = req.params.upload;
    console.log(req.params.upload);
    var img = fs.readFileSync(__dirname + "/uploads/" + file);
    res.writeHead(200, {'Content-Type': 'image/png' });
    res.end(img, 'binary');

});

//ajouter pet
app.post('/addpet' ,multer({
    storage: storage
}).single('test'), function (req, res) {



        var pet = Pet.build({
            name: req.body.name,
            age: req.body.age,
            sexe: req.body.sexe,
            description: req.body.description,
            breed: req.body.breed,
            type: req.body.type,
            size: req.body.size,
            photo: req.body.image,
            altitude:req.body.altitude,
            longitude:req.body.longitude,
            UserId:req.body.user
        })
        pet.save()
        return res.json({
            message: "post created"
        });


        })







//show all
app.get('/showallpets', function(req, res){



            Pet.findAll({include: [{ model: User}]}).then(pets => res.json(pets))

   //

});

app.get('/showallusers', function(req, res){



    User.findAll().then(users => res.json(users))

    //

});


app.get('/getpets', (req, res) => {
    let sql = 'SELECT * FROM pets';
    let query = dbi.query(sql, (err, result) => {
        if(err) throw err;
        result = JSON.stringify(result);
        res.send(result);
    });
});

// app.get('/getpet/:id', (req, res) => {
//     let sql = `SELECT * FROM pets WHERE id = ${req.params.id}`;
//     let query = dbi.query(sql, (err, result) => {
//         if(err) throw err;
//         result = JSON.stringify(result);
//         res.send(result);
//     });
// });

app.get('/getpet/:id', function(req, res) {
    // let sql = `SELECT * FROM pets WHERE id = ${req.params.id}`;
    // let query = dbi.query(sql, (err, result) => {
    //     if(err) throw err;
    //
    //     res.json(result);
    // });

    var id = req.params.id ;

    Pet.findOne({
        where: {id: id},
        include: [{model: User}]
    }).then(pet => res.json(pet))
});

app.get('/getpets/:type', function(req, res) {
    // let sql = `SELECT * FROM pets WHERE id = ${req.params.id}`;
    // let query = dbi.query(sql, (err, result) => {
    //     if(err) throw err;
    //
    //     res.json(result);
    // });

    var type = req.params.type ;

    Pet.findAll({
        where: {type:type},
        include: [{model: User}]
    }).then(pet => res.json(pet))
});

app.get('/getpets/:type', function(req, res) {
    // let sql = `SELECT * FROM pets WHERE id = ${req.params.id}`;
    // let query = dbi.query(sql, (err, result) => {
    //     if(err) throw err;
    //
    //     res.json(result);
    // });

    var type = req.params.type ;

    Pet.findAll({
        where: {type:type},
        include: [{model: User}]
    }).then(pet => res.json(pet))
});


app.get('/getPetsByUser/:UserId', function(req, res) {

    var UserId = req.params.UserId ;

    Pet.findAll({
        where: {UserId:UserId},
        include: [{model: User}]
    }).then(pet => res.json(pet))
});




app.get('/showpetbyid', verifyToken, function(req, res){
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
          res.sendStatus(403);
        } else {
            //here goes the protected code
            var id = req.query.id
            Pet.findById(id).then(pet => res.json(pet),console.log(id))
        }
      });
    
})

//LOGIN
app.post('/login', function(req, res){
    console.log(req.body.email)
    User.find({
        where: {
          email: req.body.email,
          password: req.body.password
        }
      }).then(user => 
        jwt.sign({user}, 'secretkey', (err, token) => {
        res.json({
          token
        });
      }))


      
})


//Verify the JWT before any protected route
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      next();
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  
  }



app.get('/', function (req, res) {
    res.json({ 'title': 'my route' })
});





