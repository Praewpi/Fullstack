import { useState } from 'react'

const BlogForm = ({ createBlog, setMessage, setMessageType }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    createBlog(blogObject)

    setMessage(`A new blog ${newTitle} by ${newAuthor}`)
    setMessageType('success')
    setTimeout(() => {
      setMessage(null)
    }, 5000)

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        Title:
        <input
          id='title'
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
          placeholder='blog title'
        />
      </div>
      <div>
        Author:
        <input
          id='author'
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
          placeholder='blog author'
        />
      </div>
      <div>
        URL:
        <input
          id='url'
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
          placeholder='blog url'
        />
      </div>
      <button type="submit">Create</button>
    </form>
  )
}

export default BlogForm