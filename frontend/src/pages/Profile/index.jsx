import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState, } from "react";
import { APIContext } from "../../APIContext";

function Profile() {
    const {id} = useParams();
    var navigator = useNavigate();
    const uid = localStorage.getItem('id');

    const [avatar, setAvatar] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const { auth, setAuth } = useContext(APIContext);

    useEffect( () => {

    fetch(`http://localhost:8000/accounts/${id}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(async response => {
            if (response.status === 200) {
                const data = await response.json();
                setAvatar(data.avatar);
                setFirstName(data.first_name);
                setLastName(data.last_name);
                setEmail(data.email);
            } else {
                navigator('/404');
            }
        })
        .catch(error => console.log(error))
    }, []);



    return  <div id="cont" className="flex flex-col justify-center">
                <div className="hero max-h-500px bg-base-100">
                    <div className="hero-content flex-col">
                        <div className="avatar">
                        <div className="w-60 rounded-full">
                            <img src={avatar} alt="No Avatar"/>
                        </div>
                        </div>
                        <div>
                            <h1 className="text-5xl py-3 font-semibold text-center">
                                {firstName}
                            </h1>
                            <h1 className="text-5xl py-3 font-semibold text-center">
                                {lastName}
                            </h1>
                            <p className="text-5xl py-3 font-semibold text-center">
                                {email}
                            </p>
                        </div>
                        
                    </div>
                </div>



                {/* Edit button */}
                { uid === id && auth? <div className="flex justify-center">
                <Link to="/profile/edit" className="btn btn-outline btn-wide fixed bottom-16  z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                    stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    </Link>
                </div>
                : <></>

                }

            </div>;

}

export default Profile;