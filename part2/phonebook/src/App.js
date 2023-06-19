import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')

  // for handle new added name
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
 // for handle new added phone number with name
  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  };


  const handleSubmit = (event) => {
    event.preventDefault()

    const nameExists = persons.some(person => person.name === newName)

    if (nameExists) {
      alert(`${newName} is already added to the phonebook`)
    } else {
      const newPerson = { name: newName, number: newPhone }
      setPersons(persons.concat(newPerson))
      setNewName('')
      setNewPhone('');
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <div>
           filter shown with: <input></input>
      </div>
      <h2>add a new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newPhone} onChange={handlePhoneChange} />
          </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
     
      <h2>Numbers</h2>
      {/* Display the numbers */}
      {persons.map(person => (
        <div key={person.name}>{person.name} {person.number} </div>
        
      ))}
    </div>
  )
}

export default App