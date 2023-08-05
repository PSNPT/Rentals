import ListingCard from '../../components/ListingCard';
import { useContext, useEffect, useState, } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { APIContext } from "../../APIContext";

function ReservationCreate() {
    var navigator = useNavigate();
    const {id} = useParams()
    var token = localStorage.getItem('access');
    const uid = localStorage.getItem('id');

    const [listing, setListing] = useState(id);
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [price, setPrice] = useState(0);

    const { auth, setAuth } = useContext(APIContext);

    const [startError, setStartError] = useState("");
    const [endError, setEndError] = useState("");
    const [generalError, setGeneralError] = useState("");


    var error_dict = {
        'start': setStartError,
        'end': setEndError,
        'general': setGeneralError,
    }

    const handleStartChange = (event) => {

        setStart(event.target.value);

    };

    const handleEndChange = (event) => {

        setEnd(event.target.value);

    };

    const createReservation = () => {

        for (var key in error_dict) {

            const setError = error_dict[key];
            setError("");

        }



        const formData = new FormData();
        formData.append('listing', listing)

        formData.append('start', start);

        formData.append('end', end);


        fetch(`http://localhost:8000/reservation/create/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        })
            .then(async response => {
                if (response.status === 201) {
                    var reservation = await response.json();
                    navigator(`/reservation/${reservation.id}`);
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
                else {
                    setGeneralError(errors[key]);
                }
            })
            .catch(error => console.log(error));

    }

    useEffect(() => {

        if (!auth) {
            navigator('/401');
        }

        const getData = async () => {

            const response = await fetch(`http://localhost:8000/listing/${listing}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            if(response.status !== 200){
                navigator('/404')
            }

            const data = await response.json();

            
            setPrice(data.price);
        }

        getData().catch(error => console.log(error));
    }, [])

    return <>
        <div id="cont" class="grid grid-cols-1 sm:grid-cols-2">

            <div class="flex flex-col justify-center items-center">
                <div class="stat-value py-4 "> Listing </div>
                {listing === "" ? <></> : <ListingCard id={listing} />}
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
                        <div class="stat-title">Total (CAD)</div>
                        <p class=" font-semibold text-base w-40" > {price * parseInt((new Date(end) - new Date(start))) / (24 * 60 * 60 * 1000)} </p> 
                    </div>

                </div>
                {generalError === "" ? <></> : <label className="label text-error" >{generalError}</label>}
            </div>

        </div>

        <div className="flex">
            <Link to={`/listing/${listing}`} className="w-40 btn btn-error btn-outline fixed bottom-16 right-2/4 z-10" id="lb" >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
            </Link>
            <label className="w-40 btn btn-success btn-outline fixed bottom-16 left-2/4 z-10" id="rb" onClick={createReservation}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </label>
        </div>
        
    </>

}

export default ReservationCreate;
