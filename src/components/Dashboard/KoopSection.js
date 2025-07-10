import * as React from "react";
import { postRequest, getUrl, getRequest } from "../ApiCalls";
import CONSTANT from "../Global";
import DataLoader from "../Loader";
import '../components.css';
import { Navigate,useNavigate } from "react-router";
import { useState, useEffect } from "react";

function KoopSection(props) {
    const history = useNavigate();
    const [isLoading, setLoading] = React.useState(true);
    const [buyList, setBuyList] = useState([]);


    React.useEffect(() => {
        GetBuyerListData();
    }, []);
   
    const GetBuyerListData = () => {
        try {
              getRequest({
                requesturl: getUrl() + `/CarStepSummary/GetBuyInfoList`,
              })
                .then((res) => {
                  if(res.status == 401){
                    history("/");
                  }
                  else{
                    setBuyList(res.list);
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
      
                     <div className="border border-primary rounded-2 pa-15 mb-15 koopTable">
                  <h2 className="mb-8">Koop</h2>
                  {isLoading ? <React.Fragment>
          <DataLoader isDashboard={true}></DataLoader>
        </React.Fragment> :
            <>
                  <table
                    cellSpacing="0"
                    cellPadding="0"
                    width="100%"
                    className="table table-borderless tableSmall"
                  >
                    <colgroup>
                      <col width="130px"></col>
                      <col></col>
                      <col></col>
                    </colgroup>
                    <tbody>
                      <tr>
                        <td>
                          <a
                            href="#"
                            className="d-flex align-items-center text-decoration-none"
                          >
                            <i className="min-w-20px min-h-20px lh-0 d-flex align-items-center justify-content-center">
                              <img
                                src="images/betalen.png"
                                alt=""
                                width="19"
                                height="13.5"
                                title="Klik hier voor details"
                                style={{ cursor: "pointer" }}

                              />
                            </i>
                            <span className="ms-12" style={{ cursor: "pointer" }} title="Klik hier voor details">Betalen</span>
                          </a>
                        </td>
                        <td className="text-end">{buyList[0].countIN}</td>
                        <td className="text-end">{buyList[0].amountIN}</td>
                      </tr>
                      <tr>
                        <td>
                          <a
                            href="#"
                            className="d-flex align-items-center text-decoration-none"
                          >
                            <i className="min-w-20px min-h-20px lh-0 d-flex align-items-center justify-content-center">
                              <img
                                src="images/provisioneel.png"
                                alt=""
                                width="17"
                                height="17"
                                title="Klik hier voor details"
                                style={{ cursor: "pointer" }}
                              />
                            </i>
                            <span className="ms-12" style={{ cursor: "pointer" }} title="Klik hier voor details">Provisioneel</span>
                          </a>
                        </td>
                        <td className="text-end">{buyList[0].countPB}</td>
                        <td className="text-end">{buyList[0].amountPB}</td>
                      </tr>
                      <tr>
                        <td>
                          <a
                            href="#"
                            className="d-flex align-items-center text-decoration-none"
                          >
                            <i className="min-w-20px min-h-20px lh-0 d-flex align-items-center justify-content-center">
                              <img
                                src="images/hoogste-bod.png"
                                alt=""
                                width="17"
                                height="17"
                                style={{ cursor: "pointer" }}
                              />
                            </i>
                            <span className="ms-12" style={{ cursor: "pointer" }}>Hoogste bod</span>
                          </a>
                        </td>
                        <td className="text-end">{buyList[0].countHB}</td>
                        <td className="text-end">{buyList[0].amountHB}</td>
                      </tr>
                    </tbody>
                  </table>
                  </>
}
                </div>
          
    )
}

export default KoopSection;