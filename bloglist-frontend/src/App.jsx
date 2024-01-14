import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  const timeOut = (messageType) => {
    setTimeout(() => {
      if (messageType === 'success') {
        setMessage(null)
      } else if (messageType === 'error') {
        setErrorMessage(null)
      }
    }, 5000)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id='username'
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='password'
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type='submit'>login</button>
    </form>
  )

  const notification = () => {
    if (message === null) {
      return null
    }

    const notificationStyle= {
      color: 'green',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    }

    return (
      <div id='notification' style={notificationStyle}>
        {message}
      </div>
    )
  }

  const errorNotification = () => {
    if (errorMessage === null) {
      return null
    }

    const errorStyle= {
      color: 'red',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    }

    return (
      <div style={errorStyle}>
        {errorMessage}
      </div>
    )
  }

  const getBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(sortBlogs(blogs))
  }

  const sortBlogs = (blogs) => {
    const sortedBlogs= blogs.sort((a, b) => b.likes - a.likes)
    return sortedBlogs
  }

  useEffect(() => {
    getBlogs()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setErrorMessage(exception.response.data.error)
      timeOut('error')
    }
    setUsername('')
    setPassword('')
  }

  const handleLogOut = () => {
    localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      returnedBlog.user=user
      setBlogs(blogs.concat(returnedBlog))
      setMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      timeOut('success')
    } catch (exception) {
      setErrorMessage(exception.response.data.error)
      timeOut('error')
    }
  }

  const updateLikes= async (blogObject) => {
    try {
      const id = (blogs.find((b) => b.title === blogObject.title)).id
      const returnedBlog = await blogService.update(id, blogObject)
      const updatedBlogs = blogs.map(blog => blog.id !== blogObject.id ? blog : returnedBlog)
      setBlogs(sortBlogs(updatedBlogs))
    } catch (exception) {
      setErrorMessage(exception.response.data.error)
      timeOut('error')
    }
  }

  const deleteBlog = async (id) => {
    await blogService.deleteObject(id)
    getBlogs()
    const blog = blogs.find(b => b.id === id)
    setMessage(`Deleted ${blog.title} by ${blog.author}`)
    timeOut('success')
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in</h2>
        {errorNotification()}
        {loginForm()}
      </div>
    )
  }

  return (
    <div style = {{ color:'MidnightBlue' }}>
      <h2>Blogs</h2>
      <p>{user.name} logged in {' '}
        <button id='logout-button' onClick={handleLogOut}>
        logout
        </button>
      </p>
      {notification()}
      {errorNotification()}
      <h3>Create a new blog</h3>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm
          createBlog={addBlog}
        />
      </Togglable>
      <div style={{ marginBottom: '5px', marginTop:'20px' }}>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} user={user.username} update={updateLikes} removeBlog={deleteBlog}/>
        )}
      </div>
    </div>
  )
}

export default App