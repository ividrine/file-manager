import React, {Component} from 'react';

export default class BreadCrumb extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            fileType: '',
            newFile: ''
        }

        this.setNewFileType = this.setNewFileType.bind(this);
        this.addFile = this.addFile.bind(this);
        this.setFile = this.setFile.bind(this);
    }

    setFile(e) {
        console.log("hit");
        e.preventDefault();
        this.setState({
            newFile: e.target.value
        })
        console.log(this.state.newFile);
    }

    addFile() {
        console.log("Working")
        let ft = this.state.fileType;
        let nf = this.state.newFile;
        this.setState({
            fileType: ''
        })
        this.props.createFile(ft, nf);
        
    }

    setNewFileType(type) {
        this.setState({
            fileType: type
        })
    }
    
    componentWillMount() {

    }

    componentDidMount() {
        $('.modal').modal();
    }

    render () {

        let _html = []

        console.log("CWD")

        if (this.props.cwd.length == 0) {
            _html.push(<p>Favorites</p>)
        }
        else {
            this.props.cwd.map((name)=> {
             _html.push(<p key={name} >/{name}</p>)
            })
        }
        
        console.log("HTML")
        console.log(_html);
        return (
            <div className="bc">
                {_html}
                <div className="tools">
                    
                    <a onClick={()=>{this.props.setSelect()}} className="btn">Select</a>
                    
                    {this.props.selectOpen &&
                        <div style={{display: "inline-block"}}>
                            <i onClick={()=> {this.props.addToFavorites()}} style={{color: '#d6c662'}} className="material-icons tool-icon">star_border</i>
                            <i onClick={()=> {this.props.delete()}} className="material-icons tool-icon del">delete_forever</i>
                        </div>
                    }
                    <a className="modal-trigger" href="#modal1"><i style={{color: "#72c978"}} className="material-icons tool-icon">add_circle</i></a>
                    <a onClick={()=>{this.props.getFavorites()}}><i style={{color: '#d6c662'}} className="material-icons tool-icon">star</i></a>
                    <a onClick={()=>{this.props.loadDefault()}}><i style={{color: "#3a3a3a"}} className="material-icons tool-icon">home</i></a>
                    <i onClick={()=> {this.props.up()}} className="material-icons arrow">arrow_drop_up</i>
                    
                    
                </div>

                <div id="modal1" className="modal">
                    <div className="modal-content">
                        <h4>New File or Directory</h4>
                        {this.state.fileType == '' &&
                            <div>
                                <a onClick={()=> {this.setNewFileType('dir')}} className="btn waves-effect">New Directory</a>
                                <a onClick={()=> {this.setNewFileType('file')}} className="btn waves-effect">New File</a>
                            </div>
                        }

                        {this.state.fileType == 'dir' &&
                            <div className="input-field">
                                <input onChange={this.setFile} placeholder="New Folder" type="text" className="validate" />
                            </div>
                        }

                        {this.state.fileType == "file" &&
                            <div className="input-field">
                                <input onChange={this.setFile} placeholder="New File" type="text" className="validate" />
                            </div>
                        }
                        
                    </div>

                    {this.state.fileType != '' &&
                        <div className="modal-footer">
                            <a onClick={()=> {this.setNewFileType('')}} className="waves-effect waves-red btn-flat">Back</a>
                            <a onClick={()=> {this.addFile()}} className="modal-action modal-close waves-effect waves-red btn-flat">Submit</a>
                        </div>
                    }
                    
                </div>
            </div>
        )
    }
}
