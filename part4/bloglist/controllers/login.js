const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/users')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)
    //bcrypt.compare method is used to check if the password is correct

  //If the user is not found, or the password is incorrect 
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }
  //If the password is correct, a token is created with the method jwt.sign.
  //The token has been digitally signed to ensures that only parties who know the secret
  //can generate a valid token.

  // token expires in one hour
  const token = jwt.sign(
      userForToken,
      process.env.SECRET,
      { expiresIn: 60*60 }
    )

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter