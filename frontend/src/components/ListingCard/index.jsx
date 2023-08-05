
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ListingCard = ({ id }) => {

    var navigator = useNavigate();
    const uid = localStorage.getItem('id');

    const [property, setProperty] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [price, setPrice] = useState("");

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
    const [loaded, setLoaded] = useState(false);
    const [ready, setReady] = useState(false);


    useEffect(() => {

        const getData = async () => {
            setReady(false);

            var response = await fetch(`http://localhost:8000/listing/${id}/`);

            
            if(response.status !== 200) {
                navigator('/404')
            }

            var data = await response.json();

            

            setProperty(data.property);
            setStart(data.start);
            setEnd(data.end);
            setPrice(data.price);
            setActive(data.is_active);

            response = await fetch(`http://localhost:8000/property/${data.property}/`);

            
            if(response.status !== 200) {
                navigator('/404')
            }
            
            data = await response.json();

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

            var query = "http://localhost:8000/property/images/?"
            for (var idn of data.image_set) {
                query += `identifiers=${idn}&`
            }
            response = await fetch(query);
            
            if(response.status !== 200) {
                navigator('/404')
            }

            data = await response.json();
            setImages(data[0].img);

        }

        getData().catch(error => console.log(error));

    }, [id]);

    return   <Link to={`/listing/${id}`}>
            <div class="card card-compact w-80 h-120 bg-base-100 drop-shadow-2xl m-4 ring-2 ring-neutral hover:ring-4">

                <figure class="ring-2 ring-neutral"><img class="h-60 w-full" src={images} alt="" /></figure>

                <div class="card-body font-semibold">

                    <h2 class="card-title font-semibold">
                        {name}
                    </h2>

                    <h2 class="card-title font-semibold">
                        {location}
                    </h2>

                    <div class="divider m-0"></div>

                    <h1 class="text-l">{start} to {end}</h1>

                    <h1 class="text-l">${price} CAD/Night</h1>

                    <div class="divider m-0"></div>

                    <div class="card-actions justify-evenly">
                        <div class="badge badge-outline">{bed} bed</div>
                        <div class="badge badge-outline">{bath} bath</div>
                        <div class="badge badge-outline">{parking} parking</div>
                        <div class="badge badge-outline">{occupancy} occupancy</div>
                    </div>

                </div>

            </div>
        </Link>



}

export default ListingCard;