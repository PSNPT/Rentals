import PropertyCard from '../../components/PropertyCard';
import { useContext, useEffect, useState,  } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { APIContext } from "../../APIContext";

function ListingCreate() {
    var navigator = useNavigate();
    const {id} = useParams()
    var token = localStorage.getItem('access');
    const uid = localStorage.getItem('id');

    const [property, setProperty] = useState(id);
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [price, setPrice] = useState("");
    const [host, setHost] = useState("");

    const [startError, setStartError] = useState("");
    const [endError, setEndError] = useState("");
    const [priceError, setPriceError] = useState("");
    const [generalError, setGeneralError] = useState("");

    const {auth, setAuth} = useContext(APIContext);

    var error_dict = {
        'start': setStartError,
        'end': setEndError,
        'price': setPriceError,
        'general': setGeneralError,
    }

    const handleStartChange = (event) => {

        setStart(event.target.value);

    };

    const handleEndChange = (event) => {

        setEnd(event.target.value);

    };

    const handlePriceChange = (event) => {

        setPrice(event.target.value);

    };

    const createListing = () => {

        for (var key in error_dict) {

            const setError = error_dict[key];
            setError("");

        }



        const formData = new FormData();
        formData.append('property', property)

        formData.append('start', start);

        formData.append('end', end);

        formData.append('price', price);


        fetch(`http://localhost:8000/listing/create/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        })
            .then(async response => {
                if (response.status === 201) {
                    var listing = await response.json();
                    navigator(`/listing/manage`);
                } else if (response.status === 400) {

                    var errors = await response.json();
                    for (var key in errors) {
                        if (key in error_dict) {
                            const setError = error_dict[key];
                            setError(errors[key]);
                        }
                        else {
                            setGeneralError(errors[key]);
                        }
                    }

                }
                else{
                    setGeneralError("Invalid criteria for listing");
                }
            })
            .catch(error => console.log(error));

    }

    useEffect(() => {

        if(!auth){
            navigator('/401');
        }
        
    }, [])


    return <>
        <div id="cont" class="grid grid-cols-1 sm:grid-cols-2">

            <div class="flex flex-col justify-center items-center">
                <div class="stat-value py-4 "> Property </div>
                <PropertyCard id={id} />
            </div>

            <div class="flex flex-col justify-center items-center">
                <div class="stat-value py-4"> Information </div>

                <div class="stats stats-vertical shadow-xl w-80 h-120 my-4 ring-2 ring-secondary">

                    <div class="stat">
                        <div class="stat-title">Start Date</div>
                        <input type="text"
                            class="input input-bordered font-semibold text-base w-40" onChange={handleStartChange} onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")} />
                        {startError === "" ? <></> : <label className="label text-error" >{startError}</label>}
                    </div>

                    <div class="stat">
                        <div class="stat-title">End Date</div>
                        <input type="text" 
                            class="input input-bordered font-semibold text-base w-40" onChange={handleEndChange} onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")} />
                        {endError === "" ? <></> : <label className="label text-error" >{endError}</label>}
                    </div>

                    <div class="stat">
                        <div class="stat-title">Price Per Day (CAD)</div>
                        <input type="number" 
                            class="input input-bordered font-semibold text-base w-40" onChange={handlePriceChange} />
                        {priceError === "" ? <></> : <label className="label text-error" >{priceError}</label>}
                    </div>

                </div>
                {generalError === "" ? <></> : <label className="label text-error" >{generalError}</label>}
            </div>

        </div>

        <div className="flex">
            <Link to={`/listing/manage`} className="w-40 btn btn-error btn-outline fixed bottom-16 right-2/4 z-10" id="lb" >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
            </Link>
            <label className="w-40 btn btn-success btn-outline fixed bottom-16 left-2/4 z-10" id="rb" onClick={createListing}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </label>
        </div>
    </>

}

export default ListingCreate;
