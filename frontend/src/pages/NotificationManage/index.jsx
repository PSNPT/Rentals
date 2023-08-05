import PropertyCard from "../../components/PropertyCard";
import { useContext, useEffect, useState, } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import ListingCard from "../../components/ListingCard";
import ReservationCard from "../../components/ReservationCard";
import { APIContext } from "../../APIContext";

function NotificationManage() {

    var token = localStorage.getItem('access');
    var navigator = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    
    const [loaded, setLoaded] = useState(false);

    const { auth, setAuth } = useContext(APIContext);

    
    const readnot = async (nid, rid) => {

        const response = await fetch(`http://localhost:8000/notification/${nid}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        if(response.status !== 200){
            navigator('/404')
        }

        navigator(`/reservation/${rid}`)


    }


    useEffect(() => {

        if (hasNext || page === 1) {

            const getData = async () => {
                
                var query = `http://localhost:8000/notification/all/?page=${page}&`

                const response = await fetch(query, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                })

                if(response.status !== 200){
                    navigator('/404')
                }

                const data = await response.json();
                setHasNext(data.next)
                setNotifications(data.results);
                setLoaded(true);
            }

            getData().catch(error => console.log(error));

        }

    }, [page]);

    useEffect(() => {

        if(!auth){
            navigator('/401');
        }
        
    }, [])


    return <div id="cont" class="flex flex-col items-center">

        <div class="font-semibold text-3xl py-8">Your Notifications</div>


        <div className="flex flex-wrap justify-evenly w-full">
            {notifications.length === 0 ?

                <div class="flex font-semibold text-5xl text-center py-4 justify-center"> Nothing here! </div>
                :

                notifications.map(not => (

                    <div class="btn btn-outline flex w-3/4 font-semibold py-4 ring-2 hover:ring-4 ring-info rounded-box my-16" onClick={() => readnot(not.id, not.reservation)}>
                        <p>{not.description}</p>
                    </div>

                ))

            }

        </div>

        <div class="flex flex-wrap py-4">
        {page > 1 ? <label class="btn btn-primary mx-4" onClick={() => {setPage(page - 1); setHasNext(true)}}> Previous </label> : <></>}
        {hasNext ? <label class="btn btn-primary mx-4" onClick={() => setPage(page + 1)}> Next </label> : <></>}

        </div>



    </div>


}

export default NotificationManage;
