import { useState } from "react";

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
)

const StatisticsLine = (props) => (
  <>
    <td>{props.text}</td>
    <td>{props.value} {props.unit}</td>
  </>
)

const Statistics = (props) => {
  console.log(props)

  if (props.goodVal === 0 && props.badVal === 0 && props.neutralVal === 0) {
    return (
      <h3>No feedback given</h3>
    )
  }

  return (
    <table>
      <tbody>
        <tr><StatisticsLine text="good" value={props.goodVal} /></tr>
        <tr><StatisticsLine text="bad" value={props.badVal} /></tr>
        <tr><StatisticsLine text="average" value={props.averageVal} /></tr>
        <tr><StatisticsLine text="positive" value={props.positiveVal} unit='%' /></tr>
      </tbody>
    </table>
  )
}



const App = () => {
  // save the clicks of each button to it's own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  const setGoodVal = () => {
    console.log('clicked good button', good)
    setGood(good + 1)
  }

  const setNeutralVal = () => setNeutral(neutral + 1)

  const setBadVal = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={setGoodVal} text="good" />
      <Button handleClick={setNeutralVal} text="neutral" />
      <Button handleClick={setBadVal} text="bad" />
      <h1>statistics</h1>
      <Statistics goodVal={good} neutralVal={neutral} badVal={bad} allVal={good + neutral + bad} averageVal={(good + (bad * -1)) / (good + bad + neutral)} positiveVal={good * 100 / (good + bad + neutral)} />

    </div>
  )
}

export default App