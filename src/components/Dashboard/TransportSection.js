import * as React from "react";
import { postRequest, getUrl, getRequest } from "../ApiCalls";
import CONSTANT from "../Global";
import DataLoader from "../Loader";
import '../components.css';
import { Navigate,useNavigate } from "react-router";
import ImageDiv from "../Dashboard/ImageDiv";
function TransportSection(props) {
    const history = useNavigate();
    const [isLoading, setLoading] = React.useState(true);
    const [TransportData, SetTransportData] = React.useState({});


    React.useEffect(() => {
      GetTransportData();
    }, []);

    const GetTransportData = () => {
        setLoading(true)
        getRequest({
            requesturl: getUrl() + `/CarStepSummary/GetCarSummaryForTransport?userId=` + localStorage.getItem("UserId"),
        }).then((res) => {if (res) {
                
                SetTransportData(res.model)               
            }
            setLoading(false)
        }
        );

    }
  
    return (
     
                  <div className="border border-primary rounded-2 pa-15 mb-15">
                  <h2 className="mb-20">Transport</h2>
                  {isLoading ? <React.Fragment>
          <DataLoader isDashboard={true}></DataLoader>
        </React.Fragment> :
            <>

                  <div className="d-grid grid-col4 col-gap-30 row-gap-26">
                    <ImageDiv imageSrc="images/call.png" title="Nabellen" totalCount={TransportData.transportCallBackTotalCount} lateCount={TransportData.transportCallBackLateCount} todayCount={TransportData.transportCallBackTodayCount}></ImageDiv>
                    <ImageDiv imageSrc="images/transport-put-for-pickup.png" title="Wacht op klaarzetten" totalCount={TransportData.transportWaitForSetupTotalCount} lateCount={TransportData.transportWaitForSetupLateCount} todayCount={TransportData.transportWaitForSetupTodayCount}></ImageDiv>
                    <ImageDiv imageSrc="images/transport-pickup.png" title="Af te halen" totalCount={TransportData.transportPickUpTotalCount} lateCount={TransportData.transportPickUpLateCount} todayCount={TransportData.transportPickUpTodayCount}></ImageDiv>
                    <ImageDiv imageSrc="images/transport-delivery.png" title="Op transport" totalCount={TransportData.transportOnTransportTotalCount} lateCount={TransportData.transportOnTransportLateCount} todayCount={TransportData.transportOnTransportTodayCount}></ImageDiv>
                    <ImageDiv imageSrc="images/cancel.png" title="Fout transport" totalCount={TransportData.transportCancelTransportTotalCount} lateCount={TransportData.transportCancelTransportLateCount} todayCount={TransportData.transportCancelTransportTodayCount}></ImageDiv>                                                         
                  </div>
                  </>
}
                </div>
            
    )
}

export default TransportSection;