import React from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { connect } from 'react-redux'

import { notify } from './reducers/notificationReducer'

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
      this.props.notify(
        {
          text: `wrong username or password`,
          type: 'error'
        }, 5
      )
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
      })
      this.props.notify(
        {
          text: `the blog has been deleted`,
          type: 'success'
        }, 5
      )
    } catch(exception) {
      this.props.notify(
        {
          text: `There was an error with deleting the blog`,
          type: 'error'
        }, 5
      )
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
        )
      })
      this.props.notify(
        {
          text: `your like for '${updatedBlog.title}' has been registered. Votes: ${updatedBlog.likes}`,
          type: 'success'
        }, 5
      )
    } catch(exception) {
      // Show error message
      this.props.notify(
        {
          text: `There was an error with adding your like`,
          type: 'error'
        }, 5
      )
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
        }
      })

      this.props.notify(
        {
          text: `a new blog '${newBlog.title}' by ${newBlog.author} added`,
          type: 'success'
        }, 5
      )

      // Hide blog form
      this.blogForm.toggleVisibility()

    } catch(exception) {
      // Show error message
      this.props.notify(
        {
          text: `There was an error with submitting the new blog`,
          type: 'error'
        }, 5
      )
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

const mapDispatchToProps =
  {
    notify
  }

const ConnectedApp = connect(
  null,
  mapDispatchToProps
)(App)

export default ConnectedApp;
