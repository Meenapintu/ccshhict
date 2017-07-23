var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var multer  = require('multer');
var formidable = require('formidable');
var cloudinary = require('cloudinary');
var cloudinaryStorage = require('multer-storage-cloudinary');


cloudinary.config({
  cloud_name: 'cloud_name',
  api_key: 'your-api-key',
  api_secret: 'Your-api-secret'
})

//app.use(express.static(__dirname + '/dist'));
app.use(express.static(__dirname+"/." ));

// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
   console.log(req.host);
   res.sendFile(__dirname+'/htmls/cropimage.html')
})

// This responds a POST request for the homepage
app.post('/', function (req, res) {
   console.log("Got a POST request for the homepage");
   res.send('Hello POST');
})



app.get('/a3', function (req, res) {
   console.log(req.host);
   res.sendFile(__dirname+'/htmls/cropimage.html')
})

app.get('/showimages',function (req, res) {
   console.log(req.host);
   res.sendFile(__dirname+'/htmls/images.html')
})


var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, __dirname+'/imgs');
  },
  filename: function (request, file, callback) {
    console.log(file);
    callback(null, file.originalname)
  }
});


var storage1 = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: '',
  allowedFormats: ['jpg', 'png'],
  filename: function (req, file, cb) {
    cb(undefined, file.originalname);
  }
});

var upload = multer({storage: storage}).any();

app.post('/upload', function(request, response) {
  upload(request, response, function(err) {
    if(err) {
      console.log('Error Occured'+err);
      return;
    }
    // request.files is an object where fieldname is the key and value is the array of files 
    console.log(request.files);
            if(request.files[0].url == undefined){
          for(var i=0;i<request.files.length;i++)
          {

            
            request.files[i].destination = "null";
            request.files[i].path = "imgs/"+request.files[i].filename;
            request.files[i].url = request.files[i].path;

          }
            }
       response.json(request.files);
    //response.end('Your Files Uploaded');
    console.log('Photo Uploaded');
  })
});

app.set('port', (process.env.PORT || 5000));

var server = app.listen(app.get('port'), function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})


var pg = require('pg');

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});
