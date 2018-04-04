import React, {Component} from 'react';
import axios from 'axios';
import ContextMenu from './ContextMenu';
import edit from '../static/img/edit.svg';
import del from '../static/img/delete.svg'

//import jquery from 'jquery';
import materialize from 'materialize-css';

export default class Directory extends Component {
    
    constructor(props) {
        super(props)
        this.renameHandler = this.renameHandler.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
    }

    

    buildHtml() {
        
    }

    componentWillMount() {
       
    }

     renameHandler() {
        console.log("RENAME")
    }

    deleteHandler() {
        console.log("DELETE")
    }

    componentDidMount() {
        console.log(del);
        console.log(edit);
    }

    render () {
         
        let html = [];
        let i = 0;
        this.props.files.map((f) => {

            if (f.ext || !f.isDirectory) {
                if (f.name_prfx) {
                    html.push(
                        <div className="file-wrap clickable" key={i}>
                            {this.props.selectOpen &&
                                <div style={{display: "inline-block"}}>
                                    <input onChange={()=> {this.props.select(f, f.name)}} type="checkbox" className="filled-in" id={f.name} />
                                    <label className="c-label" htmlFor={f.name}></label>
                                </div>
                            }
                            <i className="material-icons">insert_drive_file</i>
                            <p>{f.name_prfx}</p>
                        </div>
                    )
                }
                else {
                    html.push(
                        <div className="file-wrap clickable" key={i}>
                            {this.props.selectOpen &&
                                <div style={{display: "inline-block"}}>
                                    <input onChange={()=> {this.props.select(f, f.name)}} type="checkbox" className="filled-in" id={f.name} />
                                    <label className="c-label" htmlFor={f.name}></label>
                                </div>
                            }
                            <i className="material-icons">insert_drive_file</i>
                            <p>{f.name}</p>
                        </div>
                    )
                }
            }
            
            else {
                if (f.name_prfx) {
                    html.push(
                        <div  className="file-wrap dark-grey clickable" key={i}>
                            {this.props.selectOpen &&
                                <div style={{display: "inline-block"}}>
                                    <input onChange={()=> {this.props.select(f, f.name)}} type="checkbox" className="filled-in" id={f.name} />
                                    <label className="c-label" htmlFor={f.name}></label>
                                </div>
                            }

                            {this.props.cwd.length == 0 && 
                                <i onDoubleClick={()=>{this.props.openDir(f.path)}} className="material-icons folder">folder</i>
                            }
                            {!(this.props.cwd.length == 0) && 
                                <i onDoubleClick={()=>{this.props.openDir(f.name)}} className="material-icons folder">folder</i>
                                
                            }
                            <p>{f.name_prfx}</p>
                        </div>
                    )
                }
                else {
                    html.push(
                        <div  className="file-wrap dark-grey clickable" key={i}>
                            {this.props.selectOpen &&
                                <div style={{display: "inline-block"}}>
                                    <input onChange={()=> {this.props.select(f, f.name)}} type="checkbox" className="filled-in" id={f.name} />
                                    <label className="c-label" htmlFor={f.name}></label>
                                </div>
                            }
                            {this.props.cwd.length == 0 && 
                                <i onDoubleClick={()=>{this.props.openDir(f.path)}} className="material-icons folder">folder</i>
                            }
                            {!(this.props.cwd.length == 0) && 
                                <i onDoubleClick={()=>{this.props.openDir(f.name)}} className="material-icons folder">folder</i>
                            }
                            <p>{f.name}</p>
                        </div>
                    )
                }
            }

            i++;
        })

        return (
            <div className="dir">
                {html}
                 <ContextMenu contextID={'clickable'} items={[{'icon': '/img/edit.svg', 'label': 'Rename', 'function': this.renameHandler}, {'icon': '/img/delete.svg', 'label': 'Delete', 'function': this.deleteHandler}]} />
            </div>
        )
    }
}
