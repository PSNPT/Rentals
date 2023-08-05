import ListingCard from '../../components/ListingCard';
import { useContext, useEffect, useState, } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { APIContext } from "../../APIContext";

function Reservation() {
    var navigator = useNavigate();
    const { id } = useParams();
    var token = localStorage.getItem('access');
    const uid = localStorage.getItem('id');
    const { auth, setAuth } = useContext(APIContext);
    const [loaded, setLoaded] = useState(false);

    const [reservation, setReservation] = useState(id);
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [host, setHost] = useState("");
    const [client, setClient] = useState("");
    const [status, setStatus] = useState("");
    const [listing, setListing] = useState("");

    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);

    const [avatar, setAvatar] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {

        if (!auth) {
            navigator('/401');
        }

        const getData = async () => {

            var response = await fetch(`http://localhost:8000/reservation/${id}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            if (response.status !== 200) {
                navigator('/404')
            }

            var data = await response.json();

            setListing(data.listing);
            setStart(data.start);
            setEnd(data.end);
            setClient(data.client);
            setHost(data.host);
            setStatus(data.status)

            if (String(uid) !== String(data.client) && String(uid) !== String(data.host)) {
                navigator('/401')
            }


            var query = `http://localhost:8000/accounts/${data.client}/`;
            response = await fetch(query);
            if (response.status !== 200) {
                navigator('/404')
            }

            data = await response.json();
            setAvatar(data.avatar);
            setFirstName(data.first_name);
            setLastName(data.last_name);
            setEmail(data.email);


            setLoaded(true);
        }

        getData().catch(error => console.log(error));

    }, []);

    useEffect(() => {
        
        if ((hasNext || page === 1) && client !== "" && (String(host) === String(uid))) {
            const getComments = async () => {
                var query = `http://localhost:8000/accounts/${client}/comments/?page=${page}`;
                var response = await fetch(query, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                })

                if (response.status !== 200) {
                    navigator('/404')
                }
                var data = await response.json();

                if (data.next === null) {
                    setHasNext(false);
                }
                else {
                    setHasNext(true);
                }

                setComments(data.results)
            }

            getComments().catch(error => console.log(error));
        }

    }, [page, client, host])

    const approve = async () => {


        const response = await fetch(`http://localhost:8000/reservation/${id}/approve/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })


        const data = await response.json();

        setStatus(data.status);

    }

    const deny = async () => {

        const response = await fetch(`http://localhost:8000/reservation/${id}/cancel/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        const data = await response.json();

        setStatus(data.status);

    }


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

                {(String(client) === String(uid) && auth && (status === 'Completed' || status === 'Terminated')) ?
                    <div class="flex justify-center">
                        <div class="flex justify-evenly flex-wrap">
                            <Link to={`/reservation/${id}/comment`} className="w-40 btn btn-accent hover:ring-2 ring-error">
                                Comment
                            </Link>
                        </div>
                    </div>
                    :
                    <></>}

                {(String(host) === String(uid) && auth && (status === 'Completed')) ?
                    <div class="flex justify-center">
                        <div class="flex justify-evenly flex-wrap">
                            <Link to={`/reservation/${id}/comment`} className="w-40 btn btn-accent hover:ring-2 ring-error">
                                Comment
                            </Link>
                        </div>
                    </div>
                    :
                    <></>}

            </div>

        </div>


        {(String(host) === String(uid) && auth)
            ?
            <>
                <div class="divider"></div>

                <div class=" grid grid-cols-1 sm:grid-cols-2">


                    <div class="flex flex-col items-center">

                        <h1 class="text-center font-semibold text-3xl py-4"> Your <a href="Profile.html"
                            class="text-secondary hover:text-secondary-focus text-3xl">Client</a></h1>
                        <div class="card w-80 bg-base-100 shadow-xl ring-2 ring-secondary ">
                            <figure>
                                <div class="avatar p-4">
                                    <div class="w-60 rounded-full ring-2 ring-neutral">
                                        {avatar === "" ? <></> : <img src={avatar} alt="None" />}
                                    </div>
                                </div>
                            </figure>
                            <div class="divider"></div>
                            <div class="card-body">
                                <div>
                                    <h1 class="text-5xl py-3 font-semibold text-center">
                                        {firstName}
                                    </h1>
                                    <h1 class="text-5xl py-3 font-semibold text-center">
                                        {lastName}
                                    </h1>
                                    <p class="py-3 text-center">
                                        {email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col p-4 ">

                        <h1 class="text-center text-3xl font-semibold pb-4">Reviews</h1>


                        {comments.length === 0 ?

                            <div class="flex font-semibold text-5xl text-center py-4 justify-center"> Nothing here! </div>
                            :

                            comments.map(c => (
                                <div class="chat chat-start" key={c.id}>

                                    <div class="chat-image avatar">
                                        <div class="w-24 rounded-full">
                                            <img src={"/anon.png"} alt="No avatar" />
                                        </div>
                                    </div>

                                    <div class="chat-bubble w-full">On {c.timetag}<br></br> Some host commented: <br></br> {c.description}

                                        {c.rating > 0 ?
                                            <>
                                                <div class="divider m-2 h-1 bg-accent"></div>

                                                <div id="stars" class="flex justify-center">
                                                    {Array(c.rating).fill(0).map(temp => (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                            stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </>
                                            :
                                            <></>
                                        }

                                    </div>
                                </div>

                            ))

                        }

                    </div>

                </div>

                <div class="flex flex-wrap py-4">
                    {page > 1 ? <label class="btn btn-primary" onClick={() => { setPage(page - 1); setHasNext(true) }}> Previous </label> : <></>}
                    {hasNext ? <label class="btn btn-primary" onClick={() => setPage(page + 1)}> Next </label> : <></>}

                </div>

            </>

            : <></>}
        <div class="divider"></div>

        {(String(host) === String(uid) && auth && (status === 'Pending' || status === 'Pending Cancellation')) ?
            <div class="flex justify-center">
                <div class="flex justify-evenly flex-wrap">
                    <Link to="/reservation/manage" className="w-40 py-20 my-20 btn btn-success hover:ring-2 ring-success mx-4" onClick={() => approve()}>
                        APPROVE
                    </Link>
                    <Link to="/reservation/manage" className="w-40 py-20 my-20 btn btn-error hover:ring-2 ring-error mx-4" onClick={() => deny()}>
                        DENY
                    </Link>
                </div>
            </div>
            :
            <>
            </>}

        {(String(client) === String(uid) && auth && (status === 'Pending' || status === 'Approved')) ?
            <div class="flex justify-center">
                <div class="flex justify-evenly flex-wrap">
                    <Link to="/reservation/manage" className="w-40 py-20 my-20 btn btn-error hover:ring-2 ring-error" onClick={() => deny()}>
                        CANCEL
                    </Link>
                </div>
            </div>
            :
            <>
            </>}


        {(String(host) === String(uid) && auth && (status === 'Approved')) ?
            <div class="flex justify-center">
                <div class="flex justify-evenly flex-wrap">
                    <Link to="/reservation/manage" className="w-40 py-20 my-20 btn btn-error hover:ring-2 ring-error" onClick={() => deny()}>
                        CANCEL
                    </Link>
                </div>
            </div>
            :
            <>
            </>}

    </>



}

export default Reservation;
