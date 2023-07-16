import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog }) => {
  const [detailVisible, setDetailVisible] = useState(false)

  //add details about the blog are shown or not
  const hideWhenVisible = { display: detailVisible ? 'none' : '' }
  const showWhenVisible = { display: detailVisible ? '' : 'none' }

  const toggleVisibility = () => {
    setDetailVisible(!detailVisible)
  }
  // CSS style
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  // for like button
  const updateLikes = () => {
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }

    updateBlog(blog.id, blogObject)
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog.id)
    }
  }


  return (
    <div style={blogStyle}>
      <div>
        <span className='title'>{blog.title}</span> by <span className='author'>{blog.author}{' '}</span>
        <div style={{ display: 'inline-block' }}>
          <div style={hideWhenVisible}>
            <button onClick={toggleVisibility}>View</button>
          </div>
        </div>
        <div style={showWhenVisible}>
          <button onClick={toggleVisibility}>Hide</button>
        </div>
      </div>
      <div style={showWhenVisible}>
        <div className='url'>URL: {blog.url}</div>
        <div className='likes'>
          Likes: {blog.likes}
          <button onClick={updateLikes}>Like</button>
        </div>
        <button onClick={handleRemove}>Remove</button>
      </div>
    </div>
  )
}

export default Blog