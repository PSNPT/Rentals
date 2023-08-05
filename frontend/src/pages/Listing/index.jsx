import PropertyCard from '../../components/PropertyCard';
import { useContext, useEffect, useState,  } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { APIContext } from "../../APIContext";

function Listing() {

    const { id } = useParams();
    var token = localStorage.getItem('access');
    const uid = localStorage.getItem('id');

    const [listings, setListings] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const [property, setProperty] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [price, setPrice] = useState("");
    const [host, setHost] = useState("");
    const [active, setActive] = useState(false);

    const {auth, setAuth} = useContext(APIContext);

    useEffect(() => {

        const getData = async () => {

            fetch(`http://localhost:8000/listing/${id}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }).then(async response => {
                if (response.status === 200) {
                    const data = await response.json();

                    setProperty(data.property);
                    setStart(data.start);
                    setEnd(data.end);
                    setPrice(data.price);
                    setHost(data.host);
                    setActive(data.is_active);

                    setLoaded(true);
                } else {

                    navigator('/404')

                }
            })
            .catch(error => console.log(error));
        }

        getData().catch(error => console.log(error));

    }, []);


return <>
        <div id="cont" class="grid grid-cols-1 sm:grid-cols-2">

            <div class="flex flex-col justify-center items-center">
                <div class="stat-value py-4 "> Property </div>
                {property === "" ? <></> : <PropertyCard id={property} />}
            </div>

            <div class="flex flex-col justify-center items-center">
            <div class="stat-value py-4"> Information </div>

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
                        <div class="stat-title">Price Per Day (CAD)</div>
                        <div class="stat-value"> {price} </div>
                    </div>

                    <div class="stat">
                        <div class="stat-title">STATUS</div>
                        {active ? <div class="stat-value"> ACTIVE </div> : <div class="stat-value"> INACTIVE </div>}
                    </div>


                </div>

                {String(host) === String(uid) && auth? <></>:
                <div class="flex">
                    <Link class="btn btn-secondary btn-wide" to={`/reservation/${id}/create`}>
                        Reserve
                    </Link>
                </div>

                }
                
            </div>

        </div>


    {String(host) === String(uid) && auth && active?
        <div class="flex justify-center">
            <Link class="btn btn-secondary btn-wide btn-outline fixed bottom-8  z-10" to={`/listing/${id}/edit`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </Link>
        </div> :
        <> 
        </>}
</>





}

export default Listing;
