const express = require("express");
const app = express();
const fs  = require('fs');
const fileUpload = require('express-fileupload');
var serveIndex = require('serve-index');

app.use(fileUpload());
app.use('/store', serveIndex(__dirname + '/store'));

app.post('/upload', function(req, res) {
    let sampleFile;
    let uploadPath;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    sampleFile = req.files.sampleFile;
    uploadPath = './store/' + sampleFile.name;

    sampleFile.mv(uploadPath, function(err) {
        if (err)
          return res.status(500).send(err);
    
        res.send('File uploaded!');
    });
});

app.get("/download/:name", function(request, response){
    const file = './store/' + request.params.name;

    new Promise(function(resolve, reject) {
        response.download(file, (err)=>{
            if (err){
                response.status(500).send("The file available for download only once / Файл доступен для скачивания только один раз.");
            }
            resolve();
        });        
    }).then(() =>{
        try {
            fs.unlink(file,function(){})
        }catch(err) {
            response.status(500).send("The file available for download only once / Файл доступен для скачивания только один раз!");
        }
    })
});

app.use(express.static(`public`));
app.listen(3001);
