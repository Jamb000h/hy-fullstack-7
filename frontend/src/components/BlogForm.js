import React from 'react'
import PropTypes from 'prop-types'

const BlogForm = (props) => (
  <form onSubmit={props.onSubmit}>
    <h2>create new</h2>
    <label htmlFor="title">
      title
      <input 
        type="text"
        name="title"
        id="title"
        value={props.newBlog.title}
        onChange={props.onChange} />
      </label>

    <label htmlFor="title">
      author
      <input
        type="text"
        name="author"
        id="author"
        value={props.newBlog.author}
        onChange={props.onChange} />
    </label>

    <label htmlFor="url">
      url
      <input
        type="text"
        name="url"
        value={props.newBlog.url}
        onChange={props.onChange} />
    </label>

      <input type="submit" value="create" />
  </form> 
)

BlogForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  newBlog: PropTypes.object.isRequired
}

export default BlogForm
