//Cypress runs the tests in order
describe('Blog app', function() {
  beforeEach(function () {
  cy.request('POST', 'http://localhost:3003/api/testing/reset')
  const user = {
    name: 'Matti Luukkainen',
    username: 'mluukkai',
    password: 'salainen'
  }
  cy.request('POST', 'http://localhost:3003/api/users/', user)
  cy.visit('')
  })

  it('front page can be opened', function() {
    cy.contains('Blogs')
  })

  // 5.17
  it('login form is shown', function () {
    cy.get('#username').should('not.be.visible')
    cy.get('#password').should('not.be.visible')

    cy.contains('Login').click()
     // after click those fields are visible
    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
  })
  
   describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('Login').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('Login').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'Wrong username or password')
        //Check that the notification shown with unsuccessful login is displayed red.
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')

    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('a new blog can be created', function () {
      cy.contains('New Blog').click()

      cy.get('#title').type('test title')
      cy.get('#author').type('test author')
      cy.get('#url').type('test url')

      cy.contains('Create').click()
      cy.contains('A new blog test title by test author')
      cy.get('li').contains('test title by test author')
    })


  describe('and blog exist', function() {
    beforeEach(function () {
      cy.createBlog({
        title: 'test title',
        author: 'test author',
        url: 'test url'
      })
    })
    // 5.20 test: like
    it('users can like a blog', function() {
      cy.contains('View').click()
      cy.contains('Like').click()
      cy.get('li')
        .should('contain', 'Likes: 1')
    })
  })
})


})
