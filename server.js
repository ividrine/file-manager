import express from 'express';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import rimraf from 'rimraf';

let app = express();
let port = process.env.port || 3000;
const root = 'C:/Users';
const base_dir = '/ividr';

app.use(express.static(path.join(__dirname, 'src', 'static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/api/files', (req, res) => {

  let _files = [];
  let query = req.query.path || base_dir;
  let root_path = root + query;
  let _cwd = query.split('/');
  
  _cwd.forEach((p, i)=> {
    if (p == "")
      _cwd.splice(i, 1);
  })
  

  fs.readdir(root_path, (err, files) => {

    if(err)
      return res.send({err: "Sorry, we can't open that folder"})
    
    files.forEach(file => {

      let isDirectory = fs.statSync(path.join(root_path, '/', file)).isDirectory()

      if (isDirectory) {
        if (file.length > 20) {
          let _name_prfx = file.substr(0, 29) + "...";
          _files.push({name_prfx: _name_prfx, name: file, isDirectory: true, path: path.join('/', file)})
        }
        else
          _files.push({name: file, isDirectory: true, path: path.join('/', file)})
      }
      else {
        let _ext = path.extname(file);
        if (file.length > 20) {
          let _name_prfx = file.substr(0, 29) + "...";
          _files.push({name_prfx: _name_prfx, name: file, ext: _ext, isDirectory: false, path: path.join('/', file)})
        }
        else
          _files.push({name: file, ext: _ext, isDirectory: false, path: path.join('/', file)})
      }

    });
    return res.send({files: _files, cwd: _cwd })
  })

})

app.delete('/api/delete', (req, res)=> {
  let _files = [];
  let files = req.body._strArr;
  let _dir = req.body.dir;
  
  for (var i = 0; i < files.length; i++) {
    let isDirectory = fs.statSync(path.join(root + files[i])).isDirectory()
    
    if (isDirectory) {
      console.log("its a dir")
      rimraf.sync(root + files[i])
      console.log("finsihed del")
    }
    else {
      fs.unlinkSync(root + files[i])
    }
    
  }
  
  let returnFiles = fs.readdirSync(root + _dir);

  if(!returnFiles)
    return res.send({err: "Sorry, we can't open that folder"})
  
  returnFiles.forEach(file => {

    let isDirectory = fs.statSync(path.join(root + _dir, '/', file)).isDirectory()

    if (isDirectory) {
      if (file.length > 20) {
        let _name_prfx = file.substr(0, 29) + "...";
        _files.push({name_prfx: _name_prfx, name: file, isDirectory: true, path: path.join('/', file)})
      }
      else
        _files.push({name: file, isDirectory: true, path: path.join('/', file)})
    }
    else {
      let _ext = path.extname(file);
      if (file.length > 20) {
        let _name_prfx = file.substr(0, 29) + "...";
        _files.push({name_prfx: _name_prfx, name: file, ext: _ext, isDirectory: false, path: path.join('/', file)})
      }
      else
        _files.push({name: file, ext: _ext, isDirectory: false, path: path.join('/', file)})
    }

  });
  return res.send({files: _files})
})

app.post('/api/create', (req, res) => {
  
  let _type = req.body.data.type;
  let _path = req.body.data.path;

  if (_type == 'dir') {

    fs.mkdir(root + _path, (err) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
        
      else
        return res.send({success: true})
    })
  }
  else {

    fs.writeFile(root + _path, " ", (err) => {
      if (err)
        return res.send(err)
      else {
        return res.send({success: true})
      }
    }); 
    
  }
  
})

app.listen(port, () => {
  console.log("Server started");
})
