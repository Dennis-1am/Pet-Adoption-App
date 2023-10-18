const Pet = ({name, species, breed_primary, gender, status, size, age}) => {
    return (
        <div className="pet-card">
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

export default Pet;