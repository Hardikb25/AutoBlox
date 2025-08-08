import React from "react";
import SideBar from "./SideBar";
import Header from "./Header";
import Footer from "./Footer";
import { CarRecord } from "./Car/CarList";
import ProtectedRoute from "../ProtectedRoute";
function Layout(props) {
  return (
    <React.Fragment>
      <ProtectedRoute>

        <div className="wrapper">
          <Header />
          {props.children}
          <Footer />
        </div>
      </ProtectedRoute>
    </React.Fragment>
  );
}

export default Layout;
