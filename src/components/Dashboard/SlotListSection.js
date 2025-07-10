import * as React from "react";
import { postRequest, getUrl, getRequest } from "../ApiCalls";
import DataLoader from "../Loader";
import '../components.css';
import { Navigate,useNavigate } from "react-router";
import { Link } from "react-router-dom";

function SlotListSection(props) {
    const history = useNavigate();
    const [isLoading, setLoading] = React.useState(true);
    const [auctionList, setAuctionList] = React.useState({});


    React.useEffect(() => {
        GetSlotListData();
    }, []);
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

    const GetSlotListData = () => {
        try {
              getRequest({
                requesturl: getUrl() + `/CarStepSummary/SlotList`,
              })
                .then((res) => {
                  if(res.status == 401){
                    history("/");
                  }
                  else{
                    setAuctionList(res.list); 
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
  
                      <div className="bg-lightgray pa-15 pb-30 rounded-2 mb-15">
                  <h2 className="mb-3">Veilingen</h2>
                  {isLoading ? <React.Fragment>
          <DataLoader isDashboard={true}></DataLoader>
        </React.Fragment> :
            <>
                  {auctionList.map((auction, index) => (
                    (auction.slotTypeId === 3) && (<div key={index} className="d-flex align-items-center mb-1">
                        <i className="min-w-20px text-end lh-0">
                          {auction.slotLogoPath !== null ? (<img
                            src={"img/" + auction.slotLogoPath.replace("CompanyLogo\\", "")}
                            alt=""
                            width="14"
                            height="14"
                          />) : 
                          (<img
                            src="images/spacer.Transparent.gif"
                            alt=""
                            width="14"
                            height="14"
                          />)}
                        </i>
                      <span className="ms-12"  style={{ cursor: "pointer"}}>
                        <a href="#" style={{textDecoration:"none"}}>
                        {auction.slotName}({auction.slotCarCount})
                        </a>
                      </span>


                    </div>)

                  ))}
                  {auctionList.map((auction, index) => (

                    (auction.slotTypeId === 1) && (<div key={index} className="d-flex align-items-center mb-1">
                      {auction.slotLogoPath && (
                        <i className="min-w-20px text-end lh-0">
                          {auction.slotLogoPath !== null ? (<img
                            src={"img/" + auction.slotLogoPath.replace("CompanyLogo\\", "")}
                            alt=""
                            width="14"
                            height="14"
                          />) : (<img
                            src="img/logo.png"
                            alt=""
                            width="14"
                            height="14"
                          />)}
                        </i>
                      )}
                      <span className="ms-12">
                      <a href="#" style={{textDecoration:"none"}}>
                        {auction.slotName}<br />
                        {formatDate(auction.slotDateTime)}
                        </a>
                      </span>
                    </div>)
                  ))}
                  {auctionList.map((auction, index) => (

                    (auction.slotTypeId === 4) && (<div key={index} className="d-flex align-items-center mb-1">
                      {auction.slotLogoPath && (
                        <i className="min-w-20px text-end lh-0">
                          {auction.slotLogoPath !== null ? (<img
                            src={"img/" + auction.slotLogoPath.replace("CompanyLogo\\", "")}
                            alt=""
                            width="14"
                            height="14"
                          />) : (<img
                            src="img/logo.png"
                            alt=""
                            width="14"
                            height="14"
                          />)}
                        </i>
                      )}
                      <span className="ms-12"  style={{ cursor: "pointer" }}>
                      <a href="#" style={{textDecoration:"none"}}>
                        {auction.slotName}<br />
                        {formatDate(auction.slotDateTime)}
                        </a>
                      </span>
                    </div>)
                  ))}
                  </>
}
                </div>
            
    )
}

export default SlotListSection;