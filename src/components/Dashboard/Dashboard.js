import * as React from "react";
import { useState, useEffect } from "react";
import { getRequest } from "../ApiCalls";
import { getUrl } from "../ApiCalls";
import DataLoader from "../Loader";
import CONSTANT from "../Global";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate,useNavigate } from "react-router";
import TransportSection from "../Dashboard/TransportSection";
import TodoSection from "../Dashboard/TodoSection";
import SaleSection from "../Dashboard/SaleSection";
import PostSaleSection from "../Dashboard/PostSaleSection";
import FinalTransportSection from "../Dashboard/FinalTransportSection";
import SlotListSection from "../Dashboard/SlotListSection";
import MarketingSection from "../Dashboard/MarketingSection";
import NewInSaleSection from "../Dashboard/NewInSaleSection";
import KoopSection from "../Dashboard/KoopSection";

export function Dashboard() {

  return (
    <React.Fragment>
     
       
        <section className="midSec">
          <div className="container">
            <div className="row align-items-start">
              {/* <!-- Left column start --> */}
              <div className="col-8">
                <TransportSection></TransportSection>
                <TodoSection></TodoSection>
                <SaleSection></SaleSection>
                <PostSaleSection></PostSaleSection>
                <FinalTransportSection></FinalTransportSection>      
              </div>
             {/* <!-- Left column end --> */} 
 
              <div className="col-4 position-sticky top-0">
                <SlotListSection></SlotListSection>
                <MarketingSection></MarketingSection>
                <NewInSaleSection></NewInSaleSection>
                <KoopSection></KoopSection>
             
              </div>
             
      
            </div>
          </div>
        </section>
      
      

      <ToastContainer />
    </React.Fragment>
  
    )
  }
