import * as React from "react";
import { postRequest, getUrl, getRequest } from "../ApiCalls";
import CONSTANT from "../Global";
import DataLoader from "../Loader";
import '../components.css';
import { Navigate,useNavigate } from "react-router";
import ImageDiv from "./ImageDiv";
function SaleSection(props) {
    const history = useNavigate();
    const [isLoading, setLoading] = React.useState(true);
    const [SaleData, SetSaleData] = React.useState({});


    React.useEffect(() => {
      GetSaleData();
    }, []);

    const handleOpenReadyForSaleInNewTab = (isToday) => {
        localStorage.setItem("isToday", isToday);
        //const url = `/readyForSale?IsToday=${encodeURIComponent(isToday)}`;
        window.open(`/readyForSale`, '_blank');
      };

    const GetSaleData = () => {
        setLoading(true)
        getRequest({
            requesturl: getUrl() + `/CarStepSummary/GetCarSummaryForSale?userId=` + localStorage.getItem("UserId"),
        }).then((res) => {if (res) {             
                SetSaleData(res.model)               
            }
            setLoading(false)
        }
        );

    }
  
    return (
     <>
                  <div className="border border-danger rounded-2 pa-15 mb-15">
                  <h2 className="mb-20">Verkopen</h2>
                  {isLoading ? <React.Fragment>
          <DataLoader isDashboard={true}></DataLoader>
        </React.Fragment> :
            <>
                  <div className="d-grid grid-col4 col-gap-30 row-gap-26">
                    <div className="d-flex flex-column align-items-start iconText">
                      <img
                        src="images/call.png"
                        alt=""
                        width="28"
                        height="28"
                        title="Sales Ready"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleOpenReadyForSaleInNewTab(0)}
                      />
                      {/* <h3>Lorem ipsum dolor</h3> */}
                      <p
                        style={{ cursor: "pointer" ,fontWeight:"bold" }}
                        onClick={() => handleOpenReadyForSaleInNewTab(0)}
                      >Totaal: {SaleData.sellSalesReadyTotalCount < 0
                        ? 0
                        : SaleData.sellSalesReadyTotalCount}
                      </p>
                      {SaleData.sellSalesReadyTodayCount !== 0 && (
                        <p
                          style={{ cursor: "pointer",fontWeight:"bold" }}
                          onClick={() => handleOpenReadyForSaleInNewTab(1)}
                        >
                          Vandaag: {SaleData.sellSalesReadyTodayCount}
                        </p>
                      )}
                    </div>
                    <ImageDiv imageSrc="images/transport-put-for-pickup.png" title="In verkoop" totalCount={0} lateCount={0} todayCount={0}></ImageDiv>
                    <ImageDiv imageSrc="images/transport-pickup.png" title="In verkoop" totalCount={SaleData.sellOnSaleTotalCount} lateCount={0} todayCount={SaleData.sellOnSaleTodayCount}></ImageDiv>
                    <ImageDiv imageSrc="images/transport-delivery.png" title="Provisioneel" totalCount={SaleData.sellProvisionalTotalCount} lateCount={0} todayCount={SaleData.sellProvisionalTodayCount}></ImageDiv>


                    </div>
                    </>
}

                 
                </div>
                <div className="border border-primary rounded-2 pa-15 mb-15">
                  <h2 className="mb-20">Kopen</h2>
                  {isLoading ? <React.Fragment>
          <DataLoader isDashboard={true}></DataLoader>
        </React.Fragment> :
            <>

                  <div className="d-grid grid-col4 col-gap-30 row-gap-26">  
                  <ImageDiv imageSrc="images/transport-put-for-pickup.png" title="In verkoop" totalCount={0} lateCount={0} todayCount={0}></ImageDiv>  
                  <ImageDiv imageSrc="images/transport-pickup.png" title="In verkoop" totalCount={SaleData.buyOnSaleTotalCount} lateCount={0} todayCount={SaleData.buyOnSaleTodayCount}></ImageDiv>                                                                  
                  </div>
                  </>
}
                </div>
            </>
    )
}

export default SaleSection;