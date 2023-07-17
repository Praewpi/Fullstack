const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

// Action types
const NEW_ANECDOTE = 'NEW_ANECDOTE'
const VOTE = 'VOTE'

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // Add a new anecdote to the state
    case NEW_ANECDOTE:
      return [...state, action.data]
    case VOTE:
      const id = action.data.id
      // Find the anecdote to vote for
      const anecdoteToVote = state.find(anecdote => anecdote.id === id)
      // Create a new anecdote object with incremented votes
      const changedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      }
      // Update the state with the changed anecdote
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : changedAnecdote 
      ).sort((a, b) => {
        return b.votes - a.votes
      })
    default:
      // Return the current state if the action type is unknown
      return state
  }
}

//Action creator-functions
// Action creator for creating a new anecdote
export const createAnecdote = (content) => {
  return {
    type: NEW_ANECDOTE,
    data: {
      content,
      id: getId(),
      votes: 0,
    }
  }
}

// Action creator for voting for an anecdote
export const voteFor = (id) => {
  return {
    type: VOTE,
    data: { id }
  }
}

export default reducer