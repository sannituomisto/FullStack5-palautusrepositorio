import BlogInfo from './BlogInfo'
import { useState } from 'react'

const Blog = ({ blog, user, update, removeBlog }) => {
  const [infoVisible, setInfoVisible] = useState(false)

  const hideWhenVisible = { display: infoVisible ? 'none' : '' }
  const showWhenVisible = { display: infoVisible ? '' : 'none' }

  return (
    <div id = {blog.title} className='blog'>
      <div style={{ color:'SteelBlue' }}>
        <b>{blog.title}</b>
      </div>
      <div style={hideWhenVisible}>
        <button id='view-button' onClick={() => setInfoVisible(true)}>view</button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {(infoVisible)&&
        <>
          <BlogInfo key={blog.id} blog={blog} user={user} update={update} removeBlog={removeBlog} />
          <button id='hide-button' onClick={() => setInfoVisible(false)}>hide</button>
        </>
        }
      </div>
      <br/>
    </div>
  )
}

export default Blog