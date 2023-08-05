
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ListingCard from '../ListingCard';

const ReservationCard = ({ id }) => {

    var navigator = useNavigate();
    var token = localStorage.getItem('access');
    const uid = localStorage.getItem('id');

    const [listing, setListing] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [status, setStatus] = useState("");

    const [active, setActive] = useState(false);

    const [loaded, setLoaded] = useState(false);
    const [ready, setReady] = useState(false);


    useEffect(() => {

        const getData = async () => {

            const response = await fetch(`http://localhost:8000/reservation/${id}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            const data = await response.json();

            setListing(data.listing);
            setStart(data.start);
            setEnd(data.end);
            setStatus(data.status)
            setActive(data.is_active);
 
        }

        getData().catch(error => console.log(error));

    }, [id]);



    
    return    <Link to={`/reservation/${id}`} class="flex flex-col items-center">
            {listing === "" ? <></> : <ListingCard id={listing} />}
            <div class="stats stats-vertical shadow-xl w-80 h-120 my-4 ring-2 ring-secondary">

                    <div class="stat">
                        <div class="stat-title">Start Date</div>
                        <div class="stat-value"> {start} </div>
                    </div>

                    <div class="stat">
                        <div class="stat-title">End Date</div>
                        <div class="stat-value"> {end} </div>
                    </div>

                    <div class="stat">
                        <div class="stat-title">Status</div>
                        <div class="font-semibold"> {status} </div>
                    </div>

                </div>
        </Link>

}

export default ReservationCard;