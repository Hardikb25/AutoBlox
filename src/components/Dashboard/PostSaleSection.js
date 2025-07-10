import * as React from "react";
import { postRequest, getUrl, getRequest } from "../ApiCalls";
import CONSTANT from "../Global";
import DataLoader from "../Loader";
import '../components.css';
import { Navigate,useNavigate } from "react-router";
import ImageDiv from "./ImageDiv";
function PostSaleSection(props) {
    const history = useNavigate();
    const [isLoading, setLoading] = React.useState(true);
    const [PostSaleData, SetPostSaleData] = React.useState({});


    React.useEffect(() => {
      GetPostSaleData();
    }, []);

   
    const GetPostSaleData = () => {
        setLoading(true)
        getRequest({
            requesturl: getUrl() + `/CarStepSummary/GetCarSummaryForPostSale?userId=` + localStorage.getItem("UserId"),
        }).then((res) => {if (res) {               
                SetPostSaleData(res.model)               
            }
            setLoading(false)
        }
        );

    }
  
    return (
        isLoading ? <React.Fragment>
           
        </React.Fragment> :
            <>
            <div className="d-grid grid-col4 col-gap-20 mb-15 fourColumngrid">
                <div className="border border-primary rounded-2 pa-15 mb-15">
                  <h2 className="mb-20">Auto factuur</h2>
                  <div className="d-flex flex-column align-items-start iconText">                    
                    <ImageDiv imageSrc="images/call.png" title="Auto factuur" totalCount={PostSaleData.carInvoiceTotalCount} lateCount={PostSaleData.carInvoiceLateCount} todayCount={PostSaleData.carInvoiceTodayCount}></ImageDiv>                    
                    </div>            
                </div>

                <div className="border border-primary rounded-2 pa-15 mb-15">
                  <h2 className="mb-20">Diensten factuur</h2>
                  <div className="d-flex flex-column align-items-start iconText">                    
                    <ImageDiv imageSrc="images/transport-put-for-pickup.png" title="Diensten factuur" totalCount={PostSaleData.servicesInvoiceTotalCount} lateCount={PostSaleData.servicesInvoiceLateCount} todayCount={PostSaleData.servicesInvoiceTodayCount}></ImageDiv>                    
                    </div>            
                </div>
                <div className="border border-primary rounded-2 pa-15 mb-15">
                  <h2 className="mb-20">Kenteken gegevens</h2>
                  <div className="d-flex flex-column align-items-start iconText">                   
                    <ImageDiv imageSrc="images/transport-pickup.png" title="Kenteken gegevens" totalCount={PostSaleData.licensePlateDataTotalCount} lateCount={PostSaleData.licensePlateDataLateCount} todayCount={PostSaleData.licensePlateDataTodayCount}></ImageDiv>                   
                    </div>            
                </div>

                <div className="border border-primary rounded-2 pa-15 mb-15">
                  <h2 className="mb-20">Buitenlandse papieren</h2>
                  <div className="d-flex flex-column align-items-start iconText">                   
                    <ImageDiv imageSrc="images/transport-delivery.png" title="Buitenlandse papieren" totalCount={PostSaleData.foreignPapersTotalCount} lateCount={PostSaleData.foreignPapersLateCount} todayCount={PostSaleData.foreignPapersTodayCount}></ImageDiv>                   
                    </div>            
                </div>
                </div>
            </>
    )
}

export default PostSaleSection;