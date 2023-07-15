import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    // Check if there is a logged-in user in local storage
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      // Set the token for authenticated requests
      blogService.setToken(user.token)
    }
  }, [])
   
  // Make a login request with the provided username and password
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })
      // Save the logged-in user to the local storage
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      // Set the user state
      setUser(user)
      // Clear the username and password fields
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('Wrong username or password')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    console.log(`logging out for ${user.name}`)

    // Clear the logged-in user from the local storage
    window.localStorage.removeItem('loggedBlogAppUser')
    // Reset the user state
    setUser(null)
  }
  // add block
  const createBlog = (blogObject) => {

    blogService
      .create(blogObject)
      .then(retunedBlog => {
      setBlogs(blogs.concat(retunedBlog))
      })
  }

  const loginForm = () => {
    return (
        <Togglable buttonLabel="Login">
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    )
  }

//acts as a reference to the component
//ensures the same reference (ref) that is kept throughout re-renders of the component
const blogFormRef = useRef()

const blogForm = () => {
    return (
        <Togglable buttonLabel="New Blog" ref={blogFormRef}>
        <BlogForm 
          createBlog={createBlog}
          setMessage={setMessage}
          setMessageType={setMessageType}
        />
        </Togglable>
    )
}

  return (
    <div>
      <h1>Blogs</h1>

      <Notification message={message} type={messageType}/>

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          {blogForm()}
          <ul>
          {blogs.map(blog =>
         <li key={blog.id}><Blog key={blog.id} blog={blog} /></li>
        )}
        </ul>
        </div>
      }
    </div>
  )
}

export default App