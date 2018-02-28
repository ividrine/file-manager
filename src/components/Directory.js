import React, {Component} from 'react';
import axios from 'axios';
//import jquery from 'jquery';
import materialize from 'materialize-css';

export default class Directory extends Component {
    
    constructor(props) {
        super(props)
    }

    buildHtml() {
        
    }

    componentWillMount() {
       
    }

    render () {
         
        let html = [];
        let i = 0;
        this.props.files.map((f) => {

            if (f.ext || !f.isDirectory) {
                if (f.name_prfx) {
                    html.push(
                        <div  className="file-wrap" key={i}>
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
                        <div  className="file-wrap" key={i}>
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
                        <div  className="file-wrap dark-grey" key={i}>
                            {this.props.selectOpen &&
                                <div style={{display: "inline-block"}}>
                                    <input onChange={()=> {this.props.select(f, f.name)}} type="checkbox" className="filled-in" id={f.name} />
                                    <label className="c-label" htmlFor={f.name}></label>
                                </div>
                            }
                            <i onDoubleClick={()=>{this.props.openDir(f.name)}} className="material-icons folder">folder</i>
                            <p>{f.name_prfx}</p>
                        </div>
                    )
                }
                else {
                    html.push(
                        <div  className="file-wrap dark-grey" key={i}>
                            {this.props.selectOpen &&
                                <div style={{display: "inline-block"}}>
                                    <input onChange={()=> {this.props.select(f, f.name)}} type="checkbox" className="filled-in" id={f.name} />
                                    <label className="c-label" htmlFor={f.name}></label>
                                </div>
                            }
                            <i onDoubleClick={()=>{this.props.openDir(f.name)}} className="material-icons folder">folder</i>
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
            </div>
          
        )
    }
}
