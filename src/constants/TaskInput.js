import React, { Component } from 'react';

export default class TaskInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
        }
    }

    _submit = async () => {
        if (this.state.text) {
            this.props._addTask(this.state.text).then(() => {
                this.setState({text: ''});
            })
        }
      }

    _input = (e) => {
        this.setState({text: e.target.value});
    }

    _keyIn = (e) => {
        if (e.key === 'Enter') {
            this._submit();
        }
    }

    render() {
             
        let Tags = <p className='tags-place'>#beProductive</p>;

        return (
            <div className='task-input-cnt'>
                <input type='text'
                    placeholder='Type it in'
                    // maxLength={60}
                    name="text"
                    value={this.state.text}
                    onChange={this._input}
                    onSubmit={this._submit}
                    onKeyPress={this._keyIn}
                    className='task-input-field' />
                <button
                    onClick={this._submit}
                    className='task-submit'>
                    <p>add</p>    
                </button>
                
                <div
                    className='tags-place'
                    style={{height: 10 + 'px', display: 'flex', width: 100 + '%', flexDirection: 'row'}}>
                    { Tags }
                </div>
            </div>
        );
    }  
}
