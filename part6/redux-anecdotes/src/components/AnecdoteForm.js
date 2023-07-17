import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = (props) => {
  const dispatch = useDispatch()

  // Function to handle adding a new anecdote
  const addAnecdote = (event) => {
    event.preventDefault()
    // Get the content of the anecdote from the input field
    const content = event.target.anecdote.value
    // Clear the input field
    event.target.anecdote.value = ''
    // Dispatch the createAnecdote action with the content
    dispatch(createAnecdote(content))
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name="anecdote" /></div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default AnecdoteForm