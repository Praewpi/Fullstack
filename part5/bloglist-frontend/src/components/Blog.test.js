import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
//5.13
test('renders content', () => {
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
