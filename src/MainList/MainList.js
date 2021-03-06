import React from 'react';
import Note from '../Note/Note';
import NoteContext from '../NoteContext';
import {Link} from 'react-router-dom';
import {grabNotesForFolder} from '../MiscFunctions';
import PropTypes from 'prop-types';
import './MainList.css';

//maps notes from folder or all notes and displays each as a list



export default class MainList extends React.Component {
  static default = {
    match: {
      params: {}
    }
  }
  static contextType = NoteContext;
  handleClickDelete = e => {
    const {folderId} = this.props.match.params;
    this.props.history.push(`/`)

  fetch(`http://localhost:9090/folders/${folderId}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'},
  })
  .then(res => {
    if (!res.ok)
      return res.json().then(e => Promise.reject(e))
    return res.json()
  })
  .then(() =>{
    this.context.deleteFolder(folderId)
    }) 
    .catch(error => {
      console.error({ error })
    })
  }
  render(){
    const {folderId} = this.props.match.params;
    const {notes=[]} = this.context;
   const notesForFolder = grabNotesForFolder( notes,folderId);
  return (
    <section className='MainList'>
      <ul>
        {notesForFolder.map(note =>
          <li key={note.id}>
            <Note
              id={note.id}
              name={note.name}
              modified={note.modified}
            />
          </li>
        )}
      </ul>
      {folderId !== undefined &&
       <button
        onClick={(e) => this.handleClickDelete(e)}
        >Delete Folder</button>}
        <Link to='/add-note'>
        <button className='add-note-button'>Add New Note</button>
        </Link>
    </section>
  )
  }
}

MainList.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  }