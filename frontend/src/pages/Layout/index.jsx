import { Link, Outlet } from "react-router-dom";
import { Helmet } from 'react-helmet';
import { useContext, useEffect, useState,  } from "react";
import { APIContext } from "../../APIContext";

const Layout = () => {

    var token = localStorage.getItem('access');
    var refresh = localStorage.getItem('refresh');
    var id = localStorage.getItem('id');

    const[notifs, setNotifs] = useState(false);

    const {auth, setAuth} = useContext(APIContext);
    useEffect(() => {
        
        fetch('http://localhost:8000/verify/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }),
    })
        .then(async response => {
            if (response.status === 200) {
                setAuth(true);

            } else {

                fetch('http://localhost:8000/accounts/refresh/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refresh: refresh }),
                })
                    .then(async data => {

                        if (data.status === 200) {
                            const { access } = await data.json();
                            localStorage.setItem("access", access);
                            setAuth(true);
                        }
                        else {
                            localStorage.removeItem("id");
                            localStorage.removeItem("access");
                            localStorage.removeItem("refresh");
                            setAuth(false);
                        }
                    })
                    .catch(error => console.log(error))
            }
        })
        .catch(error => console.log(error))

    }, [auth, refresh, setAuth, token])
    
    useEffect(() => {

        if(auth){

            const getData = async () => {
                
                var query = `http://localhost:8000/notification/all/?page=${1}&`

                const response = await fetch(query, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                })

                const data = await response.json();

                if(data.results.length === 0){
                    setNotifs(false);
                }
                else{
                    setNotifs(true);
                }
            }

            getData().catch(error => console.log(error));


        }
    }, [auth])

    return <>

        <Helmet>
            <html data-theme="cupcake" />

            <title>Restify</title>

            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>

            <link
                href="https://cdn.jsdelivr.net/npm/daisyui@2.50.0/dist/full.css"
                rel="stylesheet"
                type="text/css"
            />
            <link rel="stylesheet" href="/style.css" />
            <script src="https://cdn.tailwindcss.com"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/datepicker.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/flowbite.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/tw-elements/dist/js/index.min.js"></script>

        </Helmet>


        {auth ? <div className="sticky top-0 navbar bg-base-300 shadow-xl z-10">
            <div className="navbar-start">
                <Link className="normal-case text-xl px-4" to="/home">RESTIFY</Link>
            </div>

            <div className="navbar-end">


                <Link tabIndex="0" className="btn btn-outline border-0" to="/property/manage">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                        stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                </Link>

                <Link tabIndex="0" className="btn btn-outline border-0" to="/notification/manage">

                    
                    <div className="indicator">
                        {notifs ? <span className="indicator-item badge badge-error animate-pulse"></span> : <></>}
                        
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                            stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
                        </svg>
                    </div>
                </Link>


                <div className="dropdown dropdown-end">
                    <label tabIndex="0" className="btn btn-outline border-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                            stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </label>

                    <ul id="acmenu" tabIndex="0"
                        className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-60">

                        <li>
                            <Link to={`/profile/${id}`}> Profile </Link>
                        </li>

                        <li>
                            <Link to="/listing/manage"> Manage Listings </Link>
                        </li>

                        <li>
                            <Link to="/reservation/manage"> Manage Reservations </Link>
                        </li>

                        <li>
                            <Link to="/signout"> Sign out </Link>
                        </li>

                    </ul>
                </div>

            </div>

        </div>

            : <div className="sticky top-0 navbar bg-base-300 shadow-xl z-10">
                <div className="navbar-start">
                    <Link className="normal-case text-xl px-4" to="/home">RESTIFY</Link>
                </div>

                <div className="navbar-end">
                    <div>
                        <Link className="btn btn-outline" to="/signin">Sign In</Link>
                    </div>
                </div>
            </div>
        }

        <Outlet />

        <footer className="footer footer-center p-4 bg-base-300 text-base-content">
            <div>
                <p>Copyright © 2023 - All right reserved by Restify</p>
            </div>
        </footer>

    </>


}

export default Layout;