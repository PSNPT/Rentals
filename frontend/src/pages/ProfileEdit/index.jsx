import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState, } from "react";
import { APIContext } from "../../APIContext";
function ProfileEdit() {
    var navigator = useNavigate();
    const { auth, setAuth } = useContext(APIContext);

    var token = localStorage.getItem('access');
    var id = localStorage.getItem('id');
    
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

    const [modAvatar, setmodAvatar] = useState(false);
    const [modFirstName, setmodFirstName] = useState(false);
    const [modLastName, setmodLastName] = useState(false);
    const [modEmail, setmodEmail] = useState(false);


    var error_dict = {avatar: setAvatarError,
                    first_name: setFirstNameError,
                    last_name: setLastNameError,
                    email: setEmailError,
                    general: setGeneralError,
                    password1: setPassword1Error,
                    password2: setPassword2Error,
                }

    const handleAvatarChange = (event) => {

        setAvatar(event.target.files[0]);
        setmodAvatar(true);
      };

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
        setmodFirstName(true);
      };
    
      const handleLastNameChange = (event) => {
        setLastName(event.target.value);
        setmodLastName(true);
      };
    
      const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setmodEmail(true);
      };
    
      const handlePassword1Change = (event) => {
        setPassword1(event.target.value);
      };
    
      const handlePassword2Change = (event) => {
        setPassword2(event.target.value);
      };



    useEffect(() => {

        if(!auth){
            navigator('/401');
        }
        

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



    const editUser = () => {

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
        if(!modAvatar){
            // Do nothing
        }
        else{
            formData.append('avatar', avatar);
        }

        if(!modFirstName){
            // Do nothing
        }
        else{
            formData.append('first_name', firstName);
        }

        if(!modLastName){
            // Do nothing
        }
        else{
            formData.append('last_name', lastName);
        }

        if(!modEmail){
            // Do nothing
        }
        else{
            formData.append('email', email); 
        }

        if (password1 === ""){
            // Do nothing
        }
        else{
            formData.append('password1', password1);
            formData.append('password2', password2);
        }

        fetch(`http://localhost:8000/accounts/${id}/edit/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        })
            .then(async response => {
                if (response.status === 200) {
                    navigator(`/profile/${id}`);
                } else if (response.status === 400) {
                    
                    var errors = await response.json();
                    for (var key in errors){
                        const setError = error_dict[key];
                        setError(errors[key]);
                    }
    
                }
                else{
                    setGeneralError("Unable to edit profile")
                }
            })
            .catch(error => setGeneralError(error));
            
    }


    return  <div id="cont" className="flex flex-col justify-center">
                <div className="hero max-h-500px bg-base-100">
                    <div className="hero-content flex-col">
                        <div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Avatar</span>
                                    </label>
                                    <input type="file" className="file-input file-input-bordered" onChange={handleAvatarChange}/>
                                    { avatarError === "" ? <></> : <label className="label text-error" >{avatarError}</label>}

                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">First Name</span>
                                    </label>
                                    <input type="text" placeholder={firstName} className="input input-bordered" onChange={handleFirstNameChange} />
                                    { firstNameError === "" ? <></> : <label className="label text-error" >{firstNameError}</label>}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Last Name</span>
                                    </label>
                                    <input type="text" placeholder={lastName} className="input input-bordered" onChange={handleLastNameChange} />
                                    { lastNameError === "" ? <></> : <label className="label text-error" >{lastNameError}</label>}
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input type="text" placeholder={email} className="input input-bordered" onChange={handleEmailChange} />
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
                                
                                {generalError === "" ? <></> : <label className="label text-error" >{generalError}</label>}
                        </div>
                        <div className="flex">
                            <Link  to={`/profile/${id}`} className="w-40 btn btn-error btn-outline fixed bottom-16 right-2/4 z-10" id="lb" >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>                                       
                            </Link>
                            <label to={`/profile/${id}`} className="w-40 btn btn-success btn-outline fixed bottom-16 left-2/4 z-10" id="rb" onClick={editUser}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>                      
                            </label>
                        </div>
                    </div>
                </div>
            </div>;

}

export default ProfileEdit;