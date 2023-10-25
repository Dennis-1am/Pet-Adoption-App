import React, { useState , useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { API_KEY, API_SECRET } from '../App.jsx';
import '../cssStyles/PetInfoPage.css';


const PetInfoPage = () => {

    const [pet, setPet] = useState(''); // this is the state that will hold the pet information
    const [access_token, setAccess_token] = useState();
    const { id } = useParams();

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

      useEffect(() => {
        const getPet = async () => {
          try {
            const response = await fetch(`https://api.petfinder.com/v2/animals/${id}`, {
              headers: {
                Authorization: `Bearer ${access_token}`
              }
            });
            const data = await response.json();
            setPet(data.animal);
            console.log(data.animal);
          } catch (error) {
            console.error(error);
          }
        }
      
        if (access_token) {
          getPet();
        }
      }, [access_token, id]);
    
    return (
        <div className='petInfoBox'>
            {pet.photos && pet.photos.length > 0 ? (
                <img src={pet.photos[0].medium} alt={pet.name} />
            ) : null}
            <div className='petDescriptionBox'>
            <>
                {pet.name ? <h1>{pet.name}</h1> : null}
                {pet.breeds && pet.breeds.primary ? <p>{pet.breeds.primary}</p> : null}
                {pet.age ? <p>{pet.age}</p> : null}
                {pet.size ? <p>{pet.size}</p> : null}
                {pet.description ? <p>{pet.description}</p> : null}
            </>
            {pet.tags && pet.tags.length > 0 ? <p>{pet.tags.join(', ')}</p> : null}
            {pet.contact && pet.contact.address ? (
                <div className='petContactBox'>
                    <p>Address: </p>
                {pet.contact.address.address1 ? <p>{pet.contact.address.address1}</p> : null}
                {pet.contact.address.address2 ? <p>{pet.contact.address.address2}</p> : null}
                {pet.contact.address.city ? <p>{pet.contact.address.city}</p> : null}
                {pet.contact.address.state ? <p>{pet.contact.address.state}</p> : null}
                {pet.contact.address.postcode ? <p>{pet.contact.address.postcode}</p> : null}
                <p>Email: </p>
                {pet.contact && pet.contact.email ? <p>{pet.contact.email}</p> : null}
                </div>
            ) : null}
            </div>
            
        </div>
    );

}

export default PetInfoPage;