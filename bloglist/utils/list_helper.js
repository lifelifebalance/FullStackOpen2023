const dummy = (blogs) => {
  return 1
}

const totallikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return []
  }

  let mostLikedBlog = blogs.reduce((mostliked, blog) => {
    if (mostliked.likes >= blog.likes) {
      return mostliked
    } else {
      return blog
    }
  })

  return {
    title: mostLikedBlog.title,
    author: mostLikedBlog.author,
    likes: mostLikedBlog.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const blogsOfAuthor = {}

  blogs.forEach(b => {
    if (blogsOfAuthor[b.author]) {
      blogsOfAuthor[b.author] += 1
    } else {
      blogsOfAuthor[b.author] = 1
    }
  });

  let authorOfMostBlogs = ''
  let blogCount = 0

  for (const author in blogsOfAuthor) {
    if (blogsOfAuthor[author] > blogCount) {
      authorOfMostBlogs = author
      blogCount = blogsOfAuthor[author]
    }
  }
  return {
      author: authorOfMostBlogs,
      blogs: blogCount
    }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  let authorOfBlogMostLikes = ''
  let likesCount = 0

  blogs.forEach(blog => {
    if (blog.likes > likesCount) {
      authorOfBlogMostLikes = blog.author
      likesCount = blog.likes
    } 
  })

  return {
    author: authorOfBlogMostLikes,
    likes: likesCount
  }
}

module.exports = {
  dummy,
  totallikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

