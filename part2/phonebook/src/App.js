import React, { useState, useEffect } from 'react'
import personService from './services/personService'

// for search block display
const Filter = ({ searchTerm, handleSearch }) => {
  return (
    <div>
      filter shown with: <input value={searchTerm} onChange={handleSearch} />
    </div>
  )
}

// for display all people with delete button
const PersonsDisplay = ({ persons , handleDelete}) => {
  return (
    <div>
      {persons.map(person => (
        <div key={person.id}>
          {person.name}  {person.number}
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </div>
      ))}
    </div>
  )
}
// for display submit section
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
  )
}
// for sucess and error notification display
const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }
  if (type === 'success') {
    return (
      <div className='success'>
        {message}
      </div>
    )
  } else if (type === 'error') {
    return (
      <div className='error'>
        {message}
      </div>
    )
  }

  return null
}


// application main part
const App = () => {
  const [persons, setPersons ] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState('')
  const [notificationType, setNotificationType] = useState('')

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
    setNewPhone(event.target.value)
  }
  
  // handle search 
  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  // handle submit form 
  const handleSubmit = (event) => {
    event.preventDefault()

    // check if added person already exist
    if (persons.map(person => person.name).includes(newName)) { 
      const confirmUpdate = window.confirm(
        `${newName} is already added to the phonebook. Replace the old number with a new one?`
      )
      if (confirmUpdate) {
      const person = persons.find((person) => person.name === newName)
      const updatedPerson = { ...person, number: newPhone }
      const id = person.id

      personService
        .update(id, updatedPerson)
        .then((response) => {
          setPersons(
            persons.map((person) =>
                person.id !== id ? person : response)
          )
          setNotification(`Updated ${person.name}`)
          setNotificationType('success')
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch((error) => {
          console.log("error", error)
          setPersons(persons.filter(person => person.id !== id))
          setNotification(`Information of '${person.name}' has already been removed from server`)
          setNotificationType('error')
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        setNewName('')
        setNewPhone('')
        return
    }

    } else {
      const newPerson = { name: newName, number: newPhone, id: persons.length + 1 }
      // add person to server
      personService
      .create(newPerson)
      .then(response => {
        console.log(response)
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewPhone('')
        setNotification(`Added ${newName}`)
        setNotificationType('success')
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
      .catch(error => {
        console.log("contact could not be added!")
        console.log(error.response.data.error)
        setNotification(`contact could not be added: ${error.response.data.error}'`)
        setNotificationType('error')
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
    }
  }

  // for filter with case sensitive
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

 // handle delete person 
 const handleDelete = personId => {
    const person = persons.find(person => person.id === personId)
    if (person) {
      const confirmDeletion = window.confirm(`Delete ${person.name} ?`)
      if (confirmDeletion) {
        personService
          .remove(person.id)
          .then(() => {
            setPersons(persons.filter(p => p.id !== person.id))
          })
          .catch(error => {
            console.log('error', error)
            alert('Failed to delete the person from the server.')
          })
      }
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notificationType} />
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
      <PersonsDisplay persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  )
}

export default App