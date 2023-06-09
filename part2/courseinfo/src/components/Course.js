const Course = ({ course }) => {
    return (
        <div>
            <Header heading={course.name} />
            <Content parts={course.parts} />
            <Total courseParts={course.parts} />
        </div>
    )
}
const Header = ({ heading }) => <h1>{heading}</h1>


// const Total = ({ sum }) => <p><b>total of exercises {sum}</b></p>

const Total = ({ courseParts }) => {

    const totalExercises = courseParts.reduce((sum, val) => sum + val.exercises, 0)
    return (
        <div>
            <p>
                <b>total exercises {totalExercises}</b>
            </p>
        </div>
    )
}


const Part = (props) => {
    //console.log(props)
    return (
        <p>
            {props.part} {props.exercise}
        </p>
    )
}


const Content = ({ parts }) => {
    //console.log(parts)
    return (
        <>
            {parts.map((val, index) => (
                <Part part={val.name} exercise={val.exercises} key={index} />
            ))}
        </>
    )
}


export default Course