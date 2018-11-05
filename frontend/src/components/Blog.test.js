import React from 'react'
import { shallow } from 'enzyme'
import Blog from './Blog'

describe('<Blog />', () => {

  let blogComponent
  let mockHandleLike
  let mockHandleDelete
  let blog

  beforeEach(() => {
    blog = {
      title: 'This is the title',
      author: 'I am the author',
      url: 'http://www.url.com/',
      likes: 7,
      user: {
        id: 'fakeID',
        username: 'fakeUsername',
        name: 'Fake Name'
      }
    }

    mockHandleLike = jest.fn()
    mockHandleDelete = jest.fn()

    blogComponent = shallow(
      <Blog 
        blog={blog}
        handleLike={mockHandleLike}
        handleDelete={mockHandleDelete}
        loggedUserId={'fakeId'}
      />
    )
  })

  it('at start the content is not displayed', () => {
    const div = blogComponent.find('.content')
    expect(div.getElement().props.style).toEqual({ display: 'none' })
  })

  it('after clicking the header, content is displayed', () => {
    const header = blogComponent.find('.header')

    header.at(0).simulate('click')
    const div = blogComponent.find('.content')
    expect(div.getElement().props.style).toEqual({ display: 'block' })
  })
})