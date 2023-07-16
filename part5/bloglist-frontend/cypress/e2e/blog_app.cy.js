
describe('Blog app', function() {

  beforeEach(function() {
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('Blogs')
  })

  it('login form can be opened', function() {
    //find that text and click
    cy.contains('Login').click()
  })

  it('user can login', function () {
    cy.contains('Login').click()
    cy.get('#username').type('root')
    cy.get('#password').type('sekretpw')
    cy.get('#login-button').click()
    
    //expected result,  ensures that the login was successful.
    cy.contains('Matti Luukkainen logged in')
  })  
})


describe('Blog app create blog', function() {

  beforeEach(function() {
    cy.visit('http://localhost:3000')
    cy.contains('Blogs')
    cy.contains('Login').click()
    cy.get('#username').type('root')
    cy.get('#password').type('sekretpw')
    cy.get('#login-button').click()
  })
  it('a new note can be created', function() {
    cy.contains('New Blog').click()
    cy.get('#title').type('a blog created by cypress')
    cy.get('#author').type('Matti Luukkainen root')
    cy.get('#url').type('www.test.com')
    cy.contains('Create').click()
    cy.contains('a blog created by cypress')
  })
})