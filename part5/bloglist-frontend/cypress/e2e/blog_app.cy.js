
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
    cy.get('#username').type('typeusername')
    cy.get('#password').type('typepw')
    cy.get('#login-button').click()

    //expected result,  ensures that the login was successful.
    cy.contains('Matti Luukkainen logged in')
  })  
})