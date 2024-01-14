import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog ({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange  = (event) => {
    setNewUrl(event.target.value)
  }

  BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        title: <input id='title' value={newTitle} onChange={handleTitleChange} />
      </div>
      <div>
        author: <input id='author' value={newAuthor} onChange={handleAuthorChange} />
      </div>
      <div>
        url: <input id='url' value={newUrl} onChange={handleUrlChange} />
      </div>
      <div style={{ paddingTop:'10px' }}>
        <button id='create-button' type="submit">create</button>
      </div>
    </form>
  )
}

export default BlogForm