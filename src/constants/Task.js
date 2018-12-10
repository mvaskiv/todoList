import React, { Component } from 'react';
import PouchDB from 'pouchdb';
const db = new PouchDB('mydb-desktop')

export const Task = (props) => {
  let text = props.details.text;
  let hr = props.details.hours < 10 ? `0${props.details.hours}` : props.details.hours
  let min = props.details.minutes < 10 ? `0${props.details.minutes}` : props.details.minutes
  let search    = new RegExp(props.search, 'i');
  
  if (!props.search || (props.search
    && (props.details.text.match(search)))) {
    return (
      <div
        id={props.details._id}
        onContextMenu={() => props._view(props.view === props.details._id ? '' : props.details._id)}
        className='task-list-item'
        style={{boxShadow: props.view === props.details._id ? '0 0 15px #cacaca' : 'none'}}
        >
          <svg
            onClick={() => props.complete(props.details._id)}
            className={props.details.completed ? 'icon-done-marked' : 'icon-done'}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            x="0px"
            y="0px"
            fill='#c41313'
            viewBox="0 0 100 125"
            xmlSpace="preserve"><g>
            <polygon points="85.4,30.2 81.1,26 39.4,67.7 18.9,47.2 14.6,51.4 39.4,76.2  "/>        
          </g></svg>
          <p className='task-item-origin'>{hr}:{min}</p>
          <p className={props.details.completed ? 'task-item-text compl' : 'task-item-text'}>{text}</p>
      </div>
    );
  } else return null
}

export default class TaskEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: this.props.details.text,
      expanded: false,
    }
  }

  _expand = (e) => {
    if (e.target !== this.checkmark) {
      this.setState({expanded: !this.state.expanded})
    }
  }

 _input = (e) => {
   this.setState({text: e.target.value})
  }

  _update = async () => {
    db.get(this.props.details._id).then(async (doc) => {
      doc.text = await this.state.text;
      db.put(doc);
      this.props._edit(0)
    })
  }

  _done = () => {
    db.get(this.props.details._id).then(async (doc) => {
      doc.completed = await doc.completed ? 0 : 1;
      db.put(doc);
    })
  }
  
  render() {
    return (
      <div
        onClick={this._expand}
        id={this.props.details._id}
        onContextMenu={() => this.props._view(this.props.view === this.props.details._id ? '' : this.props.details._id)}
        className='task-list-item'
        style={{boxShadow: this.props.view === this.props.details._id | this.props.edit === this.props.details._id ? '0 0 15px #cacaca' : 'none',
                height: this.state.expanded ? 'auto' : 45+'px',
                whiteSpace: this.state.expanded ? 'normal' : 'nowrap'}}
          >
          <svg
          ref={r => this.checkmark = r}
          onClick={this._done}
          className={this.props.details.completed ? 'icon-done-compl' : 'icon-done'} 
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          x="0px"
          y="0px"
          fill='#c41313'
          viewBox="0 0 100 125"
          xmlSpace="preserve"><g>
          <polygon points="85.4,30.2 81.1,26 39.4,67.7 18.9,47.2 14.6,51.4 39.4,76.2  "/>        
          </g></svg>
          <p className='task-item-origin'>{this.props.details.origin}</p>
          {this.props.edit === this.props.details._id ? 
            <input autoFocus={true} type='text' name='text' onBlur={this._update} onChange={this._input} className='task-item-text edit' value={this.state.text} />
          :
            <p className={this.props.details.completed ? 'task-item-text compl' : 'task-item-text'}>{this.state.text}</p>
          }
      </div>
    );
  }
}
