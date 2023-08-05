import ListingCard from '../../components/ListingCard';
import { useContext, useEffect, useState, } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { APIContext } from "../../APIContext";
import ReservationCard from '../../components/ReservationCard';

function ReservationComment() {
    var navigator = useNavigate();
    const { id } = useParams();
    var token = localStorage.getItem('access');
    const uid = localStorage.getItem('id');
    const { auth, setAuth } = useContext(APIContext);
    const [loaded, setLoaded] = useState(false);

    const [reservation, setReservation] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [host, setHost] = useState("");
    const [client, setClient] = useState("");
    const [status, setStatus] = useState("");
    const [listing, setListing] = useState("");

    const [descriptionError, setDescriptionError] = useState("");
    const [ratingError, setRatingError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [reservationError, setReservationError] = useState("");

    const [description, setDescription] = useState("");
    const [rating, setRating] = useState("");
    const [usercomment, setUsercomment] = useState(false);

    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);

    const [avatar, setAvatar] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };


    const handleRatingChange = (event) => {
        setRating(event.target.value);
    };

    var error_dict = {
        'rating': setRatingError,
        'description': setDescriptionError,
        'general': setGeneralError,
        'reservation': setReservationError,
    }

    const createReservationComment = () => {

        for (var key in error_dict) {

            const setError = error_dict[key];
            setError("");

        }



        const formData = new FormData();

        if (rating !== "") {
            formData.append('rating', rating)
        }

        formData.append('description', description);

        formData.append('reservation', reservation);


        var query = "";

        if (usercomment) {
            query = `http://localhost:8000/comment/user/`
        }
        else {
            query = `http://localhost:8000/comment/property/`
        }

        fetch(query, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        })
            .then(async response => {
                if (response.status === 201) {
                    var reservation = await response.json();
                    navigator(`/reservation/manage`);
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
                    setGeneralError("You cannot comment at this time");
                }
            })
            .catch(error => console.log(error));

    }

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

            setReservation(id);
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
        
        if ((hasNext || page === 1) && client !== "") {
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

    }, [page, client])

    return <>
        <div id="cont" class="grid grid-cols-1 sm:grid-cols-2">

            <div class="flex flex-col justify-center items-center">
                <div class="stat-value py-4 "> Reservation </div>
                {reservation === "" ? <></> : <ReservationCard id={reservation} />}
            </div>

            <div class="flex flex-col justify-center items-center">

                <div class="stat-value py-4"> Comment </div>

                {String(uid) === String(host) && auth ?
                    <>
                        <div class="stat-value py-4"> For </div>

                        
                        <div class="flex justify-center">
                            <div class="flex justify-evenly flex-wrap">
                                <label className="w-40 btn btn-accent hover:ring-2 ring-error my-4" onClick={() => setUsercomment(true)}>
                                    Client
                                </label>
                            </div>
                        </div>

                        <div class="flex justify-center">
                            <div class="flex justify-evenly flex-wrap">
                                <label className="w-40 btn btn-accent hover:ring-2 ring-error  my-4" onClick={() => setUsercomment(false)}>
                                    Reply
                                </label>
                            </div>
                        </div>

                    </>

                    : <></>}

                <div class="stats stats-vertical shadow-xl w-80 h-120 my-4 ring-2 ring-secondary">

                    {String(uid) === String(host) && auth?

                        <div class="stat">
                            <div class="stat-title">Commenting for</div>

                            <div class="stat-value"> {usercomment ? "Client" : "Reply"}</div>

                        </div>

                        : <></>}

                    <div class="stat">
                        <div class="stat-title">Description</div>

                        <textarea class="textarea textarea-bordered w-full h-40 my-4" placeholder="Description" onChange={handleDescriptionChange}>
                        </textarea>

                        {descriptionError === "" ? <></> : <label className="label text-error" >{descriptionError}</label>}
                    </div>

                    {usercomment && String(uid) === String(host) && auth?
                        <div class="stat">
                            <div class="stat-title">Rating</div>
                            <div class="stat-value">
                                <input type="number" placeholder="Rating" className="input input-bordered" onChange={handleRatingChange} />
                            </div>
                            {ratingError === "" ? <></> : <label className="label text-error" >{ratingError}</label>}
                        </div>

                        :
                        <></>
                    }

                    {String(uid) === String(client) && auth?
                        <div class="stat">
                            <div class="stat-title">Rating</div>
                            <div class="stat-value">
                                <input type="number" placeholder="Rating" className="input input-bordered" onChange={handleRatingChange} />
                            </div>
                            {ratingError === "" ? <></> : <label className="label text-error" >{ratingError}</label>}
                        </div>

                        :
                        <></>
                    }

                </div>

                {generalError === "" ? <></> : <label className="label text-error" >{generalError}</label>}

                {reservationError === "" ? <></> : <label className="label text-error" >{reservationError}</label>}

                <div class="flex justify-center">
                    <div class="flex justify-evenly flex-wrap">
                        <label className="w-40 btn btn-accent hover:ring-2 ring-error" onClick={() => createReservationComment()}>
                            Post
                        </label>
                    </div>
                </div>

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

    </>



}

export default ReservationComment;
