import * as React from "react";
import { postRequest, getUrl, getRequest } from "../ApiCalls";
import { useState, useEffect } from "react";
import DataLoader from "../Loader";

import '../components.css';
import { Navigate,useNavigate } from "react-router";
function MarketingSection(props) {
    const history = useNavigate();
    const [isLoading, setLoading] = React.useState(true);
    const [soldOpenClose, setSoldOpenClose] = useState([]);
    const [uniqueLogin, setUniqueLogin] = useState([]);
    const [uniqueBidder, setUniqueBidder] = useState([]);
    const [uniqueBuyers, setUniqueBuyers] = useState([]);
  
    const currentDate = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monthAbbreviation = currentDate.toLocaleString('default', { month: 'short' }).toUpperCase();
    const yearLastTwoDigits = currentDate.getFullYear().toString().slice(-2);


    React.useEffect(() => {
      GetMarketingData();
    }, []);
 
      const GetDateMonthForBuyer = `${currentDate.getDate().toString().padStart(2, '0')}-${months[currentDate.getMonth()]}`;
      const GetMonthYearForBuyer = `${monthAbbreviation}-${yearLastTwoDigits.toString().padStart(2, '0')}`;
    
    const GetMarketingData = async () => {
      try {
        setLoading(true);
  
        const [ saleOpenClose,bidder,user,buyer] = await Promise.all([

          getRequest({
            requesturl: getUrl() + `/CarStepSummary/GetCounterSaleList`,
          }),
          getRequest({
            requesturl: getUrl() + `/CarStepSummary/GetCounterBidderList`,
          }),
          getRequest({
            requesturl: getUrl() + `/CarStepSummary/GetCounterUserList`,
          }),
          getRequest({
            requesturl: getUrl() + `/CarStepSummary/GetCounterBuyerList`,
          }),
        
  
        ]);
       
        if(saleOpenClose.status == 401){
          history("/");
        }
        else{
        setSoldOpenClose(saleOpenClose.list);
        }
  
        if(bidder.status == 401){
          history("/");
        }
        else{
        setUniqueBidder(bidder.list);     
        }
  
        if(user.status == 401){
          history("/");
        }
        else{
        setUniqueLogin(user.list);
        }
  
        if(buyer.status == 401){
          history("/");
        }
        else{
        setUniqueBuyers(buyer.list);
        }
  
      } catch (error) {
        setLoading(false);
        console.error("An unexpected error occurred:", error);
      }
      finally
      {
        setLoading(false);
      }
    }
  
    return (
    
                <div className="border border-primary rounded-2 pa-15 mb-15">
                  <h2 className="mb-12">Marketing informatie</h2>
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
                    <thead>
                      <tr>
                        <th width="150">&nbsp;</th>
                        <th width="85">{GetDateMonthForBuyer}</th>
                        <th width="85">{GetMonthYearForBuyer}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Verkocht open</td>
                        <td>{soldOpenClose[0].counterOpenD}</td>
                        <td>{soldOpenClose[0].counterOpenM}</td>
                      </tr>
                      <tr>
                        <td>Verkocht gesloten</td>
                        <td>{soldOpenClose[0].counterClosedD}</td>
                        <td>{soldOpenClose[0].counterClosedM}</td>
                      </tr>
                      <tr>
                        <td>Unieke inloggers</td>
                        <td>{uniqueLogin[0].counterD}</td>
                        <td>{uniqueLogin[0].counterM}</td>
                      </tr>
                      <tr>
                        <td>Unieke bieders</td>
                        <td>{uniqueBidder[0].counterD}</td>
                        <td>{uniqueBidder[0].counterM}</td>
                      </tr>
                      <tr>
                        <td>Unieke kopers</td>
                        <td>{uniqueBuyers[0].counterD}</td>
                        <td>{uniqueBuyers[0].counterM}</td>
                      </tr>
                    </tbody>
                  </table>
                  </>
}
                </div>
           
    )
}

export default MarketingSection;