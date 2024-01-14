describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'secret'
    }
    const user2 = {
      name: 'Other User',
      username: 'otheruser',
      password: 'secret'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user) 
    cy.request('POST', 'http://localhost:3003/api/users/', user2) 
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('Log in')
  })


  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()

      cy.contains('Test User logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('invalid username or password')
      cy.contains('Log in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testuser', password: 'secret' })
    })

    it('A blog can be created', function() {
      cy.contains('Create a new blog')
      cy.get('#newBlog-button').click()
      cy.get('#title').type('Blog created with cypress')
      cy.get('#author').type('Cypress')
      cy.get('#url').type('www.cypressmanuals.com')
      cy.get('#create-button').click()

      cy.contains('a new blog Blog created with cypress by Cypress added')
      cy.contains('Blog created with cypress')
    })
  })

  describe('When logged in and there is a blog in the database', function() {
    beforeEach(function() {
      cy.login({ username: 'testuser', password: 'secret' })
      cy.createBlog({
        title: 'Blog created with cypress',
        author: 'Cypress',
        url: 'www.cypressmanuals.com'
      })
    })

    it('A blog can be liked', function() {
      cy.contains('.blog', 'Blog created with cypress')
        .get('#view-button').click()
        .get('#like-button').click()

        cy.contains('likes 1')
    })

    it('A blog can be deleted by the user who created the blog', function() {
      cy.contains('.blog', 'Blog created with cypress')
        .get('#view-button').click()
        .get('#remove-button').click()

        cy.contains('Deleted Blog created with cypress')
    })

    it('only user who created the blog can see the remove button', function() {
      cy.get('#logout-button').click()

      cy.login({ username: 'otheruser', password: 'secret' })

      cy.contains('.blog', 'Blog created with cypress')
        .get('#view-button').click()
        .get('#remove-button').should('not.exist')

    })

    it('A blog with the most likes is first', function() {

      cy.createBlog({
        title: 'Blog testing',
        author: 'Cypress professional',
        url: 'www.cypresstesting.com'
      })

      cy.contains('.blog', 'Blog created with cypress')
      .within(() => {
        cy.get('#view-button').click()
        cy.get('#like-button').click()
      })

      cy.get('.blog').eq(0).should('contain', 'Blog created with cypress')
      cy.get('.blog').eq(1).should('contain', 'Blog testing')

      cy.contains('.blog', 'Blog testing')
      .within(() => {
        cy.get('#view-button').click()
        cy.get('#like-button').click()
        cy.get('#like-button').click()
      })

      cy.get('.blog').eq(0).should('contain', 'Blog testing')
      cy.get('.blog').eq(1).should('contain', 'Blog created with cypress')

    })
  })
})
