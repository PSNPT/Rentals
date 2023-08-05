import PropertyCard from "../../components/PropertyCard";
import { useContext, useEffect, useState, } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import ListingCard from "../../components/ListingCard";
import ReservationCard from "../../components/ReservationCard";
import { APIContext } from "../../APIContext";

function ReservationManage() {
    var navigator = useNavigate();
    var token = localStorage.getItem('access');
    const st =         ["Pending", "Pending Cancellation", "Cancelled", "Denied", "Terminated", "Approved", "Expired", "Completed"]
    const [reservations, setReservations] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");

    
    const { auth, setAuth } = useContext(APIContext);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {

        if (!auth) {
            navigator('/401');
        }

        if (hasNext || page === 1) {

            const getData = async () => {
                
                var query = `http://localhost:8000/reservation/all/?page=${page}&`

                if(type !== ""){
                    query += `type=${type}&`
                }

                if(status !== ""){
                    query += `status=${status}&`
                }


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

                if(data.next === null){
                    setHasNext(false);
                }
                else{
                    setHasNext(true);
                }
                
                setReservations(data.results);
                setLoaded(true);
            }

            getData().catch(error => console.log(error));

        }

    }, [page, type, status]);

    return <div id="cont" class="flex flex-col items-center">

        <div class="font-semibold text-3xl py-8">Your Reservations</div>

        <div class="divider"></div>
        <div class="font-semibold text-3xl py-8">View As</div>
        <div class="flex flex-wrap justify-evenly w-full">
            <label class="btn btn-wide btn-accent m-2" onClick={() => {setType("host"); setPage(1); setHasNext(false)} }> Host </label>
            <label class="btn btn-wide btn-info m-2" onClick={() => {setType("client"); setPage(1); setHasNext(false)}}> Client </label>
            <label class="btn btn-wide btn-secondary m-2" onClick={() => {setType(""); setPage(1); setHasNext(false)}}> All </label>
        </div>

        <div class="divider"></div>
        <div class="font-semibold text-3xl py-8">Status</div>
        <div class="flex flex-wrap justify-evenly w-full">
            {st.map(s => (
                <label class="btn btn-neutral m-2" onClick={() => {setStatus(s); setPage(1); setHasNext(false)}}> {s} </label>
            ))}
            <label class="btn btn-neutral m-2" onClick={() => {setStatus(""); setPage(1); setHasNext(false)}}> ALL </label>
        </div>
        <div class="divider"></div>

        <div className="flex flex-wrap justify-evenly w-full">
            {reservations.length === 0 ?

                <div class="flex font-semibold text-5xl text-center py-4 justify-center"> Nothing here! </div>
                :

                reservations.map(res => (

                    <ReservationCard id={res.id} />

                ))

            }

        </div>

        <div class="flex flex-wrap py-4">
        {page > 1 ? <label class="btn btn-primary" onClick={() => {setPage(page - 1); setHasNext(true)}}> Previous </label> : <></>}
        {hasNext ? <label class="btn btn-primary" onClick={() => setPage(page + 1)}> Next </label> : <></>}

        </div>



    </div>


}

export default ReservationManage;
