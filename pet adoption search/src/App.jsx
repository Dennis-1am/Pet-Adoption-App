import { useEffect, useState, useRef } from 'react'
import './App.css'
import Pet from './components/Pet'

const API_KEY = import.meta.env.VITE_API_KEY;
const API_SECRET = import.meta.env.VITE_API_SECRET;


function App() {

  const [access_token, setAccess_token] = useState('');
  const [pets, setPets] = useState([]);
  const [meanAge, setMeanAge] = useState(0);
  const [ageLabel, setAgeLabel] = useState('');
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);

  useEffect(() => { // this is a useeffect hook that will run at the start of the app and get the access token from the api

    const getToken = async () => {
      const response = await fetch('https://api.petfinder.com/v2/oauth2/token', {
        method: 'POST',
        body: `grant_type=client_credentials&client_id=${API_KEY}&client_secret=${API_SECRET}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      const data = await response.json()
      setAccess_token(data.access_token)
    }

    if (!access_token) {
      getToken().catch(console.error)
    }

  })

  useEffect(() => { // this is a useeffect hook that will run when the access token is set and get the pets from the api

    const getPets = async () => {
      const response = await fetch('https://api.petfinder.com/v2/animals?limit=100', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
      const data = await response.json()
      console.log(data.animals)
      setPets(data.animals)
    }

    if (access_token) {
      getPets().catch(console.error)
    }

  }, [access_token]) // this is the dependency array that will run the hook when the access token is set or changed

  useEffect(() => {
    const getMeanAge = () => {
      let totalAge = 0
      pets.forEach(pet => {
        if (pet.age === 'Baby') {
          totalAge += 1
        } else if (pet.age === 'Young') {
          totalAge += 2
        } else if (pet.age === 'Adult') {
          totalAge += 3
        }
      })

      let meanAge_val = totalAge / pets.length

      if (meanAge_val <= 1.5) {
        setAgeLabel('Baby')
      } else if (meanAge_val <= 2.25 && meanAge_val > 1.5) {
        setAgeLabel('Young')
      } else if (meanAge_val <= 3 && meanAge_val > 2.25) {
        setAgeLabel('Adult')
      }

      setMeanAge(meanAge_val)
    }

    const genderCounts = () => {
      let maleCount = 0
      let femaleCount = 0

      pets.forEach(pet => {
        if (pet.gender == 'Female') {
          femaleCount += 1
        } else if (pet.gender == 'Male') {
          maleCount += 1
        }
      })

      setFemaleCount(femaleCount)
      setMaleCount(maleCount)

    }

    genderCounts()
    getMeanAge()
  }, [pets])


  const extract_breed = (pet) => {
    if (pet.breeds.primary) {
      const json = JSON.parse(JSON.stringify(pet.breeds))
      return json['primary']
    }
    else {
      return ""
    }
  }

  return (
    <div className='App-container'>

      <div className='header'>
        <h1>Pet Adoption Search</h1>
        <input></input>
      </div>

      {
        // ternary operator to render the dashboard
        pets.length > 0 &&
        <div className='dashboard'>
          <div>
            <h2>Number of pets: {pets.length}</h2>
          </div>
          <div>
            <h2>Avg Age of Pets: {meanAge}</h2>
            <h2>{ageLabel}</h2>
          </div>
          <div>
            <h2>Female Count: {femaleCount} </h2>
            <h2>Male Count: {maleCount} </h2>
          </div>
        </div>
      }

      <div className='Pet-container'>
        {
          // ternary operator to render a list of the pets
          pets.length > 0 ? pets.map((pet) => {
            return <Pet
              key={pet.id}
              name={pet.name}
              species={pet.species}
              breed_primary={extract_breed(pet)}
              gender={pet.gender}
              age={pet.age}
              status={pet.status}
              size={pet.size}
            />
          }) : <p>Loading...</p>
        }
      </div>

    </div>
  )
}

export default App