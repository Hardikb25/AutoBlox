import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import "./components.css";
import DataLoader from "./Loader";
import { encryptData, decryptData } from "./EncrypDecryptData";
import { postRequest, getUrl, getRequest } from "./ApiCalls";
import { Navigate,useNavigate } from "react-router";
import { toast, ToastContainer } from 'react-toastify';
function Header() {
  const history = useNavigate();
  const [SearchText,setSearchText] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);

  const userName = localStorage.getItem("UserName");
  const companyName = localStorage.getItem("CompanyName");
  const adminCompany = localStorage.getItem("CompanyId");
  const userID = localStorage.getItem("UserId");
  const location = useLocation();
  const componentName = location.pathname.split("/").filter(Boolean).pop();
  const HeadingName =
    componentName === "dashboard"
      ? "Overzicht"
      : componentName === "readyForSale"
      ? "Verkoopgereed"
      : componentName === "cars"
      ? "Mijn auto's "
      : componentName === "kendocars"
      ? "Kendo Mijn auto's "
      : null;
      const handleInputChange = (event) => {
        setSearchText(event.target.value);
      };
  const SearchCar = (e) => {
    setSearchText(e.target.value);
    
    if (e.key === "Enter"){
      GetSearchCarResult(e.target.value)
    } 
  }  
  const HandleSearchClick = () => { 
    
    if(SearchText !== ""){
      GetSearchCarResult(SearchText)
     }
    }
    const HandleLogout = () => {
      var name=localStorage.getItem("EncyptedUserName");
    var pass= localStorage.getItem("EncyptedPassword");
    var data={ username:name,password:pass}
      postRequest({
          requesturl: getUrl() + `/Login/Logout`,
          formData: data,
      })
          .then((res) => {
            localStorage.clear();
            localStorage.setItem("JwtToken", res.data.barearToken); 
            history("/");
          })
  }
    
  const GetSearchCarResult = (search) => {

      //setLoading(true)
        getRequest({
          requesturl: getUrl() + `/Car/GetCarGlobalSearchResult?SearchText=` + search + `&UserID=` + userID,
      }).then((res) => {
          if (res) {
            
            if(res.model.isCarAvailable){
              var link = "/CarDetail?Id=" + encryptData(res.model.carId);
              window.open(link, "_blank");
             }
            else{
              toast(res.model.carAvailibilityMsg);
              }
            
          }
      }
      ); 
  }

  return (
   
    <React.Fragment> 
    {/* {
      isLoading ? <React.Fragment>
            <DataLoader />
        </React.Fragment> :
            <></>
    }    */}
      <header>
        <div className="container">
          {/* Header top part start */}
          <div className="headerTop d-flex align-items-center justify-content-between">
            <div className="logo">
              <a href="#">
              <a  href="#">
                <img src="images/logo.png" alt="" width="117" height="36" />
              </a>
                
              </a>
            </div>

            <div className="d-flex align-items-center">
              <div className="searchBox rounded-1 d-flex">
                <input type="search" className="flex-fill" onKeyDown={SearchCar}  value={SearchText} onChange={handleInputChange} />
                <button className="searchIcon" onClick={HandleSearchClick} ></button>
              </div>
              <div className="adminDrop">
                <p
                  name=""
                  id=""
                  className="transSelect h-20px border-0 border-bottom border-primary text-primary"
                  style={{paddingLeft:"2.5rem"}}
                >
                    {userName},{companyName}
                </p>
                {/* <select
                  name=""
                  id=""
                  className="transSelect h-20px border-0 border-bottom border-primary text-primary"
                >
                  <option value="">
                    {userName},{companyName}
                  </option>
                </select> */}
              </div>
              <div className="languageDrop d-flex align-items-center">
                <select
                  name=""
                  id=""
                  className="transSelect h-20px border-0 border-bottom border-primary text-primary paddingLeft-10"
                >
                  <option value="">NL</option>
                  <option value="">EN</option>
                </select>
              </div>
              <div className="logout d-flex align-items-center">
                <h5  className="para text-decoration-none cursor hover-effect" onClick={HandleLogout}>
                  Uitloggen
                </h5>
              </div>{" "}
            </div>
          </div>
          {/* <!-- Header top part end --> */}

          {/* <!-- Navigation start --> */}
          <nav className="nav">
            <ul className="list-unstyled w-100 d-flex align-items-center justify-content-between mb-0">
              <li className={HeadingName === "Overzicht" ?"active" : ""}>
                <Link  to="/dashboard">Beheer</Link>
              </li>
              <li className={HeadingName === "Mijn auto's " ?"active" : ""}>
                <Link to="/cars">Mijn auto’s</Link>
              </li>
              { /*  <li className={HeadingName === "Kendo Mijn auto's " ?"active" : ""}>
                <Link to="/kendocars">Kendo Mijn auto's</Link>
              </li>*/}
              <li>
                
                <a href="#">ToDo</a>
              </li>
              <li className={HeadingName === "Verkoopgereed" ?"active" : ""}>
                <Link to="/readyForSale">Verkopen</Link>
              </li>
              <li>
                <a href="#">Kopen</a>
              </li>
              <li>
                <a href="#">Betalingen</a>
              </li>
              <li>
                <a href="#">Kentekens</a>
              </li>
              <li>
                <a href="#">Mijn gegevens</a>
              </li>
              <li className="inoverLi">
                <a href="#">Invoer auto</a>
              </li>
              <li className="menuRed">
                <a href="#">Waardepagina</a>
              </li>
            </ul>
          </nav>
          {/* <!-- Navigation end --> */}
        </div>
      </header>
      {/* <!-- Title box start --> */}
      <div className="container">
        <div className="text-white bg-primary d-flex align-items-center justify-content-between rounded-2 titleBox">
          <h1 className="mb-0">{HeadingName}</h1>
          {HeadingName === "Overzicht" ? (
            <div className="caption">
              Bedrijfsnaam: {companyName}, Administrator
            </div>
          ) : null}
          {/* <div className="caption">Bedrijfsnaam: {companyName}, Administrator</div> */}
        </div>
      </div>
      {/* <!-- Title box end --> */}
    </React.Fragment>
  );
}

export default Header;
