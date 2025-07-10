import * as React from "react";
import { postRequest, getUrl, getRequest } from "../ApiCalls";
import CONSTANT from "../Global";
import DataLoader from "../Loader";
import '../components.css';

function ImageDiv(props) {

    const [isLoading, setLoading] = React.useState(true);
  

    React.useEffect(() => {
        
    }, []);

    return (
       
            <>
                <div className="d-flex flex-column align-items-start iconText">
                  <img
                    src={props.imageSrc}
                    alt=""
                    width="28"
                    height="28"
                    title={props.title}
                    
                  />
                    {/* <h3>Lorem ipsum dolor</h3> */} 
                  <p style={{"fontWeight":"bold"}}>Totaal: {props.totalCount < 0
                    ? 0
                    : props.totalCount}
                  </p>
                  {props.lateCount !== 0 && (
                    <p className="text-danger" style={{"fontWeight":"bold"}}>
                      Te laat: {props.lateCount}
                    </p>
                  )}
                  {props.todayCount !== 0 && (
                    <p  style={{"fontWeight":"bold"}}>
                      Vandaag: {props.todayCount}
                    </p>
                  )}
                </div>            
            </>
    )
}

export default ImageDiv;