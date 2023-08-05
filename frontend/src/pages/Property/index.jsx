import { Link, resolvePath, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState, } from "react";
import InfiniteScroll from 'react-infinite-scroll-component'
import { APIContext } from "../../APIContext";
function Property() {
    const { auth, setAuth } = useContext(APIContext);

    const { id } = useParams();
    var navigator = useNavigate();
    const uid = localStorage.getItem('id');
    var token = localStorage.getItem('access');

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [accessibility, setAccessibility] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [bed, setBed] = useState(0);
    const [bath, setBath] = useState(0);
    const [parking, setParking] = useState(0);
    const [occupancy, setOccupancy] = useState(0);
    const [description, setDescription] = useState("");
    const [host, setHost] = useState(0);
    const [images, setImages] = useState([]);
    const [active, setActive] = useState(false);

    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(0);
    const [hasNext, setHasNext] = useState(true);

    const [avatar, setAvatar] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [accessibilityALL, setAccessibilityALL] = useState([]);
    const [amenitiesALL, setAmenitiesALL] = useState([]);

    const [loaded, setLoaded] = useState(false);

    const [commentALL, setcommentALL] = useState([])
    const [commentUsers, setcommentUsers] = useState({})


    const loadComments = () => {

        setPage(page + 1);
        let tp = page + 1;

        fetch(`http://localhost:8000/property/${id}/comments/?page=${tp}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async response => {
                if (response.status === 200) {
                    const data = await response.json();

                    if (data.next != null) {
                        setHasNext(true);
                    }
                    else {

                        setHasNext(false);
                    }

                    let temp = comments;

                    temp = temp.concat(data.results);

                    setComments(temp);

                } else {
                    navigator('/404');
                }
            })
            .catch(error => console.log(error))

    };

    useEffect(() => {

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
            setHost(data.host);

            setActive(data.is_active);
            const h = data.host;
            const i = data.image_set;
            
            var query = "http://localhost:8000/property/accessibility/"
            response = await fetch(query);

            if(response.status !== 200){
                navigator('/404')
            }

            data = await response.json();
            setAccessibilityALL(data);

            query = "http://localhost:8000/property/amenities/"
            response = await fetch(query);
            if(response.status !== 200){
                navigator('/404')
            }
            data = await response.json();
            setAmenitiesALL(data);

            query = "http://localhost:8000/property/images/?"
            for (var idn of i) {
                query += `identifiers=${idn}&`
            }
            response = await fetch(query);
            if(response.status !== 200){
                navigator('/404')
            }
            data = await response.json();
            setImages(data);

            query = `http://localhost:8000/accounts/${h}/`;
            response = await fetch(query);
            if(response.status !== 200){
                navigator('/404')
            }
            data = await response.json();
            setAvatar(data.avatar);
            setFirstName(data.first_name);
            setLastName(data.last_name);
            setEmail(data.email);

            query = `http://localhost:8000/property/${id}/commentsbatch/`;
            response = await fetch(query);
            if(response.status !== 200){
                navigator('/404')
            }
            data = await response.json();
            setcommentALL(data)

            var comments = data;
            var obj = {};
            for (var comment of comments) {
                if (String(comment.commenter) in obj) {
                    continue;
                }

                query = `http://localhost:8000/accounts/${comment.commenter}/`;

                
                response = await fetch(query);

                if(response.status !== 200){
                    navigator('/404')
                }
                
                data = await response.json();
                obj[comment.commenter] = data
            }
            setcommentUsers(obj);

        }

        getData().catch(error => console.log(error));

    }, []);


    const generateChain = (comment) => {

        if (Object.keys(commentUsers).length === 0) {
            return <></>;
        }

        var ret = []
        var curr = comment;
        while (curr != null) {

            var user = commentUsers[curr.commenter];


            ret.push(
                <div class="chat chat-start">

                    <div class="chat-image avatar">
                        <div class="w-24 rounded-full">
                            <img src={user.avatar} alt="No avatar" />
                        </div>
                    </div>
                    {curr.is_parent ?
                        <div class="chat-bubble w-full">On {curr.timetag}<br></br> {user.first_name} commented: <br></br> {curr.description}

                            {curr.rating > 0 ?
                                <>
                                    <div class="divider m-2 h-1 bg-accent"></div>

                                    <div id="stars" class="flex justify-center">
                                        {Array(curr.rating).fill(0).map(temp => (
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
                        :
                        <div class="chat-bubble w-full">On {curr.timetag}<br></br> {user.first_name} replied to above comment: <br></br> {curr.description}

                            {curr.rating > 0 && curr.is_parent?
                                <>
                                    <div class="divider m-2 h-1 bg-accent"></div>

                                    <div id="stars" class="flex justify-center">
                                        {Array(curr.rating).fill(0).map(temp => (
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
                    }


                </div>);

            var found = false;
            for (var c of commentALL) {

                if (c.id === curr.child) {
                    curr = c;
                    found = true;
                    break;
                }
            }

            if (!found) {
                break;
            }

        }

        return ret
    }

    const reactivate = async () => {

        const response = await fetch(`http://localhost:8000/property/${id}/reactivate/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        if(response.status !== 200){
            navigator('/404')
        }
        
        navigator(`/property/manage`)

    }

    return <div id="cont" class="flex flex-col">

        <div class="flex font-semibold text-5xl text-center py-4 justify-center"> {name} </div>
        <div class="flex font-semibold text-xl text-center py-2 justify-center "> {location} </div>

        <div class="flex flex-col align-center ">
            <div class="flex justify-center ">
                {images.length === 0 ? <></> : 
                <div class="sm:w-[30rem] sm:h-[30rem] w-[20rem] h-[20rem] md:w-[40rem] md:h-[40rem] carousel carousel-vertical rounded-box">
                    {images.map(image => (
                        <div key={image.id} class="carousel-item sm:w-[30rem] sm:h-[30rem] w-[20rem] h-[20rem] md:w-[40rem] md:h-[40rem] justify-center " id={`image${image.id}`}>
                            <img src={image.img} alt="No value provided" class=" sm:w-[30rem] sm:h-[30rem] w-[20rem] h-[20rem] md:w-[40rem] md:h-[40rem] rounded-box border-neutral-focus border-2 shadow-xl" />
                        </div>
                    ))}

                </div>
                }
            </div>
            <div class="flex justify-center w-full py-2 gap-2">
                {images.length === 0 ? <></> : images.map(image => (
                    <a key={image.id} href={`#image${image.id}`} class="btn btn-outline btn-xs">o</a>
                ))}
            </div>

        </div>

        <div class="divider"></div>

        <div class="grid grid-cols-1 lg:grid-cols-2">

            <div class="flex flex-col items-center lg:justify-center">
                <h1 class="text-center font-semibold text-3xl pt-4"> Description </h1>
                <p class="p-4">{description}</p>
            </div>

            <div class="flex flex-col items-center">
                <h1 class="text-center font-semibold text-3xl py-4"> Your <a href="Profile.html"
                    class="text-secondary hover:text-secondary-focus text-3xl">Host</a></h1>
                <div class="card w-80 bg-base-100 shadow-xl ring-2 ring-secondary ">
                    <figure>
                        <div class="avatar p-4">
                            <div class="w-60 rounded-full ring-2 ring-neutral">
                                {avatar === "" ? <></> : <img alt='Avatar' src={avatar} />}
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
        </div>


        <div class="divider"></div>

        <div class="flex flex-col items-center">
            <h1 class="text-center text-3xl font-semibold m-4">Accessibility</h1>
            <div class=" flex flex-wrap justify-evenly w-full">

                {accessibilityALL.map(token => (
                    <div key={token.id} class="flex flex-col items-center">
                        {accessibility.includes(token.id) ? <>
                            <img src={token.icon} alt="No value provided" class="m-4 rounded-full w-24 h-24 rounded-box border-success border-2 shadow-xl" />
                            <h1 class="text-center text-success font-semibold text-3xl m-4">{token.name}</h1>
                        </> :
                            <>
                                <img src={token.icon} alt="No value provided" class="m-4 rounded-full w-24 h-24 rounded-box border-error border-2 shadow-xl" />
                                <h1 class="text-center text-error font-semibold text-3xl m-4">{token.name}</h1>
                            </>}

                    </div>
                ))}

            </div>
        </div>

        <div class="divider"></div>


        <div class="stats stats-vertical lg:stats-horizontal  ">

            <div class="stat place-items-center">
                <div class="font-semibold text-3xl t ">Beds</div>
                <div class="stat-value">{bed}</div>
            </div>

            <div class="stat place-items-center">
                <div class="font-semibold text-3xl">Bathrooms</div>
                <div class="stat-value">{bath}</div>
            </div>

            <div class="stat place-items-center">
                <div class="font-semibold text-3xl">Parking</div>
                <div class="stat-value">{parking}</div>
            </div>

            <div class="stat place-items-center">
                <div class="font-semibold text-3xl">Occupancy</div>
                <div class="stat-value">{occupancy}</div>
            </div>

        </div>


        <div class="divider"></div>

        <div class="flex flex-col items-center">
            <h1 class="text-center text-3xl font-semibold m-4">Amenities</h1>

            <div class=" flex flex-wrap justify-evenly w-full">

                {amenitiesALL.map(token => (
                    <div key={token.id} class="flex flex-col items-center m-4">
                        {amenities.includes(token.id) ? <>
                            <img src={token.icon} alt="No value provided" class="rounded-full w-24 h-24 rounded-box border-success border-2 shadow-xl m-4" />
                            <h1 class="text-center text-success font-semibold text-3xl m-4">{token.name}</h1>
                        </> :
                            <>
                                <img src={token.icon} alt="No value provided" class="rounded-full w-24 h-24 rounded-box border-error border-2 shadow-xl m-4" />
                                <h1 class="text-center text-error font-semibold text-3xl m-4">{token.name}</h1>
                            </>}

                    </div>
                ))}

            </div>
        </div>

        <div class="divider"></div>

        <div class="flex flex-col p-4 ">

            <h1 class="text-center text-3xl font-semibold pb-4">Reviews</h1>


            <InfiniteScroll
                dataLength={comments.length} //This is important field to render the next data
                next={loadComments}
                hasMore={hasNext}
                loader={<h4>Loading...</h4>}

            >
                {comments.map(comment => (

                    comment.is_parent === true ? generateChain(comment) : <></>

                ))}


            </InfiniteScroll>

        </div>

        {String(host) === String(uid) && active && auth ?
            <div class="flex justify-center">
                <Link class="btn btn-secondary btn-wide btn-outline fixed bottom-8  z-10" to={`/property/${id}/edit`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </Link>
            </div> :
            <></>}

        {String(host) === String(uid) && !active && auth ?
        <div class="flex justify-center">
            <label class="btn btn-secondary btn-wide btn-outline fixed bottom-8  z-10" onClick={() => reactivate()}>
                    REACTIVATE
            </label>
        </div> :
        <></>}

    </div>;


}

export default Property;
