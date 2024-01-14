import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'testauthor',
  url: 'www.componentesting.fi',
  likes: 3,
  user: {
    username: 'testperson',
    name: 'Test Person',
    id: '1'
  }
}

test('renders only titles by default', () => {
  const component = render(
    <Blog blog={blog} />
  )

  expect(component.container).toHaveTextContent('Component testing is done with react-testing-library')

  expect(component.container).not.toHaveTextContent('testauthor')

  expect(component.container).not.toHaveTextContent('www.componentesting.fi')

  expect(component.container).not.toHaveTextContent('Test Person')

})

test('before clicking view, all info is not displayed', async () => {
  const { container } = render(<Blog blog={blog} />)

  const togglableDiv = container.querySelector('.togglableContent')
  expect(togglableDiv).toHaveStyle('display: none')
})

test('after clicking view, all info is displayed', async () => {
  const { container } = render(<Blog blog={blog} />)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const togglableDiv = container.querySelector('.togglableContent')
  expect(togglableDiv).not.toHaveStyle('display: none')
})

test('renders all info after clicking view', async () => {
  const component = render(
    <Blog blog={blog} />
  )

  const user = userEvent.setup()
  const button = component.getByText('view')
  await user.click(button)

  expect(component.container).toHaveTextContent('Component testing is done with react-testing-library')

  expect(component.container).toHaveTextContent('testauthor')

  expect(component.container).toHaveTextContent('www.componentesting.fi')

  expect(component.container).toHaveTextContent('Test Person')
})

test('clicking like twice', async () => {
  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} update={mockHandler} />
  )

  const user = userEvent.setup()
  const viewButton = component.getByText('view')
  await user.click(viewButton)

  const likeButton = component.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})


