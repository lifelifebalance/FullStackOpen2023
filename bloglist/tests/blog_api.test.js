const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')



let token = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  const testUser = {
    username: "test",
    name: "Tom Tester",
    password: "testtest"
  }

  // Create testUser
  await api
    .post('/api/users')
    .send(testUser)

  // 
  const loginTestUser = {
    username: "test",
    password: "testtest"
  }

  const loginResponse = await api
    .post('/api/login')
    .send(loginTestUser)

  token = `Bearer ${loginResponse.body.token}`

})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(6)
})

test('unique identifier property of blog is named id', async () => {
  const response = await api.get('/api/blogs')

  // Ensure that array is not empty
  expect(response.body).not.toHaveLength(0)

  // Check for id
  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})
describe('posting a blog', () => {

  test('a valid blog can be posted', async () => {
    const newBlog = {
      title: "Math Blog",
      author: "Leonhard Euler",
      url: "e.com",
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // fetch blogs from db to check if posting was successfull
    const response = await api.get('/api/blogs')

    // array of authors
    const authors = response.body.map(r => r.author)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(authors).toContain('Leonhard Euler')
  })

  test('If the like property is missing it defaults to zero', async () => {
    const newBlog = {
      title: "Missing likes",
      author: "Jane Doe",
      url: "someblog.com",
    }

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')


    // const likes = response.body.map(r => r.likes)
    // expect(likes[initialBlogs.length]).toBe(0)

    const blogWithoutLikes = response.body.find(b => b.title === "Missing likes")
    expect(blogWithoutLikes.likes).toBe(0)
  })

  test('If URL property is missing, the blog cannot be added', async () => {
    const newBlog = {
      title: "Missing URL",
      author: "John Doe",
      likes: "2",
    }

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    const blogsInDb = response.body

    expect(blogsInDb).toHaveLength(helper.initialBlogs.length)
  })

  test('If title property is missing, the blog cannot be added', async () => {
    const newBlog = {
      author: "James Doe",
      url: "missingtitle.com",
      likes: "1",
    }

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    const blogsInDb = response.body

    expect(blogsInDb).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {

    const blogTestUser = {
      title: "testing stuff",
      author: "Tom Tester",
      url: "tom-testing-stuff.com",
      likes: 1
    }

    const responseBefore = await api.get('/api/blogs')
    const blogIdsBefore = responseBefore.body.map(b => b.id)
   
    // test user is postin blog for later deletion
    const postResponse = await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(blogTestUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogToDelete = postResponse.body.id

    // Check if blog was posted
    const response = await api.get('/api/blogs')
    const blogIds = response.body.map(b => b.id)
    expect(blogIds).toContain(blogToDelete)

  
    // Delete blog
    await api
      .delete(`/api/blogs/${blogToDelete}`)
      .set('Authorization', token)
      .expect(204)

    const responseAfterDeletion = await api.get('/api/blogs')
    const blogIdsAfterDeletion = responseAfterDeletion.body.map(b => b.id)

    expect(blogIdsAfterDeletion).not.toContain(blogToDelete)
    expect(blogIdsAfterDeletion).toHaveLength(blogIdsBefore.length)

  })
})

describe('updating a blog', () => {
  test('succeeds with status code 200 and updates blog with certain id', async () => {

    const blogToUpdate = {
      id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 55555,
    }

    const idOfBlogUpdated = blogToUpdate.id

    await api
      .put(`/api/blogs/${idOfBlogUpdated}`)
      .send(blogToUpdate)
      .expect(200)

    const response = await api.get('/api/blogs')
    const blogsAfterUpdate = response.body

    const updatedBlog = blogsAfterUpdate.find(blog => blog.id === idOfBlogUpdated)
    expect(updatedBlog.likes).toBe(55555)


  })
})

describe('when there is initially one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'simon',
      name: 'Simon Hoffmann',
      password: 'nomis',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(users => users.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username is taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'toor',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('Creation of user fails with proper statuscode if username is to short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'bo',
      name: "Too Short",
      password: "shorty"
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Username needs to be at least 3 characters long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('Creation of user fails with proper statuscode if the password is to short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'bobo',
      name: "Too Short",
      password: "bo"
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Password needs to be at least 3 characters long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})






afterAll(async () => {
  await mongoose.connection.close()
})
