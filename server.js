import express from 'express';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import rimraf from 'rimraf';
import Redis from 'ioredis';


let app = express();

let redis = new Redis({
  port: 6379,          // Redis port
  host: '127.0.0.1',   // Redis host
  db: 0
})

let port = process.env.port || 3000;
const root = 'C:/Users';
const base_dir = '/ividr';

app.use(express.static(path.join(__dirname, 'src', 'static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/favorites', (req, res) => {

  let p = req.body.files

  console.log(p);

  redis.sadd('favorites', p)
    .then((result) => {
      console.log(result)
      return res.send({success: true})
    })
    .catch((err) => {
      console.log(err);
      return res.send({Error: err})
    })

})

app.delete('/api/favorites', (req, res) => {

  let p = req.body.data.path;

  redis.srem("favorites", p)
    .then((results) => {
      console.log(results);
      return res.send({_results: results});
    })
})

app.get('/api/favorites', (req, res) => {
  
  let _files = [];

  redis.smembers('favorites')
    .then((results) => {

      results.forEach((_path) => {

        console.log(_path);
        let _name = path.basename(_path);
        
        console.log(_name);

        

        let isDirectory = fs.statSync(path.join(root, _path)).isDirectory();

        console.log(isDirectory);

        if (isDirectory) {
          if (_name.length > 20) {
            let _name_prfx = _name.substr(0, 29) + "...";
            _files.push({name_prfx: _name_prfx, name: _name, isDirectory: true, path: _path})
          }
          else
            _files.push({name: _name, isDirectory: true, path: _path})
        }
        else {
          let _ext = path.extname(_path);
          if (_name.length > 20) {
            let _name_prfx = _name.substr(0, 29) + "...";
            _files.push({name_prfx: _name_prfx, name: _name, ext: _ext, isDirectory: false, path: _path})
          }
          else
            _files.push({name: _name, ext: _ext, isDirectory: false, path: _path})
        }

      })
      return res.send(_files);
    })
    .catch((err) => {
      return res.send(err);
    })

})

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

app.put('/api/update', (req, res) => {

  console.log(req.body);
  if (req.body.fileName && req.body.newName && req.body.path) {
    let _file = root + req.body.path + "/" + req.body.fileName;
    let _newFile = root + req.body.path + "/" + req.body.newName;

    fs.rename(_file, _newFile, (err) => {
      if (err)
        return res.send({error: err});

      return res.send("Success");
    })

  }
  else {
    return res.send({error: "Request body has incorrect data and/or nothing was found to rename"})
  }



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
