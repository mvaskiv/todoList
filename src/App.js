import React, { Component } from 'react';
import { Today } from './constants/Today';
import Tasks from './screens/Tasks';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import './App.css';

PouchDB.plugin(PouchFind);

class App extends Component {
  render() {
    return (
      <div className="App">
         <div className='todos'>
            <Today tasksList={ t => this.tasks._viewList(t) } />
            <Tasks ref={ ref => this.tasks = ref } />
        </div>
      </div>
    );
  }
}

export default App;
