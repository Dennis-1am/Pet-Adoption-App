import { useEffect, useState } from 'react'
import './App.css'
import Pet from './components/pet'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_SECRET = import.meta.env.VITE_API_SECRET;

function App() {

  const [access_token, setAccess_token] = useState('');
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]); // this is the state that will hold the filtered pets

  const [name, setName] = useState(''); // this is the state that will hold the name of the pet
  const [species, setSpecies] = useState(''); // this is the state that will hold the species of the pet
  const [breed_primary, setBreed_primary] = useState(''); // this is the state that will hold the primary breed of the pet

  const [meanAge, setMeanAge] = useState(0);
  const [ageLabel, setAgeLabel] = useState('');
  const [babyCount, setBabyCount] = useState(0);
  const [youngCount, setYoungCount] = useState(0);
  const [adultCount, setAdultCount] = useState(0);
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

  }, [access_token])

  useEffect(() => { // this is a useeffect hook that will run when the access token is set and get the pets from the api

    const getPets = async () => {
      const response = await fetch('https://api.petfinder.com/v2/animals?limit=20', {
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
      let bCount = 0
      let yCount = 0
      let aCount = 0
      // ternary operator to check if the filtered pets array is empty or not is empty then use the pets array

      filteredPets.length > 0 ? filteredPets.forEach(pet => {
        if (pet.age === 'Baby') {
          totalAge += 1
          bCount += 1
        } else if (pet.age === 'Young') {
          totalAge += 2
          yCount += 1
        } else if (pet.age === 'Adult') {
          totalAge += 3
          aCount += 1
        }
      }) : pets.forEach(pet => {
        if (pet.age === 'Baby') {
          totalAge += 1
          bCount += 1
        }
        else if (pet.age === 'Young') {
          totalAge += 2
          yCount += 1
        }
        else if (pet.age === 'Adult') {
          totalAge += 3
          aCount += 1
        }
      })

      let meanAge_val = totalAge / (filteredPets.length > 0 ? filteredPets.length : pets.length)

      if (meanAge_val <= 1.5) {
        setAgeLabel('Baby')
      } else if (meanAge_val <= 2.25 && meanAge_val > 1.5) {
        setAgeLabel('Young')
      } else if (meanAge_val <= 3 && meanAge_val > 2.25) {
        setAgeLabel('Adult')
      }

      setBabyCount(bCount)
      setYoungCount(yCount)
      setAdultCount(aCount)
      setMeanAge(meanAge_val)
    }

    const genderCounts = () => {
      let maleCount = 0
      let femaleCount = 0

      filteredPets.length > 0 ? filteredPets.forEach(pet => {
        if (pet.gender == 'Female') {
          femaleCount += 1
        } else if (pet.gender == 'Male') {
          maleCount += 1
        }
      }) : pets.forEach(pet => {
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

  }, [filteredPets, pets])

  useEffect(() => {

    const filterPets = () => {
      let filteredPets = pets.filter(pet => {
        if (pet.name.toLowerCase().includes(name.toLowerCase()) && pet.species.toLowerCase().includes(species.toLowerCase()) && pet.breeds.primary.toLowerCase().includes(breed_primary.toLowerCase())) {
          return pet
        }
      })
      setFilteredPets(filteredPets)
    }

    // if two of the three search fields are not empty then filter the pets array and set the filtered pets array
    if (name && species && breed_primary) {
      setFilteredPets(pets.filter(pet => {
        if (pet.name.toLowerCase().includes(name.toLowerCase()) && pet.species.toLowerCase().includes(species.toLowerCase()) && pet.breeds.primary.toLowerCase().includes(breed_primary.toLowerCase())) {
          return pet
        }
      }
      ))
    }


    filterPets()

  }, [name, species, breed_primary, pets])


  const extract_breed = (pet) => {
    if (pet.breeds.primary) {
      const json = JSON.parse(JSON.stringify(pet.breeds))
      return json['primary']
    }
    else {
      return ""
    }
  }

  const genderData = [
    { name: 'Male', uv: maleCount, pv: 2400, amt: 2400 },
    { name: 'Female', uv: femaleCount, pv: 1398, amt: 2210 }
  ];

  const ageData = [
    { name: 'Baby', uv: babyCount, pv: 2400, amt: 2400 },
    { name: 'Young', uv: youngCount, pv: 1398, amt: 2210 },
    { name: 'Adult', uv: adultCount, pv: 9800, amt: 2290 }
  ];
  
  return (
    // make the container wait 4 seconds before rendering the entire page to simulate a loading screen



    <div className='App-container'>
      {
        pets.length > 0 ? 
      <div className='header'>
        <h1>Pet Adoption Search</h1>
        <input className="search-bar" type="text" placeholder="Pet Name" onChange={event => { setName(event.target.value) }} />
        <input className="search-bar" type="text" placeholder="Pet Breed" onChange={event => { setBreed_primary(event.target.value) }} />
        <input className="search-bar" type="text" placeholder="Pet Species" onChange={event => { setSpecies(event.target.value) }} />
      </div> : <div className='loadingScreen'>
        <h1>Loading...</h1>
        <img src="src/assets/petfinder-logo.png"/>
      </div>
      }
      {
        // ternary operator to render the dashboard
        pets.length > 0 &&
        <div className='dashboard'>
          <div>
            <h2>Number of pets: {filteredPets.length > 0 ? filteredPets.length : pets.length}</h2>
            <img src="src/assets/petfinder-logo.png"/>
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

      {/* display the pet-container after the data has been loaded in  */}

      {
        pets.length > 0 &&
      <div className='Pet-container'>
        {filteredPets.length > 0 ? (
          filteredPets.map((pet) => (
            <Pet
              key={pet.id}
              petId={pet.id}
              name={pet.name}
              species={pet.species}
              breed_primary={extract_breed(pet)}
              gender={pet.gender}
              age={pet.age}
              status={pet.status}
              size={pet.size}
            />
          ))
        ) : (
          pets.map((pet) => (
            <Pet
              key={pet.id}
              id={pet.id}
              name={pet.name}
              species={pet.species}
              breed_primary={extract_breed(pet)}
              gender={pet.gender}
              age={pet.age}
              status={pet.status}
              size={pet.size}
            />
          ))
        )}
      </div>
}
    <div className='bar-chart'>
          <ResponsiveContainer width="50%" height={300}>
            <BarChart data={genderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="uv" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="50%" height={300}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="uv" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
      </div>

    </div>
  )
}

export default App

export { API_KEY, API_SECRET }
