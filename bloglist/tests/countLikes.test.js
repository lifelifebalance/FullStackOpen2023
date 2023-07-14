const totallikes = require('../utils/list_helper').totallikes

describe('total likes', () => {

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
    
  ]

  test('when the list has only one blog, equals the likes of that', () => {
    const result = totallikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when the list has several blogs, add the all of the likes', () => {
    const result = totallikes(ListWithSeveralBlogs)
    expect(result).toBe(17)
  })

  test('when the list is empty, the number of likes should be zero', () => {
    const result = totallikes(emptyList)
    expect(result).toBe(0)
  })

})







