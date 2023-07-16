import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
//5.13
test('blog renders the blog\'s title and author, but does not render its URL or number of likes by default.', () => {
    const blog = {
    title: 'test blog',
    author: 'test author',
    }

    const { container } = render(<Blog blog={blog} />)

    // visible
    const titleElement = container.querySelector('.title')
    expect(titleElement).toBeVisible()
  
    const authorElement = container.querySelector('.author')
    expect(authorElement).toBeVisible()
    
    //not visible
    const urlElement = container.querySelector('.url')
    expect(urlElement).not.toBeVisible()
  
    const likesElement = container.querySelector('.likes')
    expect(likesElement).not.toBeVisible()
})

//5.14
test('url and number of likes are shown when the button is clicked', async ()  => {
  const blog = {
    title: 'test blog',
    author: 'test author',
    url: 'test url',
    likes: 55
    }

    const { container } = render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)
    
    // visible after clicked
    const urlElement = container.querySelector('.url')
    expect(urlElement).toBeVisible()
  
    const likesElement = container.querySelector('.likes')
    expect(likesElement).toBeVisible()

})



// exercise 5.15
test('if the like button is clicked twice, calls event handler twice', async () => {
    const blog = {
      title: 'test blog',
      author: 'test author',
      url: 'test url',
      likes: 55
    }
  
    const mockHandler = jest.fn()
  
    render(
      <Blog blog={blog} updateBlog={mockHandler} />
    )
  
    const user = userEvent.setup()
    const button = screen.getByText('Like')
    await user.click(button)
    await user.click(button)
  
    expect(mockHandler.mock.calls).toHaveLength(2)
  })