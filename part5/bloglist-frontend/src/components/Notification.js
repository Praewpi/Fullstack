import '../index.css'
// for error and success notification message
const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  if (type === 'success') {
    return (
      <div className='success'>
        {message}
      </div>
    )
  } else if (type === 'error') {
    return (
      <div className='error'>
        {message}
      </div>
    )
  }

  return null
}

export default Notification