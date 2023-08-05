import { useNavigate } from "react-router-dom";
import { APIContext } from "../../APIContext";
import { useContext, useEffect,  } from "react";

const Signout = () => {
    const {auth, setAuth} = useContext(APIContext);

    var navigator = useNavigate();

    useEffect(() => {

        localStorage.removeItem("id");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setAuth(false);

        navigator('/home');
    }, [])

}

export default Signout;