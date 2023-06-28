import React, { useState, useEffect } from 'react'
import axios from 'axios'


const Filter = ({ searchTerm, handleSearch }) => {
  return (
    <div>
      filter shown with: <input value={searchTerm} onChange={handleSearch} />
    </div>
  );
};

const PersonsDisplay = ({ persons }) => {
  return (
    <div>
      {persons.map(person => (
        <div key={person.id}>
          {person.name} - {person.number}
        </div>
      ))}
    </div>
  );
};

const PersonForm = ({ newName, newPhone, handleNameChange, handlePhoneChange, handleSubmit }) => {
  return (
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
  );
};

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [searchTerm, setSearchTerm] = useState('');

// check axios progression of the execution.
  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])


  // for handle new added name
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
 // for handle new added phone number with name
  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  };
  
  // handle search 
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
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

  // for filter with case sensitive
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchTerm={searchTerm} handleSearch={handleSearch} />

      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        newPhone={newPhone}
        handleNameChange={handleNameChange}
        handlePhoneChange={handlePhoneChange}
        handleSubmit={handleSubmit}
      />
     
      <h2>Numbers</h2>
      <PersonsDisplay persons={filteredPersons} />
    </div>
  )
}

export default App