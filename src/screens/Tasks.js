import React, { Component } from 'react';
import PouchDB from 'pouchdb';
import Input from '../constants/TaskInput';
import TaskEdit, { Task } from '../constants/Task'
const db = new PouchDB('mydb-desktop')

export default class Tasks extends Component {
    constructor() {
      super();
      this.state = {
        today: '',
        dataSource: [],
        view: '',
        context: false,
        loaded: false,
        tag: '',
        edit: '',
        search: ''
      }
      this._getUpdate();
    }

    componentDidMount() {
      document.addEventListener('contextmenu', this._handleContextMenu);
      document.addEventListener('click', this._handleClick);
    }

    _handleClick = (e) => {
      if (e.target !== this.context) {
        this.setState({context: false, view: ''});
      }
    }

    _handleContextMenu = async (e) => {
      await e.preventDefault()
      console.log(e)
      if (typeof e.target.className === 'string' && e.target.className.match(/(task-list)|(task-item)/)) {
        const top = e.clientY + this.tasks.scrollTop - 320;
        this.setState({context: {x: top, y: 120}});
      }
    }

    _sortTasks(stash, today) {
      let todo = [];
      let done = [];

      stash.map(e => {
        if (e.completed === 0) {
          return todo.push(e);
        } else return done.push(e);
      })
      return(todo.concat(done));
    }

  
    _getUpdate = async () => {
      let selector = await this.state.tag ? {
        'type': 'task',
        'completed': {$eq: parseInt(this.state.tag)},
      } : {
        'type': 'task',
        'completed': {$gte: 0},
      }
      db.createIndex({
        index: {fields: ['type']},
      })
      db.find({
        selector: selector,
        sort: ['_id'],
      }).then((res) => {
        this.setState({ dataSource: this._sortTasks(res.docs.reverse(), new Date().getDate()) }, () => {
          this.setState({loaded: true}, () => this.forceUpdate())
        })
      });
    }

    _view = (id) => {
      this.setState({view: id}, () => {
        this.forceUpdate()
      })
    }

    _viewList = async (id) => {
      await this.setState({tag: id}, () => {
        this._getUpdate();
      })
    }

    _addTask = async (text) => {
      let date = await new Date()
      let hr = date.getHours()
      let min = date.getMinutes()

      db.put({
      '_id': date.getTime().toString(),
      'type': 'task', 'text': text,
      'hours': hr, 'minutes': min,
      'date': date.getDate(), 'month': date.getMonth(),
      'completed': 0 })
        .then(this._getUpdate)
    }

    _done = (id) => {
      db.get(id).then(async (doc) => {
        doc.completed = await doc.completed ? 0 : 1;
        db.put(doc);
      }).then(this._getUpdate)
    }

    _edit = (i) => {
      if (i === 0) {
        this.setState({edit: ''}, this._getUpdate)
      } else {
        this.setState({edit: this.state.view})
      }
    }

    _delete = () => {
      db.get(this.state.view).then(doc => {
        return db.remove(doc)
      }).then(this._getUpdate)
    }

    _onChange = (e) => {
      this.setState({[e.target.name]: e.target.value})
    }
    
    render() {
        let Tasks;
        if (this.state.dataSource[0]) {
        Tasks = this.state.dataSource.map((task, i) => {
            if (this.state.edit === task._id) {
              return <TaskEdit details={ task } edit={ this.state.edit } _edit={ this._edit } key={ i } view={ this.state.view } _view={ this._view } />
            } else {
              return (
                <Task search={ this.state.search } details={ task } edit={ this.state.edit } key={ i } view={ this.state.view } _view={ this._view } complete={ this._done } />
              )
            }
        })
        }

        return (
        <div>
          <div>
            <Input _addTask={ this._addTask } />
          </div>
          <div className='tasks-list' ref={r => this.tasks = r}>
         <Search text={this.state.search} _input={ this._onChange } />

          {/* Context Menu */}
            {this.state.context &&
              <div className='context-menu'
                ref={e => this.context = e}
                style={{top:this.state.context.x,left:this.state.context.y}}>
                <p className='context-menu-item' onClick={this._edit}>edit</p>
                <VerticalSeparator color='#ddd' />
                <p className='context-menu-item delete' onClick={this._delete} style={{color: '#c41313'}}>delete</p>
            </div> }

            { Tasks }
          </div>
        </div>
        )
    }
}

const Search = (props) => (
  <input type='search'
    placeholder='Search'
    name="search"
    value={props.text}
    onChange={props._input}
    className='task-search-field' />
)

const VerticalSeparator = (props) => (
  <div style={{
    width: 1+'px',
    height: 100+'%',
    backgroundColor: props.color,
  }} />
)