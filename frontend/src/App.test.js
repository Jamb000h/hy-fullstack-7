import React from 'react'
import { mount } from 'enzyme'
import App from './App'
import Blog from './components/Blog'
jest.mock('./services/blogs')
import blogService from './services/blogs'

describe('<App />', () => {
  let app

  describe('when user is not logged', () => {
    beforeEach(() => {
      app = mount(<App />)
    })

    it('does not render blogs before logging in', () => {
      app.update()
      const blogComponents = app.find(Blog)
      expect(blogComponents.length).toEqual(0)
    })
  })

  describe('when user is logged', () => {
    beforeEach(() => {
      const user = {
        username: 'tester',
        token: '1231231214',
        name: 'Teuvo Testaaja',
        id: 'fakeId'
      }
      
      localStorage.setItem('loggedUser', JSON.stringify(user))

      app = mount(<App />)
    })

    it('renders all blogs when logged in', () => {
      app.update()
      const blogComponents = app.find(Blog)
      expect(blogComponents.length).toEqual(blogService.blogs.length)
    })
  })
})