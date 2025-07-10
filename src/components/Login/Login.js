import React, {useState } from "react";
import { getRequest, postRequest } from "../ApiCalls";
import { Navigate,useNavigate  } from "react-router-dom";
import CONSTANT from "../Global";
 import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUrl } from "../ApiCalls";
import '../components.css'

function Login() {
  const [item, setItem] = useState({ username: "", password: "" });
  const [redirectTo,setRedirectTo] = useState("");
  const history = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    postRequest({
      requesturl: getUrl() + `/Login/Login`,
      formData: item,
      IsLoginRequest:true, 
    }).then((res) => {
      if (res.data.responseCode===200) {       
        localStorage.setItem("JwtToken", res.data.barearToken);
        localStorage.setItem("EncyptedUserName", res.data.model.encryptedUserName);
        localStorage.setItem("EncyptedPassword", res.data.model.password);
        getUserInfo(item.username);                     
      }
      else{
        toast("Invalid username or password");
      }
    });
  };

  const getUserInfo = (username) => {
        getRequest({
            requesturl: getUrl() + "/Login/UserDetail?username=" + username,                       
        }).then((res) => {      
            localStorage.setItem("UserId", res.model.userId);   
            localStorage.setItem("CompanyId", res.model.userCompanyId); 
            localStorage.setItem("CompanyName",res.model.companyName)        
            localStorage.setItem("UserCompanyType",res.model.CompanyType) 
            localStorage.setItem("UserName", res.model.userFullName);

            history("/dashboard",{state:item.username});
          }).catch((error) =>{
            console.log(error);
          });
  } 

  
  return redirectTo != "" ? (<Navigate  exact to={{ pathname: "/car-list"}} />) :
  (
    <>
    <div class="loginBox w-100vw h-100vh d-flex align-items-center justify-content-center">

        <div class="border border-primary rounded-2 pa-15 bg-white w-400px">

            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0">Inloggen</h2>
                <img src="images/hero-autoblox.png" alt="" height="30" />
            </div>                
            <form onSubmit={handleSubmit}>
            <div class="d-flex align-items-center mb-2">
                <label for="" class="para pe-2 min-w-115px">Gebruikersnaam</label>
                <input type="text" class="flex-fill form-control" value={item.username} 
                    onChange={(e) => setItem({ ...item, username: e.target.value })}/>
            </div>
            <div class="d-flex align-items-center mb-3">
                <label for="" class="para pe-2 min-w-115px">Wachtwoord</label>
                <input type="password" class="flex-fill form-control" value={item.password}
                    onChange={(e) => setItem({ ...item, password: e.target.value })} />
            </div>            
            <div class="d-flex align-items-center justify-content-between mb-4">
                <label for="" class="min-w-115px"></label>
                <button type="submit" class="btn btn-block btn-primary flex-fill">Login</button>
            </div>
            {/* <div class="d-flex align-items-center justify-content-between">
                <label for="" class="min-w-115px"></label>
                <div class="flex-fill d-flex flex-column justify-content-end align-it">                    
                    <div class="chkBox d-flex mb-3">
                        <input type="checkbox" id="1" />
                        <label for="1" class="para">Blijf ingelogd</label>
                    </div>                    
                    <a href="">Gebruikersnaam of wachtwoord vergeten?</a>
                </div>    
            </div>     */}
            </form>
        </div>

    </div>
    <ToastContainer/>
    </>
  );
}
export default Login;
