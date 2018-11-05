import React from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

import './index.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      username: '',
      password: '',
      user: null,
      newBlog: {
        title: '',
        author: '',
        url: ''
      },
      notification: {
        type: '',
        text: ''
      }
    }
  }

  componentDidMount() {
    blogService.getAll().then(blogs =>
      this.setState({ blogs })
    )

    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({user})
      blogService.setToken(user.token)
    }
  }

  login = async (event) => {
    event.preventDefault()
    try{
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })

      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
  
      this.setState({ username: '', password: '', user})
    } catch(exception) {
      this.setState({
        notification: {
          type: "error",
          text: "wrong username or password"
        }
      })
      setTimeout(() => {
        this.setState({
          notification: {
            type: "",
            text: ""
          }
        })
      }, 5000)
    }
  }

  logout = () => {
    window.localStorage.removeItem('loggedUser')
    this.setState({
      user: null
    })
  }

  handleLoginFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleBlogFormChange = (event) => {
    this.setState({
      newBlog: {...this.state.newBlog, [event.target.name]: event.target.value }
    })
  }

  handleDelete = async (id) => {
    try {

      const deletedBlog = await blogService.deleteBlog(id)

      console.log(deletedBlog)

      // Show success message
      this.setState({
        blogs: this.state.blogs.filter( blog => blog.id !== id),
        notification: {
          type: "success",
          text: `the blog has been deleted`
        }
      })
    } catch(exception) {
      // Show error message
      this.setState({
        notification: {
          type: "error",
          text: "There was an error with deleting the blog"
        }
      })
    } finally {
      // Hide message in 5 seconds
      setTimeout(() => {
        this.setState({
          notification: {
            type: "",
            text: ""
          }
        })
      }, 5000)
    }
  }

  handleLike = async (id) => {

    try {
      const blogById = this.state.blogs.find( blog => blog.id === id)

      const blogToUpdate = {
        title: blogById.title,
        author: blogById.author,
        url: blogById.url,
        likes: blogById.likes + 1,
        user: blogById.user.id
      }

      const updatedBlog = await blogService.update(blogToUpdate, id)

      // Add blog to list, show success message and clear form fields
      this.setState({
        blogs: this.state.blogs.map( blog => blog.id === updatedBlog.id ?
          {...blog, likes: updatedBlog.likes} :
          blog
        ),
        notification: {
          type: "success",
          text: `your like for '${updatedBlog.title}' has been registered. Votes: ${updatedBlog.likes}`
        }
      })
    } catch(exception) {
      // Show error message
      this.setState({
        notification: {
          type: "error",
          text: "There was an error with adding your like"
        }
      })
    } finally {
      // Hide message in 5 seconds
      setTimeout(() => {
        this.setState({
          notification: {
            type: "",
            text: ""
          }
        })
      }, 5000)
    }


  }

  handleBlogFormSubmit = async (event) => {
    event.preventDefault()
    try{
      const newBlog = await blogService.create(this.state.newBlog)

      // Add blog to list, show success message and clear form fields
      this.setState({
        blogs: [...this.state.blogs, newBlog],
        newBlog: {
          title: '',
          author: '',
          url: ''
        },
        notification: {
          type: "success",
          text: `a new blog '${this.state.newBlog.title}' by ${this.state.newBlog.author} added`
        }
      })

      // Hide blog form
      this.blogForm.toggleVisibility()

    } catch(exception) {
      // Show error message
      this.setState({
        notification: {
          type: "error",
          text: "There was an error with submitting the new blog"
        }
      })
    } finally {
      // Hide message in 5 seconds
      setTimeout(() => {
        this.setState({
          notification: {
            type: "",
            text: ""
          }
        })
      }, 5000)
    }
  }

  render() {
    const loginForm = () => (
      <div>
        <h1>Log in to application</h1>
    
        <form onSubmit={this.login}>
          <div>
            username
            <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleLoginFieldChange}
            />
          </div>
          <div>
            password
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleLoginFieldChange}
            />
          </div>
          <button type="submit">kirjaudu</button>
        </form>
      </div>
    )

    const blogList = () => (
      <div>
        {this.state.blogs
          .sort( (a, b) => {
            return a.likes < b.likes
          })
          .map(blog => 
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={this.handleLike}
              handleDelete={this.handleDelete}
              loggedUserId={this.state.user.id} />
          )
        }
      </div>
    )
    return (
      <div>
        <Notification notification={this.state.notification}/>
        {this.state.user === null ?
        loginForm() :
        <div>
          <h1>blogs</h1>
          <p>{this.state.user.name} logged in</p>
          <button onClick={this.logout}>logout</button>
          <Togglable buttonLabel="Add new form" ref={component => this.blogForm = component}>
            <BlogForm
              newBlog={this.state.newBlog}
              onChange={this.handleBlogFormChange}
              onSubmit={this.handleBlogFormSubmit} />
          </Togglable>
          {blogList()}
        </div>
        }

      </div>
    );
  }
}

export default App;
