import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useContext } from 'react';
import { APIContext } from '../../APIContext';

function Signin() {
    const {auth, setAuth} = useContext(APIContext);

    let navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");



    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState([]);
    const [generalError, setGeneralError] = useState("");

    var error_dict = {
        email: setEmailError,
        password: setPasswordError,
        general: setGeneralError,
    }


    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    useEffect(() =>{

        const getUID = async () => {

            var token = localStorage.getItem('access');

            var query = `http://localhost:8000/accounts/UID/`;

            var response = await fetch(query, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            if(response.status !== 200){
                navigate('/404')
            }
            var data = await response.json();

            localStorage.setItem('id', data.id);


            navigate("/home");


        }

        if(auth){
            getUID().catch(error => console.log(error));  
        }
        
    }, [auth])

    const signInUser = () => {

        for (var key in error_dict){

            const setError = error_dict[key];
            setError("");

            if(key === 'password'){
                setError([""]);
            }
        }

        fetch('http://localhost:8000/accounts/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
            .then(async response => {
                if (response.status === 200) {

                    const {refresh, access} = await response.json();
                    localStorage.setItem('refresh', refresh);
                    localStorage.setItem('access', access);

                    setAuth(true);
                    
                } else if (response.status === 400) {

                    var errors = await response.json();

                    for (var key in errors) {

                        const setError = error_dict[key];
                        setError(errors[key]);
                    }
                }
                else{
                    setGeneralError("Invalid credentials");
                }
            })
            .catch(error => setGeneralError(error));


    }


    return <div id="cont" className="flex flex-col justify-between">

        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Welcome Back!</h1>
                    <p className="py-6">Log in to continue planning your next getaway with <span className="font-semibold">Restify</span></p>
                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <div className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="text" placeholder="email" className="input input-bordered" onChange={handleEmailChange}/>
                            { emailError === "" ? <></> : <label className="label text-error">{emailError}</label>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" placeholder="password" className="input input-bordered" onChange={handlePasswordChange}/>
                            {passwordError.map(error => (
                                        <label key={error} className="label text-error" >{error}</label>
                                    ))}
                        </div>
                        <div className="form-control mt-6">
                            <label className="btn btn-outline" onClick={signInUser}>Sign in</label>
                            {generalError === "" ? <></> : <label className="label text-error">{generalError}</label>}
                        </div>
                        <div className="form-control text-center mt-3">
                            <span>New? Sign up <Link className="font-semibold underline" to="/signup">here</Link></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;

}

export default Signin;