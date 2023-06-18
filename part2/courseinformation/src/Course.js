const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p>Total of exercises {sum}</p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </>
);


const Course = ({ course }) =>
  <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
     <b> <Total sum={course.parts.reduce((total, part) => total + part.exercises, 0)} /> </b>
  </div>

export default Course