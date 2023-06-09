import { useState, useEffect } from 'react'
import personsJSON from './services/persons'
import './index.css'




const Filter = ({ handleFilterInput }) => {
  return (
    <>
      filter shown with: <input onChange={handleFilterInput} />
    </>
  )
}

const Persons = ({ filteredPersons, deletePerson }) => {
  return (
    <>
      <ul>
        {filteredPersons.map(person =>
          <Person key={person.id} person={person} deletePerson={() => deletePerson(person.id)} />
        )}
      </ul>
    </>
  )
}

const Person = ({ person, deletePerson }) => {
  return (
    <li>
      {person.name} {person.number}
      <button onClick={deletePerson}>delete</button>
    </li>
  )
}

const PersonForm = ({ newName, handleNameInput, newNumber, handleNumberInput, addContact }) => {
  return (
    <>
      <form onSubmit={addContact}>
        <div>
          name: <input
            value={newName}
            onChange={handleNameInput} />
        </div>
        <div>
          number: <input
            value={newNumber}
            onChange={handleNumberInput} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>

      </form>
    </>
  )
}

const Notification = ({ message }) => {

  if (message === null) {
    return null
  }

  return (
    <div className='notification'>
      {message}
    </div>
  )
}

const ErrorMessage = ({ errorMessage }) => {
  if (errorMessage === null) {
    return null
  }

  return (
    <div className='error'>
      {errorMessage}
    </div>
  )
}





const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterString, setFilterString] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personsJSON
      .getAll()
      .then(response => {
        console.log('promise fullfilled')
        setPersons(response.data)
      })
  }, [])



  const addContact = (event) => {
    event.preventDefault()

    if (nameAlreadyPresent && (newNumber === '')) {
      alert(`${newName} is already in the phonebook`)
    }
    else if (nameAlreadyPresent) {
      if (window.confirm(`${newName} is already in the phonebook, replace the old number with a new one`)) {

        const contactToUpdate = persons.find(person => person.name === newName)
        const updatedContact = { ...contactToUpdate, number: newNumber }

        personsJSON
          .updatePerson(updatedContact.id, updatedContact)
          .then(response => {
            setPersons(persons.map(person => person.id !== updatedContact.id ? person : response.data))
          })
          .catch(error => {
            if (error.response && error.response.status === 404) {
              setErrorMessage(`${updatedContact.name} was already removed from the server`)
              setTimeout(() => {
                setErrorMessage(null)
              }, 3000)
              setPersons(persons.filter(p => p.id !== updatedContact.id))
            } else {
              setErrorMessage(`${updatedContact.number} is not a valid phone number`)
              setTimeout(() => {
                setErrorMessage(null)
              }, 3000)
            }
          })
      }
    } else {
      const highestID = persons.length > 0 ? Math.max(...persons.map(person => person.id)) : 0
      const personObject = {
        name: newName,
        number: newNumber,
        id: highestID + 1
      }
      // console.log(personObject)
      personsJSON
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
          setMessage(`added ${newName}`)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
        .catch(error => {
          //console.log(error.response.data.error)
          setErrorMessage(error.response.data.error)
          setTimeout(() => {
            setErrorMessage(null)
          }, 3000)
        })
    }
  }


  // filter Persons using filterString
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filterString.toLowerCase()))

  // check if name is already in phonebook
  const nameAlreadyPresent = persons.some(person => person.name === newName)


  // Eventhandlers
  const handleNameInput = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberInput = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterInput = (event) => {
    setFilterString(event.target.value)
  }

  const deletePersonNr = id => {
    const personToDelete = persons.find(person => person.id === id)

    if (window.confirm(`Do you realy want to delete ${personToDelete.name}?`)) {
      personsJSON
        .deleteOnePerson(personToDelete.id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })

    }

  }

  console.log(filteredPersons)
  console.log(`filtered: ${filterString}`)





  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <ErrorMessage errorMessage={errorMessage} />
      <Filter handleFilterInput={handleFilterInput} />
      <PersonForm
        newName={newName}
        handleNameInput={handleNameInput}
        newNumber={newNumber}
        handleNumberInput={handleNumberInput}
        addContact={addContact}
      />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} deletePerson={deletePersonNr} />

    </div>
  )
}

export default App