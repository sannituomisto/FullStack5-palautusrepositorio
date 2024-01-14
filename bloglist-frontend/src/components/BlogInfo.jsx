const BlogInfo = ({ blog, user, update, removeBlog }) => {

  const deleteBlog= (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog.id)
    }
  }


  const updateLikes= (event) => {
    event.preventDefault()
    update ({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes += 1,
      user: blog.user.id
    })
  }

  return (
    <div style={{ border: '2px solid LightSkyBlue', padding: '5px', marginBottom: '5px', marginTop:'2px' }}>
      {blog.author} <br/>
      {blog.url} <br/>
      likes {blog.likes} {' '}
      <button id='like-button' onClick={updateLikes}>like</button> <br/>
      {blog.user.name} <br/>
      {user === blog.user.username && (
        <div>
          <button id='remove-button' onClick={deleteBlog}>remove</button>
        </div>
      )}
    </div>
  )
}

export default BlogInfo