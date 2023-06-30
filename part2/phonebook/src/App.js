import React, { useState, useEffect } from 'react'
import personService from './services/personService';


const Filter = ({ searchTerm, handleSearch }) => {
  return (
    <div>
      filter shown with: <input value={searchTerm} onChange={handleSearch} />
    </div>
  );
};

const PersonsDisplay = ({ persons, setPersons }) => {
    // handle delete person 
    const handleDelete = personId => {
      const person = persons.find(person => person.id === personId);
      if (person) {
        const confirmDeletion = window.confirm(`Delete ${person.name} ?`)
        if (confirmDeletion) {
          personService
            .remove(person.id)
            .then(() => {
              setPersons(persons.filter(p => p.id !== person.id))
            })
            .catch(error => {
              console.log('error', error);
              alert('Failed to delete the person from the server.')
            });
        }
      }
    };

  return (
    <div>
      {persons.map(person => (
        <div key={person.id}>
          {person.name}  {person.number}
          <button onClick={() => handleDelete(person.id)}>delete</button>
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
  const [persons, setPersons ] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [searchTerm, setSearchTerm] = useState('');

// check axios progression of the execution.
  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response)
      })
  }, [])

  // for handle new added name
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
 // for handle new added phone number with name
  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  }
  
  // handle search 
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  // handle submit form 
  const handleSubmit = (event) => {
    event.preventDefault()

    // check if added person already exist

    const existingPerson = persons.find((person) => person.name.toLowerCase() === newName.toLocaleLowerCase());

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${existingPerson.name} is already added to the phonebook. Replace the old number with a new one?`
      );
      if (confirmUpdate) {
      const updatedPerson = { ...existingPerson, number: newPhone };

      personService
        .update(existingPerson.id, updatedPerson)
        .then((response) => {
          setPersons(
            persons.map((person) =>
              person.id === existingPerson.id ? response : person)
        
          )
          setNewName('')
          setNewPhone('')
        })
        .catch((error) => {
          console.log("error", error);
          alert("Failed to update the person's number.");
        });
    }

    } else {
      const newPerson = { name: newName, number: newPhone }
 
      // add person to server
      personService
      .create(newPerson)
      .then(response => {
        console.log(response)
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewPhone('')
      })
      .catch(console.log("contact could not be added"))
    }

  }

  // for filter with case sensitive
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      <PersonsDisplay persons={filteredPersons} setPersons={setPersons} />
    </div>
  )
}

export default App