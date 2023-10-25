import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';

// create a function that shows additional information about the pet by switching to a new route and displaying the information there

const Pet = ({petId, name, species, breed_primary, gender, status, size, age}) => {

    const showMoreInfo = () => {
        window.location.href = `/petInfo/${petId}`
    }

    return (
        <div className="pet-card" onClick={showMoreInfo}>
            <h1>{name}</h1>
            <h2>{species}</h2>
            <h3>{breed_primary}</h3>
            <p>{gender}</p>
            <p>{age}</p>
            <p>{status}</p>
            <p>{size}</p>
        </div>
    );
};

Pet.propTypes = {
    name: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired,
    breed_primary: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    age: PropTypes.string.isRequired
};

export default Pet;