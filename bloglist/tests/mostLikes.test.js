const { mostLikes } = require('../utils/list_helper')

const favoriteBlog = require('../utils/list_helper').favoriteBlog
const mostBlogs = require('../utils/list_helper').mostBlogs

describe('most likes', () => {

  const emptyList = []

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const ListWithSeveralBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f7',
      title: 'Stuff with Math',
      author: 'Leonhard Euler',
      url: 'https://www.eeeeee.com',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f6',
      title: 'Cuts and drawings',
      author: 'Albrecht Dürer',
      url: 'https://www.therealad.com',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f5',
      title: 'Math stuff',
      author: 'Albrecht Dürer',
      url: 'https://www.therealaddoingmath.com',
      likes: 2,
      __v: 0
    },
    
  ]


  test('when the list has only one blog that blog should be returned', () => {
    const result = favoriteBlog(listWithOneBlog)
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', likes: 5 })
  })

  test('when the list has several blogs the blog with the most likes should be returned', () => {
    const result = favoriteBlog(ListWithSeveralBlogs)
    expect(result).toEqual({"author": "Albrecht Dürer", "likes": 7, "title": "Cuts and drawings"})
  })

  test('when the list is empty, an empty array should be returned', () => {
    const result = favoriteBlog(emptyList)
    expect(result).toEqual([])
  })

  test('author with the most blogs and the amount of blogs written are returned', () => {
    const result = mostBlogs(ListWithSeveralBlogs)
    expect(result).toEqual({"author": "Albrecht Dürer", "blogs": 2})
  })

  test('author with the blogs that has the most likes and the number of likes are returned', () => {
    const result = mostLikes(ListWithSeveralBlogs)
    expect(result).toEqual({"author": "Albrecht Dürer", "likes": 7})
  })

})







