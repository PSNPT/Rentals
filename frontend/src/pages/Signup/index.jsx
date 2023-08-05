import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useContext } from 'react';
import { APIContext } from '../../APIContext';
function Signup(){
    const {auth, setAuth} = useContext(APIContext);
    let navigate = useNavigate();
    const [avatar, setAvatar] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");

    const [avatarError, setAvatarError] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password1Error, setPassword1Error] = useState([]);
    const [password2Error, setPassword2Error] = useState([]);
    const [generalError, setGeneralError] = useState("");

    var error_dict = {avatar: setAvatarError,
                    first_name: setFirstNameError,
                    last_name: setLastNameError,
                    email: setEmailError,
                    password1: setPassword1Error,
                    password2: setPassword2Error,
                    general: setGeneralError,
                }

    const handleAvatarChange = (event) => {
        setAvatar(event.target.files[0]);
      };

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
      };
    
      const handleLastNameChange = (event) => {
        setLastName(event.target.value);
      };
    
      const handleEmailChange = (event) => {
        setEmail(event.target.value);
      };
    
      const handlePassword1Change = (event) => {
        setPassword1(event.target.value);
      };
    
      const handlePassword2Change = (event) => {
        setPassword2(event.target.value);
      };

      useEffect(() =>{
        if(auth){
            navigate('/401')
        }
    }, [auth])   

    const createUser = () => {

        for (var key in error_dict){

            const setError = error_dict[key];
            setError("");

            if(key === 'password1'){
                setError([""]);
            }
            if(key === 'password2'){
                setError([""]);
            }
        }

        const formData = new FormData();
        formData.append('avatar', avatar);
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('password1', password1);
        formData.append('password2', password2);
        formData.append('email', email);

        fetch('http://localhost:8000/accounts/signup/', {
            method: 'POST',
            body: formData
          })
          .then(async response => {
            if (response.status === 201) {

                navigate('/signin');

            } else if (response.status === 400) {

                var errors = await response.json();

                for (var key in errors){
                    const setError = error_dict[key];
                    setError(errors[key]);
                }

            }
          })
          .catch(error => setGeneralError(error));
    }


    return <div id="cont" className="flex flex-col justify-between">

                <div className="hero min-h-screen bg-base-200">
                    <div className="hero-content flex-col lg:flex-row">
                        <div className="text-center lg:text-left">
                            <h1 className="text-5xl font-bold">Welcome to Restify!</h1>
                            <p className="py-6">Lets get to know each other</p>
                        </div>
                        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                            <div className="card-body">
                                <div className="form-control" >
                                    <label className="label">
                                        <span className="label-text">Avatar</span>
                                    </label>
                                    <input type="file" className="file-input file-input-bordered w-full max-w-xs" onChange={handleAvatarChange} />
                                    { avatarError === "" ? <></> : <label className="label text-error">{avatarError}</label>}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">First Name</span>
                                    </label>
                                    <input type="text" placeholder="first name" className="input input-bordered" onChange={handleFirstNameChange} />
                                    { firstNameError === "" ? <></> : <label className="label text-error" >{firstNameError}</label>}

                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Last Name</span>
                                    </label>
                                    <input type="text" placeholder="last name" className="input input-bordered" onChange={handleLastNameChange}/>
                                    { lastNameError === "" ? <></> : <label className="label text-error" >{lastNameError}</label>}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input type="text" placeholder="email" className="input input-bordered" onChange={handleEmailChange}/>
                                    { emailError === "" ? <></> : <label className="label text-error" >{emailError}</label>}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Password</span>
                                    </label>
                                    <input type="password" placeholder="password" className="input input-bordered" onChange={handlePassword1Change}/>
                                    {password1Error.map(error => (
                                        <label key={error} className="label text-error" >{error}</label>
                                    ))}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Confirm Password</span>
                                    </label>
                                    <input type="password" placeholder="password" className="input input-bordered" onChange={handlePassword2Change}/>
                                    {password2Error.map(error => (
                                        <label key={error} className="label text-error" >{error}</label>
                                    ))}
                                </div>

                                <div className="form-control mt-6">
                                
                                    <label className="btn btn-outline" onClick={createUser} >Sign up</label>
                                    { generalError === "" ? <></> : <label className="label text-error" >{generalError}</label>}
                                </div>

                                <div className="form-control text-center mt-3">
                                    <span>Already have an account? <Link className="font-semibold underline" to="/signin">Sign in</Link></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>;

}

export default Signup;