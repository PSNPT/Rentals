
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PropertyCard = ({id}) => {

    var navigator = useNavigate();
    const uid = localStorage.getItem('id');

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [images, setImages] = useState([]);
    const [host, setHost] = useState("");

    const [active, setActive] = useState(false);

    const [loaded, setLoaded] = useState(false);
    const [ready, setReady] = useState(false);


    useEffect(() => {

        const getData = async () => {

            var response = await fetch(`http://localhost:8000/property/${id}/`);
            
            if(response.status !== 200) {
                navigator('/404')
            }

            var data = await response.json();

            setName(data.name);
            setLocation(data.location);
            setImages(data.image_set);
            setActive(data.is_active);
            setHost(data.host);
            setLoaded(true);

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



                    

    return            <Link to={`/property/${id}`}>
                    <div class="card card-compact w-80 h-120 bg-base-100 drop-shadow-2xl m-4 ring-2 ring-neutral hover:ring-4">

                        <figure class="ring-2 ring-neutral"><img class="h-60 w-full" src={images} alt="" /></figure>

                        <div class="card-body">

                            <h2 class="card-title font-semibold">
                            {name}
                            </h2>

                            <h2 class="card-title font-semibold">
                            {location}
                            </h2>

                            {String(uid) === String(host) ?
                                <h2 class="card-title font-semibold">
                            {active ? "ACTIVE" : "INACTIVE"}
                            </h2>
                             : <></>}

                        </div>

                    </div>
                </Link> 



}

export default PropertyCard;