import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

//5.16
//The test should check,that the form calls the event handler it received as props with the right details 
//when a new blog is created
test('<BlogForm /> updates parent state and calls createBlog', async () => {
  const createBlog = jest.fn()
  const setMessage = jest.fn()
  const setMessageType = jest.fn()
  const user = userEvent.setup()


  // Render the component
  render(
    <BlogForm
      createBlog={createBlog}
      setMessage={setMessage}
      setMessageType={setMessageType}
    />
  )
  // Get form elements
  const titleInput = screen.getByPlaceholderText('blog title')
  const authorInput = screen.getByPlaceholderText('blog author')
  const urlInput = screen.getByPlaceholderText('blog url')
  const sendButton = screen.getByText('Create')

  // Type values and submit form
  await user.type(titleInput, 'test title')
  await user.type(authorInput, 'test author')
  await user.type(urlInput, 'test url')
  await user.click(sendButton)


  // Assertions
  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'test title',
    author: 'test author',
    url: 'test url',
  })

})