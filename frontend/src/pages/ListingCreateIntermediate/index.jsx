import PropertyIntermediaryCard from "../../components/PropertyIntermediaryCard";
import { useContext, useEffect, useState, } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { APIContext } from "../../APIContext";

function ListingCreateIntermediate() {

    var token = localStorage.getItem('access');

    const [properties, setProperties] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);


    const [loaded, setLoaded] = useState(false);

    const { auth, setAuth } = useContext(APIContext);

    useEffect(() => {

        if (hasNext || page === 1) {


            const getData = async () => {

                const response = await fetch(`http://localhost:8000/property/all/?page=${page}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                })

                const data = await response.json();
                
                if(response.status !== 200){
                    navigator('/404')
                }

                if(String(data.next) === String(null)){
                    setHasNext(false)
                }
                else{
                    setHasNext(true)
                }

                setProperties(data.results);
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

        <div class="font-semibold text-3xl py-8">Your Properties</div>

        <div className="flex flex-wrap justify-evenly w-full">

            {properties.length === 0 ?

                <div class="flex font-semibold text-5xl text-center py-4 justify-center"> Nothing here! </div>
                :

                properties.map(prop => (
                    <div><PropertyIntermediaryCard id={prop.id} /></div>

                ))

            }

        </div>

        <div class="flex flex-wrap py-4">
            {page > 1 ? <label class="btn btn-primary mx-4" onClick={() => { setPage(page - 1); setHasNext(true)}}> Previous </label> : <></>}
            {hasNext ? <label class="btn btn-primary mx-4" onClick={() => {setPage(page + 1)}}> Next </label> : <></>}

        </div>

    </div>




}

export default ListingCreateIntermediate;
