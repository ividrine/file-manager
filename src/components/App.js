import React, {Component} from 'react';
import axios from 'axios';
import BreadCrumb from './BreadCrumb';
import Directory from './Directory';
import M from 'materialize-css'




export default class App extends Component {
    
    constructor(props) {
        super(props)

        this.state = {
            files: [],
            cwd: [],
            selected: [],
            selectOpen: false
        }

        this.openDir = this.openDir.bind(this);
        this.up = this.up.bind(this);
        this.select = this.select.bind(this)
        this.setSelect = this.setSelect.bind(this);
        this.delete = this.delete.bind(this);
        this.createFile = this.createFile.bind(this);
        this.getFavorites = this.getFavorites.bind(this);
        this.loadDefault = this.loadDefault.bind(this);
        this.addToFavorites = this.addToFavorites.bind(this);
        
    }

    addToFavorites() {

        if (this.state.selected.length == 0) 
            return false;
        
        let _files = [];

        this.state.selected.forEach((f) => {
            _files.push(f.path);
        })

        axios.post('/api/favorites', {files: _files})
            .then((resp) => {
                M.toast(`You added ${_files.length} items to favorites`, 4000)
                this.setState({
                    selectOpen: false,
                    selected: []
                })
            })
            .catch((err) => {
                console.log(err)
            })


    }

    getFavorites() {

        let _this = this;

        axios.get('/api/favorites')
            .then((resp) => {
                console.log(resp)
                _this.setState({
                    files: resp.data,
                    cwd: []
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    createFile(_type, _name) {
        console.log(this.state);
        let _cwd = this.state.cwd;
        let query = "";

        for (var i = 0; i < _cwd.length; i++) {
            query += ("/" + _cwd[i])
        }

        query += ("/" + _name);
        
        let _isDirectory = false;
        let _this = this;

        axios.post('/api/create', {data: {path: query, type: _type}})
            .then((resp) => {
                if (_type == 'dir')
                    _isDirectory = true;
                let _files = _this.state.files;
                _files.push({name: _name, isDirectory: _isDirectory, path: "/" + _name});
                _this.setState({
                    files: _files
                })
            })
            .catch((err)=> {
                console.log(err);
            })

    }

    setSelect() {

        let bool = this.state.selectOpen
        this.setState({
            selectOpen: !bool,
            selected: []
        })

        
    }
    sort(files) {

        let tempDir = [];
        let tempFiles = [];

        for (var i = 0; i < files.length; i++) {
            if (files[i].isDirectory)
                tempDir.push(files[i])
            else 
                tempFiles.push(files[i])
        }

        return tempDir.concat(tempFiles)
    }

    openDir(name) {

        let _cwd = this.state.cwd;
        let query = "";

        if (_cwd.length == 0) {
            query = name
        }
        else {
            for (var i = 0; i < _cwd.length; i++) {
                query += ("/" + _cwd[i])
            }
            query += ("/" + name);
        }
        
        console.log("QUERY")
        console.log(query);

        axios.get('/api/files?path=' + query)
            .then((resp)=> {
                this.setState({
                    files: this.sort(resp.data.files),
                    cwd: resp.data.cwd,
                    selected: []
                })
            })
            .catch((err)=> {
                console.log(err);
            })
    }

    up() {

        let _cwd = this.state.cwd;
        _cwd.pop();
        let query="";
        for (var i = 0; i < _cwd.length; i++) {
            query += ("/" + _cwd[i])
        }
        axios.get('/api/files?path=' + query)
            .then((resp)=> {
                this.setState({
                    files: this.sort(resp.data.files),
                    cwd: resp.data.cwd,
                    selected: []
                })
            })
            .catch((err)=> {
                console.log(err);
            })
    }

    delete() {
        let _cwd = this.state.cwd;
        let cwd_str = "";
        let selectedFiles = this.state.selected;
        let strArr = [];
        let _files = this.state.files;

        for (var i = 0; i < _cwd.length; i++) {
            cwd_str += "/" + _cwd[i];
        }

        for (var i = 0; i < selectedFiles.length; i++) {
            strArr.push(selectedFiles[i].path);
        }

        let _this = this;

        axios.delete('/api/delete', {data: {_strArr: strArr, dir: cwd_str}})
            .then((resp)=> {
                _this.setState({
                    files: this.sort(resp.data.files),
                    selected: [],
                    selectOpen: false
                })
            })
            .catch((err)=>{
                console.log(err);
            })
        
    }

    select(_file, _id) {

        let _cwd = this.state.cwd;
        let name = _file.name;
        let str = "";

        for (var i = 0; i < _cwd.length;i++) {
            str += "/" + _cwd[i]
        }
        
        str += "/" + name;
        let _path = str;

        let s = {path: _path, id: _id};
        let tempList = this.state.selected;
        let found = false;

        for (var i = 0; i < tempList.length; i++) {
            if (JSON.stringify(s) == JSON.stringify(tempList[i])) {
                found = true;
                tempList.splice(i, 1);
                this.setState({
                    selected: tempList
                })
                break;
            }
        }
        if (!found) {
            tempList.push(s);
            this.setState({
                selected: tempList
            })
        }

    }

    loadDefault() {

        axios.get('/api/files')
            .then((resp)=> {
                this.setState({
                    files: this.sort(resp.data.files),
                    cwd: resp.data.cwd
                })
                
            })
            .catch((err)=> {

                console.log(err);

            })
    }

   

    componentWillMount() {

        this.loadDefault();

    }

    render () {

        return (
            <div className="container">
                <BreadCrumb addToFavorites={this.addToFavorites} loadDefault={this.loadDefault} getFavorites={this.getFavorites} createFile={this.createFile} setFile={this.setFile} delete={this.delete} selectOpen={this.state.selectOpen} setSelect={this.setSelect} up={this.up} cwd={this.state.cwd} />
                <Directory selectOpen={this.state.selectOpen} select={this.select} up={this.up} openDir={this.openDir} files={this.state.files} cwd={this.state.cwd} />
            </div>
          
        )
    }
}
