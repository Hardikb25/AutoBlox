import logo from "./logo.svg";
import "./App.css";
import * as React from "react";
import Layout from "./components/Layout";
import { Route, Routes, Outlet } from "react-router-dom";
import CarList from "./components/Car/List";
import Login from "./components/Login/Login";
import { CarRecord } from "./components/Car/CarList";
import { AddCar } from "./components/Car/AddCar";
import { Home } from "./components/Home";
import { Dashboard } from "./components/Dashboard/Dashboard";
import AuctionPage from "./components/Car/CarAuction";
import ChatComponent from "./components/ChatComponent";
import CarOnSale from "./components/CarOnSale";
import CarDetail from "./components/Car/CarDetail";
import ReadyForSale from "./components/SellSection/ReadyForSale";
import CarInvoice from "./components/InvoiceSection/CarInvoice";
import ListSync from "./components/Car/ListSync";
import CarKendoList from "./components/Car/KendoList";
import { registerLicense } from '@syncfusion/ej2-base';
registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF1cX2hIfEx0RXxbf1x0ZFFMYlxbRHBPMyBoS35RckRiW39edHZVRmdfWEdw');


// import "@progress/kendo-theme-default/dist/all.css"; 


const MainLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);
function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Login />}></Route>
      <Route exact path="/cardetail" element={<CarDetail />}></Route>
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/carrecord" element={<CarRecord />} />
        <Route path="/cars" element={<CarList />} />
        <Route path="/kendocars" element={<CarKendoList />} />
        <Route path="/addCar" element={<AddCar />} />
        <Route path="/carAuction" element={<AuctionPage />} />
        <Route path="/chatcomponet" element={<ChatComponent />} />
        <Route path="/carOnSale" element={<CarOnSale />} />
        <Route path="/readyForSale" element={<ReadyForSale />} />
        <Route path="/carInvoice" element={<CarInvoice />} />
        <Route path="/CarListSync" element={<ListSync />} />
      </Route>
    </Routes>
  );
}

export default App;
