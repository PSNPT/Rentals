import PropertyCard from "../../components/PropertyCard";
import { useContext, useEffect, useState, } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { APIContext } from "../../APIContext";

function PropertyManage() {
    const { auth, setAuth } = useContext(APIContext);
    var token = localStorage.getItem('access');
    var navigator = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [status, setStatus] = useState("ALL");
    useEffect(() => {

        if (hasNext || page === 1) {
        const getData = async () => {

            var query = "http://localhost:8000/property/"

            if (status === "ALL") {
                query += "all/"
            }
            else if (status === "ACTIVE") {
                query += "allactive/"
            }
            else if (status === "INACTIVE") {
                query += "allinactive/"
            }
            else {
                query += "all/"
            }

            const response = await fetch(query+`?page=${page}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            if (response.status !== 200){
                navigator('/404')
            }

            const data = await response.json();

            
            if (data.next === null) {
                setHasNext(false)
            }
            else {
                setHasNext(true)
            }

            setProperties(data.results);
            setLoaded(true);
        }

        getData().catch(error => console.log(error));
    }

    }, [page, status]);

    useEffect(() => {

        if (!auth) {
            navigator('/401');
        }

    }, [])


    return <div id="cont" class="flex flex-col items-center">

        <div class="font-semibold text-3xl py-8">Your Properties</div>

        <div class="divider"></div>
        <div class="font-semibold text-3xl py-8">Status</div>

        <div class="flex flex-wrap justify-evenly w-full">
            <label class="btn btn-wide btn-accent m-2" onClick={() => { setStatus("ACTIVE"); setPage(1); setHasNext(false) }}> ACTIVE </label>
            <label class="btn btn-wide btn-info m-2" onClick={() => { setStatus("INACTIVE"); setPage(1); setHasNext(false) }}> INACTIVE </label>
            <label class="btn btn-wide btn-secondary m-2" onClick={() => { setStatus("ALL"); setPage(1); setHasNext(false) }}> ALL </label>
        </div>

        <div class="divider"></div>

        <div className="flex flex-wrap justify-evenly w-full">

            {properties.length === 0 ?

                <div class="flex font-semibold text-5xl text-center py-4 justify-center"> Nothing here! </div>
                :

                properties.map(prop => (

                    <PropertyCard id={prop.id} />

                ))

            }

        </div>

        <div class="flex flex-wrap py-4">
            {page > 1 ? <label class="btn btn-primary mx-4" onClick={() => { setPage(page - 1); setHasNext(true) }}> Previous </label> : <></>}
            {hasNext ? <label class="btn btn-primary mx-4" onClick={() => { setPage(page + 1) }}> Next </label> : <></>}

        </div>


        <div className="divider"></div>

        <Link to="/property/create" class="flex justify-center">
            <label className="w-40 py-20 my-20 btn btn-success hover:ring-2 ring-success" >
                ADD A PROPERTY
            </label>
        </Link>


    </div>





}

export default PropertyManage;
