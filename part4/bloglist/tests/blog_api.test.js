const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

// initialize the database before every test with the beforeEach function:
beforeEach(async () => {
    await Blog.deleteMany({})
    for (const blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
}, 100000)

test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    }, 100000)

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
}, 100000)    


test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  for (const blog of response.body) {
    expect(blog.id).toBeDefined()
  }
}, 100000)

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(ret => ret.title)
  expect(contents).toContain(
    'Canonical string reduction'
  )
}, 100000)

//verifies that making an HTTP POST request to the /api/blogs URL successfully creates a new blog post
test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Fullstack',
    author: 'Ginger',
    url: 'https://github.com/Praewpi/Fullstack',
    likes: 555,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // the total number of blogs in the system is increased by one
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  // the content of the blog post is saved correctly to the database
  const contents = blogsAtEnd.map(ret => ret.title)
  expect(contents).toContain(newBlog.title)
}, 100000)

//4.11, verifies that if the likes property is missing from the request, it will default to the value 0.
test('when the default value of likes property is 0', async () => {
  const newBlog = {
    title: 'Full Stack',
    author: 'Ginger',
    url: 'https://github.com/Praewpi/Fullstack',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const newBlogId = response.body.id

  const blogsAtEnd = await helper.blogsInDb()
  const blog = blogsAtEnd.find(blog => blog.id === newBlogId)
  expect(blog.likes).toEqual(0)
}, 100000)

//4.12
test('posting a blog without title returns 400 Bad Request', async () => {
  const newBlog = {
    author: 'John Doe',
    url: 'https://johndoe.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  }, 100000)
  
test('posting a blog without url returns 400 Bad Request', async () => {
  const newBlog = {
    title: 'My Blog',
    author: 'John Doe'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  }, 100000)


  
afterAll(async () => {
  await mongoose.connection.close()
})