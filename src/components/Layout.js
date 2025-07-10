import React from "react";
import SideBar from "./SideBar";
import Header from "./Header";
import Footer from "./Footer";
import { CarRecord } from "./Car/CarList";
function Layout(props) {
  return (
    <React.Fragment>
      <div className="wrapper">
        <Header />
        {props.children}
        <Footer />
      </div>
    </React.Fragment>
  );
}

export default Layout;
