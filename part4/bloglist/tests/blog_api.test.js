const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const User = require('../models/users')
const Blog = require('../models/blog')
const helper = require('./test_helper')


const api = supertest(app)

// // initialize the database before every test with the beforeEach function:
// beforeEach(async () => {
//     await Blog.deleteMany({})
//     await Blog.insertMany(helper.initialBlogs)
// }, 100000)


describe('when there is initially some blogs saved', () => {
// initialize the database before every test with the beforeEach function:
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
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

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(ret => ret.title)
  expect(contents).toContain(
    'Canonical string reduction'
  )
}, 100000)

})

describe('post to /api/blogs', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekretpw', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()

    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })


//verifies that making an HTTP POST request to the /api/blogs URL successfully creates a new blog post
test('a valid blog can be added', async () => {
  const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'sekretpw',
      })
    const token = loginResponse.body.token

  const newBlog = {
    title: 'Fullstack',
    author: 'Ginger',
    url: 'https://github.com/Praewpi/Fullstack',
    likes: 555,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
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

  const loginResponse = await api
  .post('/api/login')
  .send({
    username: 'root',
    password: 'sekretpw',
  })
const token = loginResponse.body.token

  const newBlog = {
    title: 'Fullstack',
    author: 'Ginger',
    url: 'https://github.com/Praewpi/Fullstack',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
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
  const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'sekretpw',
      })
    const token = loginResponse.body.token

  const newBlog = {
    author: 'John Doe',
    url: 'https://johndoe.com',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(400)
    
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  }, 100000)
  
test('posting a blog without url returns 400 Bad Request', async () => {
  const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'sekretpw',
      })
    const token = loginResponse.body.token

  const newBlog = {
    title: 'My Blog',
    author: 'John Doe',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(400)
    
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  }, 100000)

  // ex 4.23
  test('adding a blog fails if a token is not provided', async () => {
    const newBlog = {
      title: 'Fullstack',
      author: 'Ginger',
      url: 'https://github.com/Praewpi/Fullstack',
      likes: 100,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

})
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

test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  for (const blog of response.body) {
    expect(blog.id).toBeDefined()
  }
}, 100000)

})

describe('deletion of a blog', () => {
  // init value
  beforeEach(async () => {
    // add two users
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('ownerpw', 10)
    const user1 = new User({ username: 'blogowner', passwordHash })
    const user2 = new User({ username: 'other', passwordHash })
    await user1.save()
    await user2.save()

    // add one blog own by one of the users
    await Blog.deleteMany({})
    const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'blogowner',
        password: 'ownerpw',
      })
    const token = loginResponse.body.token
    const newBlog = {
      title: 'Fullstack',
      author: 'Ginger',
      url: 'https://github.com/Praewpi/Fullstack',
      likes: 100,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
  })

  // ex 4.13 & 4.21
  test('a blog can be deleted by its owner', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'blogowner',
        password: 'ownerpw',
      })
    const token = loginResponse.body.token

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(0)

    const contents = blogsAtEnd.map(r => r.title)

    expect(contents).not.toContain(blogsAtEnd.title)
  })

  test('a blog cannot be deleted by others', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'other',
        password: 'ownerpw',
      })
    const token = loginResponse.body.token

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

    const contents = blogsAtEnd.map(r => r.title)
    expect(contents).toContain('Fullstack')
  })
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


describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekretpw', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh new username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

 // exercise 4.16
 describe('username and password', () => {
 test('creation fails when username is not given', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    name: 'Matti Luukkainen',
    password: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('both username and password must be given')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toEqual(usersAtStart)
})

// ex 4.16
test('creation fails when password is not given', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('both username and password must be given')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toEqual(usersAtStart)
})

test('creation fails when username is shorter than 3 characters', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'ml',
    name: 'Matti Luukkainen',
    password: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('both username and password must be at least 3 characters long')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toEqual(usersAtStart)
})

test('creation fails when password is shorter than 3 characters', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'sa',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('both username and password must be at least 3 characters long')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toEqual(usersAtStart)
})
})

afterAll(async () => {
  await mongoose.connection.close()
})