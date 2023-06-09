const Header = (props) => {
  return (
    <div>
      <h1>{props.name}</h1>
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p> {props.part} {props.exercise}</p>
    </div>
  )
}
const Content = (props) => {
  console.log(`ContentProps: ${props.parts[0].name}`)
  return (
    <div>
      {props.parts.map((val, index) => (
        <Part part={val.name} exercise={val.exercises} key={index} />
      ))}
    </div>


    // <div>
    //   <Part part={props.parts[0].name} exercise={props.parts[0].exercises} />
    //   <Part part={props.parts[1].name} exercise={props.parts[1].exercises} />
    //   <Part part={props.parts[2].name} exercise={props.parts[2].exercises} />
    // </div>
  )
}

const Total = (props) => {
  // const totalExercises = props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises
  const totalExercises = props.parts.reduce((sum, val) => sum + val.exercises, 0)
  return (
    <div>
      <p>
        Number of exercises {totalExercises}
      </p>

    </div>
  )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }


  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App