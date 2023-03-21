import { useState } from 'react'

const Button = ({ handleClick, text }) => ( <button onClick={handleClick}>{text} </button>)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [vote, setVote] = useState(Array(7).fill(0))
  const [mostvote, setMostvote] = useState(0)

  const random_num = ()=>Math.floor(Math.random() * 7) 
  const update= ()=>setSelected(random_num())

  const handleVoteClick = () => {
  const copy = [...vote]
    copy[selected]++
    setVote(copy)
    let maxValue = copy.indexOf(Math.max(...copy));
    setMostvote(maxValue)
  }

  return (
    
    <div>
      <h1>Anecdote of the day</h1>
        <p>
          {anecdotes[selected]} <br></br>
          has {vote[selected]} votes
        </p>
        <p>
          <Button handleClick = {update} text = 'next anecdote'/>
          <Button handleClick = {handleVoteClick} text = 'vote' />
        </p>

      <h1>Anecdote with the most votes</h1>
      <p>
      {anecdotes[mostvote]}<br></br>
      has {vote[mostvote]} votes 
      </p>

    </div>
  )
}

export default App