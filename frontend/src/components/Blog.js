import React from 'react'
import PropTypes from 'prop-types'

class Blog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  static propTypes = {
    handleLike: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    blog: PropTypes.object.isRequired,
    loggedUserId: PropTypes.string.isRequired,
  }

  toggleVisibility = () => {
    this.setState({visible: !this.state.visible})
  }

  like = () => {
    return () => {
      this.props.handleLike(this.props.blog.id)
    }
  }

  delete = () => {
    return () => {
      if(window.confirm(`Delete ${this.props.blog.title} by ${this.props.blog.author}?`)) {
        this.props.handleDelete(this.props.blog.id)
      }
    }
  }

  deleteButton = () => {
    if( !this.props.blog.user ||
        this.props.blog.user.id === this.props.loggedUserId) {
          return <button onClick={this.delete()}>delete</button>
        }
    return null
  }

  render() {

    const blogWrapperStyle = {
      padding: 5,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5
    }

    const blogInfoStyle = {
      display: this.state.visible ? 'block' : 'none'
    }

    const blog = this.props.blog

    return (
      <div style={blogWrapperStyle} className="wrapper">
        <div onClick={this.toggleVisibility} className="header">
          {blog.title} by {blog.author}
        </div>
        <div style={blogInfoStyle} className="content">
          <p>URL: {blog.url}</p>
          <p>Likes: {blog.likes}</p>
          <button onClick={this.like()}>like</button>
          <p>added by {blog.user.name}</p>
          {this.deleteButton()}
        </div>
      </div>  
    );
  }
}

export default Blog
