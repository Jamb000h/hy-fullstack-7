import React from 'react'
import { shallow } from 'enzyme'
import SimpleBlog from './SimpleBlog'

describe('<SimpleBlog />', () => {

  let blogComponent
  let mockHandler
  let blog

  beforeEach(() => {
    blog = {
      title: 'This is the title',
      author: 'I am the author',
      likes: 7
    }

    mockHandler = jest.fn()

    blogComponent = shallow(
      <SimpleBlog 
        blog={blog}
        onClick={mockHandler}
      />
    )
  })

  it('renders content', () => {
    const headerDiv = blogComponent.find('.header')
    const contentDiv = blogComponent.find('.content')

    expect(headerDiv.text()).toContain(blog.title)
    expect(headerDiv.text()).toContain(blog.author)
    expect(contentDiv.text()).toContain(blog.likes)
  })

  it('handles click event twice when clicked twice', () => {
    const button = blogComponent.find('button')

    button.simulate('click')
    button.simulate('click')

    expect(mockHandler.mock.calls.length).toBe(2)
  })
})