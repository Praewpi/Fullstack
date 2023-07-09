const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

// initialize the database before every test with the beforeEach function:
beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
}, 100000)
describe('when there is initially some blogs saved', () => {
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

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(ret => ret.title)
  expect(contents).toContain(
    'Canonical string reduction'
  )
}, 100000)

})

test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  for (const blog of response.body) {
    expect(blog.id).toBeDefined()
  }
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

//view and delete test
describe('viewing a specific blog', () => {
test('succeeds with a valid id', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToView = blogsAtStart[0]

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

  expect(resultBlog.body).toEqual(processedBlogToView)
}, 100000)

})

describe('deletion of a blog', () => {
test('succeeds with status code 204 if id is valid', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )
  const contents = blogsAtEnd.map(r => r.title)

  expect(contents).not.toContain(blogsAtEnd.title)
}, 100000)
})

//update blog, like 
describe('updating of a blog', () => {
test('a blog can be successfully updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  console.log(`Updating "${blogToUpdate.title}"`)

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    })
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  const blog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

  expect(blog.likes).toEqual(blogToUpdate.likes + 1)
}, 100000)
})


afterAll(async () => {
  await mongoose.connection.close()
})