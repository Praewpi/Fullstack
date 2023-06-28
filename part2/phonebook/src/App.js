import { useState } from 'react'


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
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [searchTerm, setSearchTerm] = useState('');

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