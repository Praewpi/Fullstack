import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)


const StatisticLine = ({text, value})=>{
  return(
    <table>
      <tbody>
        <tr>
          <td>{text}</td>
          <td>{value}</td>
        </tr>
      </tbody>
    </table>
  )
}

const Statistics = (props) => {
  let all = props.good + props.neutral + props.bad;
  let average = (props.good - props.bad) / all;
  let positive = props.good / all * 100;
  if (props.allClicks.length === 0) {  
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return(
    <div>
      <StatisticLine text={"good"} value ={props.good} />
      <StatisticLine text={"neutral"} value ={props.neutral} />
      <StatisticLine text={"bad"} value ={props.bad} />
      <StatisticLine text="all" value ={all} />
      <StatisticLine text="average" value ={ average} />
      <StatisticLine text="positive" value ={positive + ' ' + '%'}/>
    </div>
  )
}



const App = () => {
  // save clicks of each button to its own state
  const firstheaderName = 'give feedback'
  const secondheaderName = 'statistics'
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleGoodClick = () => {
    setAll(allClicks.concat('Good'))
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setAll(allClicks.concat('Neutral'))
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setAll(allClicks.concat('Bad'))
    setBad(bad + 1)
  }



  return (
    <div>
      <h1>{firstheaderName}</h1>
      <Button handleClick={handleGoodClick} text='good' />
      <Button handleClick={handleNeutralClick} text='neutral' />
      <Button handleClick={handleBadClick} text='bad' />
      
      <h1>{secondheaderName}</h1>
      <Statistics allClicks={allClicks} good={good} neutral={neutral} bad={bad} />
      
    </div>
  )
}

export default App