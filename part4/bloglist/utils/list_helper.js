
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs
    .map(blog => blog.likes)
    .reduce((sum, item) => {
      return sum + item
    }, 0)
}

const favoriteBlog = (blogs) => {
  const blog = blogs.reduce((prev, current) => {
    return (prev.likes > current.likes) ? prev : current
  })

  delete blog._id
  delete blog.__v

  return blog
}

//cal author with most number blogs
const mostBlogs = (blogs) => {
  let blogCount = {}
  blogs.forEach(blog => {
    if (blog.author in blogCount) {
      blogCount[blog.author]++
    } else {
      blogCount[blog.author] = 1
    }
  })

  let maxAuthor = ''
  let maxCount = -Infinity
  for (const [author, count] of Object.entries(blogCount)) {
    if (count > maxCount) {
      maxAuthor = author
      maxCount = count
    }
  }

  return {
    author: maxAuthor,
    blogs: maxCount,
  }
}

const mostLikes = (blogs) => {
  let likeCount = {}
  blogs.forEach(blog => {
    if (blog.author in likeCount) {
      likeCount[blog.author] += blog.likes
    } else {
      likeCount[blog.author] = blog.likes
    }
  })

  let maxAuthor = ''
  let maxLikes = -Infinity
  for (const [author, likes] of Object.entries(likeCount)) {
    if (likes > maxLikes) {
      maxAuthor = author
      maxLikes = likes
    }
  }

  return {
    author: maxAuthor,
    likes: maxLikes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}