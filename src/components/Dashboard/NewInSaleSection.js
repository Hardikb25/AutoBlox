import * as React from "react";
import { postRequest, getUrl, getRequest } from "../ApiCalls";
import '../components.css';
import { useState, useEffect } from "react";
import { Navigate,useNavigate } from "react-router";
import DataLoader from "../Loader";
import { Link } from "react-router-dom";

function NewInSaleSection(props) {
    const history = useNavigate();
    const [isLoading, setLoading] = React.useState(true);
    const [newForSaleList, setNewForSaleList] = useState([])

    function formatDate(dateTimeString) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const date = new Date(dateTimeString);
      const day = date.getDate();
      const monthAbbreviation = months[date.getMonth()];
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const formattedDateTime = `${day}-${monthAbbreviation} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      return formattedDateTime;
    }
    function ConverToText(number) {
      return number === "True" ? "Automaat" : "Handgeschakeld";
    }
    const isLetter = (c) => /^[A-Za-z]$/.test(c);
    const isDigit = (c) => /^[0-9]$/.test(c);
    const formatMonthYrs = (inputDate) => {
      const date = new Date(inputDate);
      const month = date.toLocaleDateString('nl-NL', { month: 'short' });
      const year = date.getFullYear().toString().substr(2, 2); // Get the last two digits of the year
  
      return `${month}-${year}`;
    };
    function metersToKilometers(distanceInMeters) {
      if (distanceInMeters < 1000) {
        return distanceInMeters + " km";
      }
      else {
        const distanceInKilometers = distanceInMeters / 1000;
        return distanceInKilometers.toFixed(2) + " km";
      }
    }

    const formatKenteken = (kenteken) => {
      if (kenteken != undefined) {
        if (kenteken.length === 6) {
          const temp = kenteken.toUpperCase();
          const ch01 = temp[0],
            ch02 = temp[1],
            ch03 = temp[2],
            ch04 = temp[3],
            ch05 = temp[4],
            ch06 = temp[5];
  
          if (
            isLetter(ch01) &&
            isLetter(ch02) &&
            isLetter(ch03) &&
            isLetter(ch06) &&
            isDigit(ch04) &&
            isDigit(ch05)
          ) {
            return `${temp.substring(0, 3)}-${temp.substring(3, 5)}-${ch06}`;
          } else if (
            isLetter(ch01) &&
            isDigit(ch02) &&
            isDigit(ch03) &&
            isLetter(ch04) &&
            isLetter(ch05) &&
            isLetter(ch06)
          ) {
            return `${ch01}-${temp.substring(1, 3)}-${temp.substring(3, 6)}`;
          } else if (
            isDigit(ch01) &&
            isLetter(ch02) &&
            isLetter(ch03) &&
            isDigit(ch04) &&
            isDigit(ch05) &&
            isDigit(ch06)
          ) {
            return `${ch01}-${temp.substring(1, 3)}-${temp.substring(3, 6)}`;
          } else if (
            isDigit(ch01) &&
            isDigit(ch02) &&
            isDigit(ch03) &&
            isLetter(ch04) &&
            isLetter(ch05) &&
            isDigit(ch06)
          ) {
            return `${temp.substring(0, 3)}-${temp.substring(3, 5)}-${ch06}`;
          } else if (
            (isDigit(ch01) && isLetter(ch02)) ||
            (isLetter(ch01) && isDigit(ch02))
          ) {
            return `${ch01}-${temp.substring(1, 4)}-${temp.substring(4, 6)}`;
          } else if (
            (isDigit(ch05) && isLetter(ch06)) ||
            (isLetter(ch05) && isDigit(ch06))
          ) {
            return `${temp.substring(0, 2)}-${temp.substring(2, 5)}-${ch06}`;
          } else {
            return `${temp.substring(0, 2)}-${temp.substring(
              2,
              4
            )}-${temp.substring(4, 6)}`;
          }
        } else {
          return kenteken.toUpperCase();
        }
      }
    };

    React.useEffect(() => {
        GetNewForSaleData();
    }, []);

    

    const GetNewForSaleData = () => {
        try {
              getRequest({
                requesturl: getUrl() + `/CarStepSummary/GetNewForSaleInfoList`,
              })
                .then((res) => {
                  if(res.status == 401){
                    history("/");
                  }
                  else{
                    setNewForSaleList(res.list) 
                    setLoading(false);
                  }
                })
                .catch((error) => {
                  console.error("Error fetching data:", error);
                });
            } catch (error) {
              setLoading(false);
              console.error("An unexpected error occurred:", error);
            }
    }
  
    return (
      
                 <div className="border border-primary rounded-2 pa-15 pb-30 mb-15">
                  <h2 className="mb-22">Nieuw in verkoop</h2>
                  {isLoading ? <React.Fragment>
          <DataLoader isDashboard={true}></DataLoader>
        </React.Fragment> :
            <>
                  <div className="carSaleRow">

                    {
                      newForSaleList.map((saleList, index) => (
                        <div className="d-flex" key={index}>
                          <div className="carimgBox min-w-74px">
                            {saleList.carImagePath !==null ? (
                              <a href="#" style={{textDecoration:"none"}}>
                              <img
                                src="images/spacer.Transparent.gif"
                                //src={"img/" + saleList.carImagePath.replace("CompanyLogo\\", "")}
                                alt=""
                                width="100%"
                                height="64"
                                className="object-cover rounded-1 mb-3px"
                              />
                              </a>
                            ):
                            (
                              <a href="#" style={{textDecoration:"none"}}>
                              <img
                                src="images/Kenteken15NTJT1563426_B1.052add3e17424b92973bf9a096516482.jpg"
                                //src={"img/" + saleList.carImagePath.replace("CompanyLogo\\", "")}
                                alt=""
                                width="100%"
                                height="64"
                                className="object-cover rounded-1 mb-3px"
                              />
                              </a>
                            )}
                            <div className="numberPlate caption" title={formatKenteken(saleList.kenteken)} style={{ cursor: "pointer" }}>{formatKenteken(saleList.kenteken)}</div>
                          </div>
                          <div className="carDetails d-flex justify-content-between flex-column">
                            <h3>{saleList.brandName} {saleList.modelName} {saleList.carType}</h3>
                            <p>{saleList.isAutomatic != null && (ConverToText(saleList.isAutomatic))}{saleList.isAutomatic != null ? ', ' : ''}{formatMonthYrs(saleList.firstRegDate)}{saleList.dashboardMileage != null ? ', ' : ''}{saleList.dashboardMileage != null && metersToKilometers(saleList.dashboardMileage)}</p>
                            <div>

                              <div className="d-flex">
                                {saleList.slotLogoPath && (
                                  <a href="#" style={{textDecoration:"none"}}>
                                  <img
                                    title="Afschrijving 43352"
                                    src={"img/" + saleList.slotLogoPath.replace("CompanyLogo\\", "")}
                                    style={{ width: "25px", marginRight: "5px" }}
                                    alt=""
                                  />
                                  </a>
                                )}
                                <a href="#" style={{textDecoration:"none"}}>
                                <p  title="Afschrijving 43352">{formatDate(saleList.slotDateTime)}</p>
                                </a>
                              </div>

                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                  </>
}
                </div>
        
    )
}

export default NewInSaleSection;