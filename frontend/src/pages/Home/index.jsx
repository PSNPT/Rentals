import { Link, useNavigate, useParams } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component'
import ListingCard from '../../components/ListingCard';
import SearchBar from '../../components/SearchBar';

function Home() {
  const ref = useRef(null);
  let navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [price, setPrice] = useState(100000);
  const [bed, setBed] = useState(0);
  const [bath, setBath] = useState(0);
  const [parking, setParking] = useState(0);
  const [occupancy, setOccupancy] = useState(0);
  const [amenities, setAmenities] = useState([]);
  const [accessibility, setAccessibility] = useState([]);
  const [order, setOrder] = useState("");
  const [descending, setDescending] = useState("");


  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(0);
  const query = "http://localhost:8000/listing/search/?"
  const [modifiers, setModifiers] = useState("");
  const [hasNext, setHasNext] = useState(true);
  const [generalError, setGeneralError] = useState("");

  const loadListings = () => {
  

    fetch(query+`page=${page}&`+modifiers, {
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

          let temp = listings;

          temp = temp.concat(data.results);

          setListings(temp);

        } else {
          setGeneralError("Error, invalid search criteria");
        }
      })
      .catch(error => console.log(error))

  };


  useEffect(() => {
    var tm = "";

    if(location !== ""){
      tm += `location=${location}&`;
    }

    if(start !== ""){
      tm += `start=${start}&`;
    }

    if(end !== ""){
      tm += `end=${end}&`;
    }

    if(price !== 100000){
      tm += `price=${price}&`;
    }

    if(bed !== 0){
      tm += `bed=${bed}&`;
    }

    if(bath !== 0){
      tm += `bath=${bath}&`;
    }

    if(parking !== 0){
      tm += `parking=${parking}&`;
    }

    if(occupancy !== 0){
      tm += `occupancy=${occupancy}&`;
    }

    if(order !== ""){
      tm += `order=${order}&`;
    }

    if(descending !== ""){
      tm += `descending=${descending}&`;
    }

    setModifiers(tm);

  }, [location, start, end, price, bed, bath, parking, occupancy, order, descending]);

  useEffect(() => {
      setListings([])
      setPage(0)
      setHasNext(true)
  }, [modifiers]);

  useEffect(() => {
    if(page > 0)
    {
      loadListings();

    }

  }, [page])

  return <div id="cont" ref={ref} class="!min-h-screen">

    <SearchBar location={location} setLocation={setLocation}
      start={start} setStart={setStart}
      end={end} setEnd={setEnd}
      price={price} setPrice={setPrice}
      bed={bed} setBed={setBed}
      bath={bath} setBath={setBath}
      parking={parking} setParking={setParking}
      occupancy={occupancy} setOccupancy={setOccupancy}
      amenities={amenities} setAmenities={setAmenities}
      accessibility={accessibility} setAccessibility={setAccessibility}
      order={order} setOrder={setOrder}
      descending={descending} setDescending={setDescending}
    />

    <InfiniteScroll
      dataLength={page * 2} //This is important field to render the next data
      children={listings}
      next={() => setPage(page + 1)}
      hasMore={hasNext}
      loader={<div class="flex w-full justify-center py-8">
        <button class="btn btn-square loading"></button>
      </div>}

    > 
    
      <div class="w-full flex flex-wrap justify-evenly z-0 min-h-screen">
        {listings.map(listing => (

          <ListingCard key={listing.id} id={listing.id} />

        ))}
      </div>
    
    </InfiniteScroll>

  </div>

    ;

}

export default Home;