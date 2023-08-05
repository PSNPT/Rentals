import { Link, Outlet } from "react-router-dom";
import { Helmet } from 'react-helmet';

const SearchBar = ({ location, setLocation,
    start, setStart,
    end, setEnd,
    price, setPrice,
    bed, setBed,
    bath, setBath,
    parking, setParking,
    occupancy, setOccupancy,
    order, setOrder,
    descending, setDescending }) => {

    return <>

        <div class="w-full z-0 md:hidden justify-center py-4">
            <div class="form-control flex items-center">
                <div class="input-group input-group-vertical p-4 max-w-lg" id="middlenav">
                    <input type="text" placeholder={location === "" ? "Location": location} onChange={(e) => setLocation(e.target.value)}
                        class="input input-bordered font-semibold text-base bg-white text-center" />

                    {/* Check-in input */}
                    <input type="text" placeholder={start === "" ? "Check-in": start} onChange={(e) => setStart(e.target.value)} onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")}
                        class="input input-bordered font-semibold text-base bg-white text-center" />

                    {/* Check-out input */}
                    <input type="text" placeholder={end === "" ? "Check-out": end} onChange={(e) => setEnd(e.target.value)} onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")}
                        class="input input-bordered font-semibold text-base bg-white text-center" />

                    {/* small Guests button */}
                    <label id="searchbuttons" for="guestsmall"
                        class="btn btn-outline border border-base-content border-opacity-20">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                        </svg>
                    </label>

                    {/* Filter Button */}
                    <label id="searchbuttons" for="filtermodal"
                        class="btn btn-outline border border-base-content border-opacity-20 shadow-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </label>

                </div>
            </div>
        </div>
        <div class="w-full z-0 hidden md:flex justify-center py-4">
            <div class="form-control">
                <div class="input-group" id="middlenav">

                    <input type="text" placeholder={location === "" ? "Location": location}
                        class="input input-bordered font-semibold text-base bg-white shadow-xl" onChange={(e) => setLocation(e.target.value)} />


                    <input type="text" placeholder={start === "" ? "Check-in": start}
                        class="input input-bordered font-semibold text-base w-40 bg-white shadow-xl" onChange={(e) => setStart(e.target.value)} onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")}/>


                    <input type="text" placeholder={end === "" ? "Check-out": end}
                        class="input input-bordered font-semibold text-base w-40 bg-white shadow-xl" onChange={(e) => setEnd(e.target.value)} onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")}/>


                    <div class="dropdown dropdown-end shadow-xl">
                        <label tabindex="0" id="guests" class="btn btn-outline border-opacity-20">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                            </svg>
                        </label>


                        <div tabindex="0" id="guestscard" class="card compact dropdown-content shadow bg-base-100">
                            <div class="card-body">



                                <div class="flex justify-center font-semibold">
                                    <h1>Occupancy</h1>
                                </div>

                                <div class="flex">
                                    <button data-action="decrement" class="btn btn-outline" id="lb" onClick={(e) => occupancy <= 0 ? <></> : setOccupancy(occupancy - 1)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                            stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                    <input id="vals" type="number" placeholder={occupancy} class="input input-bordered text-center w-20" />
                                    <button data-action="increment" class="btn btn-outline" id="rb" onClick={(e) => setOccupancy(occupancy + 1)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                            stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    <label id="searchbuttons" for="filtermodal"
                        class="btn btn-outline border border-base-content border-opacity-20 shadow-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </label>
                </div>
            </div>


        </div>

        {/* MODAL */}
        <input type="checkbox" id="filtermodal" class="modal-toggle" />
        <div class="modal">
            <div class="modal-box max-w-lg scrollbar-hide">
                <div class="grid grid-cols-1" id="gridfilter">
                    <div id="order" class="flex flex-col justify-center items-center">
                        <div class="text-xl font-semibold">
                            <h1 class="text-xl font-semibold pb-4">Order by</h1>
                        </div>

                        <div class="grid grid-cols-2 grid-rows-3 justify-items-center w-full h-48">

                            <div>
                                <input type="radio" name="sort" value="Price" id="Price" class="peer hidden" />

                                <label for="Price" onClick={(e) => setOrder("price")}
                                    class="w-32 btn btn-outline peer-checked:border-green-400 peer-checked:ring-4 peer-checked:ring-green-400">
                                    <p>Price</p>
                                </label>
                            </div>

                            <div>
                                <input type="radio" name="sort" value="Start" id="Start" class="peer hidden" />

                                <label for="Start"
                                    class="w-32 btn btn-outline peer-checked:border-green-400 peer-checked:ring-4 peer-checked:ring-green-400"
                                    onClick={(e) => setOrder("start")}>
                                    <p>Start Date</p>
                                </label>
                            </div>

                            <div>
                                <input type="radio" name="sort" value="End" id="End" class="peer hidden" />

                                <label for="End" onClick={(e) => setOrder("end")}
                                    class="w-32 btn btn-outline peer-checked:border-green-400 peer-checked:ring-4 peer-checked:ring-green-400">
                                    <p>End Date</p>
                                </label>
                            </div>

                            <div>
                                <input type="radio" name="sort" value="Occupancy" id="Occupancy" class="peer hidden" />

                                <label for="Occupancy" onClick={(e) => setOrder("occupancy")}
                                    class="w-32 btn btn-outline peer-checked:border-green-400 peer-checked:ring-4 peer-checked:ring-green-400">
                                    <p>Occupancy</p>
                                </label>
                            </div>

                            <div>
                                <input type="radio" name="ad" value="Ascending" id="Ascending" class="peer hidden" checked />

                                <label for="Ascending" onClick={(e) => setDescending("False")}
                                    class="w-32 btn btn-outline peer-checked:border-green-400 peer-checked:ring-4 peer-checked:ring-green-400">
                                    <p>Ascending</p>
                                </label>
                            </div>

                            <div>
                                <input type="radio" name="ad" value="Descending" id="Descending" class="peer hidden" />

                                <label for="Descending" onClick={(e) => setDescending("True")}
                                    class="w-32 btn btn-outline peer-checked:border-green-400 peer-checked:ring-4 peer-checked:ring-green-400">
                                    <p>Descending</p>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Price */}
                    <div>

                        <div class="flex flex-col justify-evenly items-center scroll">
                            <h1 class="text-xl font-semibold pb-4">Maximum Price</h1>

                            <input class="input input-bordered w-40 text-center" type="number" placeholder={price} onChange={(e) => setPrice(e.target.value)} />

                        </div>
                    </div>

                    {/* Bedrooms */}
                    <div>
                        <h1 class="text-xl font-semibold">Bedrooms</h1>
                        <input type="range" min="0" max="5" class="range" step="1" onChange={(e) => setBed(e.target.value)} />
                        <div class="w-full flex justify-between text-xs px-2">
                            <span>Any</span>
                            <span>1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>4</span>
                            <span>5+</span>
                        </div>
                    </div>

                    {/* Bathrooms */}
                    <div>
                        <h1 class="text-xl font-semibold">Bathrooms</h1>
                        <input type="range" min="0" max="5" class="range" step="1" onChange={(e) => setBath(e.target.value)} />
                        <div class="w-full flex justify-between text-xs px-2">
                            <span>Any</span>
                            <span>1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>4</span>
                            <span>5+</span>
                        </div>
                    </div>

                    {/* Parking */}
                    <div>
                        <h1 class="text-xl font-semibold">Parking</h1>
                        <input type="range" min="0" max="5" class="range" step="1" onChange={(e) => setParking(e.target.value)} />
                        <div class="w-full flex justify-between text-xs px-2">
                            <span>Any</span>
                            <span>1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>4</span>
                            <span>5+</span>
                        </div>
                    </div>

                </div>

                <div class="flex justify-center">
                    <div class="modal-action">
                        <label for="filtermodal" class="btn btn-outline">Close</label>
                    </div>
                </div>
            </div>
        </div>

    <input type="checkbox" id="guestsmall" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box max-w-lg scrollbar-hide">
          <div class="card-body">


            <div class="flex justify-center font-semibold">
              <h1>Occupancy</h1>
            </div>

            <div class="flex justify-center">
              <button data-action="decrement" class="btn btn-outline" id="lb" onClick={(e) => occupancy <= 0 ? <></> : setOccupancy(occupancy - 1)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <input id="vals" type="number" placeholder={occupancy} class="input input-bordered text-center w-20"  onClick={(e) => setOccupancy(occupancy + 1)}/>
              <button data-action="increment" class="btn btn-outline" id="rb">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>

          </div>

          <div class="modal-action justify-center">
            <label for="guestsmall" class="btn btn-outline rounded-full">Close</label>
          </div>
        </div>
      </div>

    </>




}

export default SearchBar;