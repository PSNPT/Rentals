import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState, } from "react";
import { APIContext } from "../../APIContext";
function PropertyEdit() {
    
    const { auth, setAuth } = useContext(APIContext);

    const { id } = useParams();
    var navigator = useNavigate();
    const uid = localStorage.getItem('id');
    var token = localStorage.getItem('access');

    const [nameError, setNameError] = useState("");
    const [locationError, setLocationError] = useState("");
    const [bedError, setBedError] = useState("");
    const [bathError, setBathError] = useState("");
    const [parkingError, setParkingError] = useState("");
    const [occupancyError, setOccupancyError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [imagesError, setImagesError] = useState("");
    const [generalError, setGeneralError] = useState("");

    const [modName, setmodName] = useState(false);
    const [modLocation, setmodLocation] = useState(false);
    const [modBed, setmodBed] = useState(false);
    const [modBath, setmodBath] = useState(false);
    const [modParking, setmodParking] = useState(false);
    const [modOccupancy, setmodOccupancy] = useState(false);
    const [modDescription, setmodDescription] = useState(false);
    const [modImages, setmodImages] = useState(false);

    var error_dict = {
        'name': setNameError,
        'location': setLocationError,
        'bed': setBedError,
        'bath': setBathError,
        'parking': setParkingError,
        'occupancy': setOccupancyError,
        'general': setGeneralError,
        'description': setDescriptionError,
        'images': setImagesError,
    }

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [accessibility, setAccessibility] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [bed, setBed] = useState(0);
    const [bath, setBath] = useState(0);
    const [parking, setParking] = useState(0);
    const [occupancy, setOccupancy] = useState(0);
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);

    const [accessibilityALL, setAccessibilityALL] = useState([]);
    const [amenitiesALL, setAmenitiesALL] = useState([]);

    const [loaded, setLoaded] = useState(false);

    const enableAmenity = (amenity) => {
        if (amenities.includes(amenity)) {

        }
        else {

            var temp = Array.from(amenities);
            temp.push(amenity);
            setAmenities(temp)

        }

    }


    const disableAmenity = (amenity) => {

        if (amenities.includes(amenity)) {
            var temp = Array.from(amenities);
            var index = temp.indexOf(amenity);
            temp.splice(index, 1);
            setAmenities(temp)
        }
        else {

        }

    }

    const enableAccessibility = (ac) => {
        if (accessibility.includes(ac)) {

        }
        else {

            var temp = Array.from(accessibility);
            temp.push(ac);
            setAccessibility(temp)

        }

    }
    const disableAccessibility = (ac) => {

        if (accessibility.includes(ac)) {
            var temp = Array.from(accessibility);
            var index = temp.indexOf(ac);
            temp.splice(index, 1);
            setAccessibility(temp)
        }
        else {

        }

    }
    const handleNameChange = (event) => {
        setName(event.target.value);
        setmodName(true);
    };
    const handleLocationChange = (event) => {
        setLocation(event.target.value);
        setmodLocation(true);
    };
    const handleBedChange = (event) => {
        setBed(event.target.value);
        setmodBed(true);
    };
    const handleBathChange = (event) => {
        setBath(event.target.value);
        setmodBath(true);
    };
    const handleParkingChange = (event) => {
        setParking(event.target.value);
        setmodParking(true);
    };
    const handleOccupancyChange = (event) => {
        setOccupancy(event.target.value);
        setmodOccupancy(true);
    };
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
        setmodDescription(true);
    };
    const handleImagesChange = (event) => {
        setImages(event.target.files);
        setmodImages(true);
    };

    useEffect(() => {

        if(!auth){
            navigator('/401');
        }

        const getData = async () => {

            var response = await fetch(`http://localhost:8000/property/${id}/`);
            var data = await response.json();

            setName(data.name);
            setLocation(data.location);
            setAccessibility(data.accessibility);
            setAmenities(data.amenities);
            setBed(data.bed);
            setBath(data.bath);
            setParking(data.parking);
            setOccupancy(data.occupancy);
            setDescription(data.description);
            setImages(data.image_set);

            if(!data.is_active){
                navigator('/404');
            }

            if(uid === data.host){
                navigator('/401');
            }

            var query = "http://localhost:8000/property/images/?"
            for (var idn of data.image_set) {
                query += `identifiers=${idn}&`
            }
            response = await fetch(query);
            data = await response.json();
            setImages(data);

            query = "http://localhost:8000/property/accessibility/"
            response = await fetch(query);
            data = await response.json();
            setAccessibilityALL(data);


            query = "http://localhost:8000/property/amenities/"
            response = await fetch(query);
            data = await response.json();
            setAmenitiesALL(data);

        }

        getData().catch(error => console.log(error));

    }, []);

    const editProperty = () => {

        for (var key in error_dict){
            const setError = error_dict[key];
            setError("");
        }

        

        const formData = new FormData();    

        if(!modName){
            // Do nothing
        }
        else{
            formData.append('name', name);
        }

        if(!modLocation){
            // Do nothing
        }
        else{
            formData.append('location', location);
        }

        if(!modBed){
            // Do nothing
        }
        else{
            formData.append('bed', bed);
        }

        if(!modBath){
            // Do nothing
        }
        else{
            formData.append('bath', bath);
        }

        if(!modParking){
            // Do nothing
        }
        else{
            formData.append('parking', parking);
        }

        if(!modOccupancy){
            // Do nothing
        }
        else{
            formData.append('occupancy', occupancy); 
        }

        if(!modDescription){
            // Do nothing
        }
        else{
            formData.append('description', description); 
        }

        if(!modImages){
            // Do nothing
        }
        else{
            for(var i of images){
                formData.append('images', i); 
            }
        }

        for(var a of amenities){
            formData.append('amenities', a); 
        }

        for(a of accessibility){
            formData.append('accessibility', a); 
        }

        fetch(`http://localhost:8000/property/${id}/update/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        })
            .then(async response => {
                if (response.status === 200) {
                    navigator(`/property/${id}`);
                } else if (response.status === 400) {
                    
                    var errors = await response.json();
                    for (var key in errors){
                        const setError = error_dict[key];
                        setError(errors[key]);
                    }
    
                }
                else{
                    setGeneralError("Unable to commit edits")
                }
            })
            .catch(error => setGeneralError(error));

    }

    const deleteProperty = () => {

        fetch(`http://localhost:8000/property/${id}/destroy/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(async response => {
                if (response.status === 204) {
                    navigator(`/property/manage`);
                } else {
                    
                    var error = await response.json();

                    setGeneralError(error)
    
                }
            })
            .catch(error => setGeneralError(error));

    }


    return <div id="cont" class="flex flex-col">

        <div class="flex flex-col items-center m-4">         
        <h1 class="text-center text-3xl font-semibold m-4">Name</h1>
        <input type="text" placeholder={name}  className="input input-bordered w-3/4 text-center" onChange={handleNameChange}/>
        {nameError === "" ? <></> : <label className="label text-error" >{nameError}</label>}
        </div>

        <div class="flex flex-col items-center m-4">         
        <h1 class="text-center text-3xl font-semibold m-4">Location</h1>
        <input type="text" placeholder={location}  className="input input-bordered w-3/4 text-center" onChange={handleLocationChange}/>
        {locationError === "" ? <></> : <label className="label text-error" >{locationError}</label>}
        </div>


        <div class="flex flex-col align-center ">
            <div class="flex justify-center ">

                <div class="animate-pulse sm:w-[30rem] sm:h-[30rem] w-[20rem] h-[20rem] md:w-[40rem] md:h-[40rem] justify-center ">
                    <img src="/camera.jpg" alt="No value provided" class=" sm:w-[30rem] sm:h-[30rem] w-[20rem] h-[20rem] md:w-[40rem] md:h-[40rem] rounded-box border-neutral-focus border-2 shadow-xl" />
                </div>


            </div>
            <div class="flex flex-col w-full justify-center items-center py-8">
                <input type="file" className="file-input file-input-bordered w-[20rem]" onChange={handleImagesChange} multiple />
                {imagesError === "" ? <></> : <label className="label text-error" >{imagesError}</label>}
            </div>
        </div>

        <div class="divider"></div>

        <div class="grid grid-cols-1">

            <div class="flex flex-col items-center lg:justify-center">
                <h1 class="text-center font-semibold text-3xl pt-4"> Description </h1>
                <textarea class="textarea textarea-bordered w-3/4 h-40 my-4" placeholder={description} onChange={handleDescriptionChange}>
                </textarea>
                {descriptionError === "" ? <></> : <label className="label text-error" >{descriptionError}</label>}
            </div>

        </div>

        <div class="divider"></div>

        <div class="flex flex-col items-center">
            <h1 class="text-center text-3xl font-semibold m-4">Accessibility</h1>
            <div class=" flex flex-wrap justify-evenly w-full">

                {accessibilityALL.map(token => (
                    <div key={token.id} class="flex flex-col items-center m-4">
                        {accessibility.includes(token.id) ? <div onClick={() => disableAccessibility(token.id)}>
                            <img src={token.icon} alt="No value provided" class="m-4 rounded-full w-24 h-24 rounded-box border-success border-2 shadow-xl" />
                            <h1 class="text-center text-success font-semibold text-3xl m-4" >{token.name}</h1>
                            </div> :
                            <div onClick={() => enableAccessibility(token.id)}>
                                
                                <img src={token.icon} alt="No value provided" class="m-4 rounded-full w-24 h-24 rounded-box border-error border-2 shadow-xl" />
                                <h1 class="text-center text-error font-semibold text-3xl m-4" onClick={() => enableAccessibility(token.id)} >{token.name}</h1>
                                </div>}

                    </div>
                ))}

            </div>
        </div>

        <div class="divider"></div>


        <div class="stats stats-vertical xl:stats-horizontal">

            <div class="stat place-items-center">
                <div class="font-semibold text-3xl t ">Beds</div>
                <div class="stat-value">
                    <input type="number" placeholder={bed} className="input input-bordered" onChange={handleBedChange} />
                </div>
                {bedError === "" ? <></> : <label className="label text-error" >{bedError}</label>}
            </div>

            <div class="stat place-items-center">
                <div class="font-semibold text-3xl">Bathrooms</div>
                <div class="stat-value">
                    <input type="number" placeholder={bath} className="input input-bordered" onChange={handleBathChange} />
                    
                </div>
                {bathError === "" ? <></> : <label className="label text-error" >{bathError}</label>}
            </div>

            <div class="stat place-items-center">
                <div class="font-semibold text-3xl">Parking</div>
                <div class="stat-value">
                    <input type="number" placeholder={parking} className="input input-bordered" onChange={handleParkingChange} />
                    
                </div>
                {parkingError === "" ? <></> : <label className="label text-error" >{parkingError}</label>}
            </div>

            <div class="stat place-items-center">
                <div class="font-semibold text-3xl">Occupancy</div>
                <div class="stat-value">
                    <input type="number" placeholder={occupancy} className="input input-bordered" onChange={handleOccupancyChange} />
                    
                </div>
                {occupancyError === "" ? <></> : <label className="label text-error" >{occupancyError}</label>}
            </div>

        </div>


        <div class="divider"></div>

        <div class="flex flex-col items-center">
            <h1 class="text-center text-3xl font-semibold m-4">Amenities</h1>

            <div class=" flex flex-wrap justify-evenly w-full">

                {amenitiesALL.map(token => (
                    <div key={token.id} class="flex flex-col items-center m-4">
                        {amenities.includes(token.id) ? <div onClick={() => disableAmenity(token.id)}>
                            
                            <img src={token.icon} alt="No value provided" class="m-4 rounded-full w-24 h-24 rounded-box border-success border-2 shadow-xl" />
                            <h1 class="text-center text-success font-semibold text-3xl m-4" >{token.name}</h1>
                            </div> :
                            <div onClick={() => enableAmenity(token.id)}>
                               
                                <img src={token.icon} alt="No value provided" class="m-4 rounded-full w-24 h-24 rounded-box border-error border-2 shadow-xl" />
                                <h1 class="text-center text-error font-semibold text-3xl m-4 " onClick={() => enableAmenity(token.id)}>{token.name}</h1>
                            </div>}

                    </div>
                ))}

            </div>

        </div>

        <div class="divider"></div>
        
        <div class="flex justify-center">
            <label className="w-40 py-20 my-20 btn btn-error" onClick={deleteProperty}>
                    DELETE
            </label>
        </div>


        <div className="flex">
            <Link to={`/property/${id}`} className="w-40 btn btn-error btn-outline fixed bottom-16 right-2/4 z-10" id="lb" >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
            </Link>
            <label className="w-40 btn btn-success btn-outline fixed bottom-16 left-2/4 z-10" id="rb" onClick={editProperty}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </label>
        </div>

    </div>;


}

export default PropertyEdit;
