import PropTypes from 'prop-types'
const LoginForm = ({
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
    username,
    password
  }) => {
    LoginForm.propTypes = {
        handleSubmit: PropTypes.func.isRequired,
        handleUsernameChange: PropTypes.func.isRequired,
        handlePasswordChange: PropTypes.func.isRequired,
        username: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired
      }
    return (
      <div>
        <h2>Login</h2>
  
        <form onSubmit={handleSubmit}>
          <div>
            Username:
            <input
              type="text"
              value={username}
              name="Username"
              onChange={handleUsernameChange}
            />
          </div>
          <div>
            Password:
            <input
              type="password"
              value={password}
              name="Password"
              onChange={handlePasswordChange}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    )
  }
  
  export default LoginForm