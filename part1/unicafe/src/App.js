import { useState } from 'react'




const App = () => {
  // save clicks of each button to its own state
  const firstheaderName = 'give feedback'
  const secondheaderName = 'statistics'
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>{firstheaderName}</h1>
      code here
      <h1>{secondheaderName}</h1>
    </div>
  )
}

export default App