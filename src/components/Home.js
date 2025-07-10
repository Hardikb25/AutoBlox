
import * as React from "react";
import { useState, useEffect } from "react";
import { getRequest } from "./ApiCalls";
import { getUrl } from "./ApiCalls";
import DataLoader from "./Loader";
import DataTable from "react-data-table-component";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import CONSTANT from "./Global";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";


export function Home() {
  const [carSummerRecord, setCarSummerRecord] = useState([]);
  const [carInvoice, setCarInvoice] = useState([]);
  const [lateCarInvoice, setLateCarInvoice] = useState([]);

  const [serviInvoice, setServiceInvoice] = useState([]);

  const [licensePlate, setlicensePlate] = useState([]);
  const [foreignPaper, setforeignPaper] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popUpLoading, setpopUpLoading] = useState(false);
  const [auctionList, setAuctionList] = useState([]);
  const [soldOpenClose, setSoldOpenClose] = useState([]);
  const [uniqueLogin, setUniqueLogin] = useState([]);
  const [uniqueBidder, setUniqueBidder] = useState([]);
  const [uniqueBuyers, setUniqueBuyers] = useState([]);
  const [newForSaleList, setNewForSaleList] = useState([])
  const [buyList, setBuyList] = useState([]);

  //Pop up for  Car Invoice
  const [dialogVisible, setDialogVisible] = useState(false);
  // Pop up for Late Car Invoice
  const [latedialogVisible, setLateDialogVisible] = useState(false);
  // Pop up  for Service Invoice
  const [servicedialogVisible, setServiceDialogVisible] = useState(false);
  //Pop up for License Plate data
  const [licensePlatedialogVisible, setlicensePlateDialogVisible] =
    useState(false);

  //Pop up for Foreign Paper
  const [foreignPaperdialogVisible, setforeignPaperDialogVisible] =
    useState(false);

  //Pop uo close code
  const dialogFooterTemplate = () => {
    return (
      <Button
        label="Ok"
        icon="pi pi-check"
        onClick={() => setDialogVisible(false)}
      />
    );
  };
  const latedialogFooterTemplate = () => {
    return (
      <Button
        label="Ok"
        icon="pi pi-check"
        onClick={() => setLateDialogVisible(false)}
      />
    );
  };
  const servicedialogFooterTemplate = () => {
    return (
      <Button
        label="Ok"
        icon="pi pi-check"
        onClick={() => setServiceDialogVisible(false)}
      />
    );
  };
  const licensePlatedialogFooterTemplate = () => {
    return (
      <Button
        label="Ok"
        icon="pi pi-check"
        onClick={() => setlicensePlateDialogVisible(false)}
      />
    );
  };
  const foreignPaperdialogFooterTemplate = () => {
    return (
      <Button
        label="Ok"
        icon="pi pi-check"
        onClick={() => setforeignPaperDialogVisible(false)}
      />
    );
  };

  // Code for Kenteken formate

  const isLetter = (c) => /^[A-Za-z]$/.test(c);
  const isDigit = (c) => /^[0-9]$/.test(c);

  const formatKenteken = (kenteken) => {
    if(kenteken != undefined){
    if (kenteken.length === 6) {
      const temp = kenteken.toUpperCase();
      const ch01 = temp[0],
        ch02 = temp[1],
        ch03 = temp[2],
        ch04 = temp[3],
        ch05 = temp[4],
        ch06 = temp[5];

      if (
        isLetter(ch01) &&
        isLetter(ch02) &&
        isLetter(ch03) &&
        isLetter(ch06) &&
        isDigit(ch04) &&
        isDigit(ch05)
      ) {
        return `${temp.substring(0, 3)}-${temp.substring(3, 5)}-${ch06}`;
      } else if (
        isLetter(ch01) &&
        isDigit(ch02) &&
        isDigit(ch03) &&
        isLetter(ch04) &&
        isLetter(ch05) &&
        isLetter(ch06)
      ) {
        return `${ch01}-${temp.substring(1, 3)}-${temp.substring(3, 6)}`;
      } else if (
        isDigit(ch01) &&
        isLetter(ch02) &&
        isLetter(ch03) &&
        isDigit(ch04) &&
        isDigit(ch05) &&
        isDigit(ch06)
      ) {
        return `${ch01}-${temp.substring(1, 3)}-${temp.substring(3, 6)}`;
      } else if (
        isDigit(ch01) &&
        isDigit(ch02) &&
        isDigit(ch03) &&
        isLetter(ch04) &&
        isLetter(ch05) &&
        isDigit(ch06)
      ) {
        return `${temp.substring(0, 3)}-${temp.substring(3, 5)}-${ch06}`;
      } else if (
        (isDigit(ch01) && isLetter(ch02)) ||
        (isLetter(ch01) && isDigit(ch02))
      ) {
        return `${ch01}-${temp.substring(1, 4)}-${temp.substring(4, 6)}`;
      } else if (
        (isDigit(ch05) && isLetter(ch06)) ||
        (isLetter(ch05) && isDigit(ch06))
      ) {
        return `${temp.substring(0, 2)}-${temp.substring(2, 5)}-${ch06}`;
      } else {
        return `${temp.substring(0, 2)}-${temp.substring(
          2,
          4
        )}-${temp.substring(4, 6)}`;
      }
    } else {
      return kenteken.toUpperCase();
    }
  }
  };

  // Function for date formate
  const formattedDate = (props) => {
    const originalDate = new Date(props);
    const options = { day: "numeric", month: "short", year: "numeric" };
    const rdate = originalDate.toLocaleDateString("nl-NL", options);
    return rdate;
  };
  // Column name and row data for Car Invoice  and Late Invoice
  const carInvoiceColumns = [
    {
      name: "Datum",
      selector: (row) => row.invoiceDate,
      sortable: true,
      cell: (row) => formattedDate(row.invoiceDate),
    },
    {
      name: "Kenteken",
      selector: (row) => row.kenteken,
      cell: (row) => formatKenteken(row.kenteken),
    },
    {
      name: "Auto details",
      selector: (row) => `${row.brandName}  ${row.modelName} ${row.carType}`,
      wrap: true,
    },
    { name: "Ontvanger", selector: (row) => row.ctCompanyName, wrap: true },
    { name: "Betaler", selector: (row) => row.dtCompanyName, wrap: true },
    { name: "Factuur", selector: (row) => row.invoiceNo, wrap: true },
    {
      name: "Bedrag",
      selector: (row) => row.totalValue,
      cell: (row) => `€${row.totalValue}`,
    },
  ];

  // Column name and row data for InvoiceService
  const serviceColumns = [
    {
      name: "Datum",
      selector: (row) => row.invoiceDate,
      cell: (row) => formattedDate(row.invoiceDate),
    },
    {
      name: "Kenteken",
      selector: (row) => row.kenteken,
      cell: (row) => formatKenteken(row.kenteken),
    },
    {
      name: "Auto details",
      selector: (row) => `${row.brandName}  ${row.modelName} ${row.carType}`,
      wrap: true,
    },
    { name: "Ontvanger", selector: (row) => row.ctCompanyName, wrap: true },
    { name: "Betaler", selector: (row) => row.dtCompanyName, wrap: true },
    { name: "Factuur", selector: (row) => row.invoiceNo },
    {
      name: "Bedrag",
      selector: (row) => row.totalValue,
      cell: (row) => `€${row.totalValue}`,
    },
  ];

  // Column name and row data for License Plate and Foreign Papers
  const lecensePlateColumns = [
    {
      name: "Verkoop",
      selector: (row) => row.saleDate,
      cell: (row) => formattedDate(row.saleDate),
    },
    {
      name: "Kenteken",
      selector: (row) => row.kenteken,
      cell: (row) => formatKenteken(row.kenteken),
    },
    {
      name: "Auto details",
      selector: (row) => `${row.brandName}  ${row.modelName} ${row.carType}`,
      wrap: true,
    },
    { name: "Workflow", selector: (row) => row.protocolCode, wrap: true },
    { name: "Verkoper", selector: (row) => row.ownerName, wrap: true },
    { name: "Koper", selector: (row) => row.buyerName, wrap: true },
  ];

  useEffect(() => {
    // Function to start AJAX request
    const fetchData = async () => {
      try {
        // Start of AJAX request
        setLoading(true);
        // Make the AJAX request
        getRequest({
          requesturl:
            getUrl() +
            `/CarStepSummary?userId=` +
            localStorage.getItem("UserId"),
        }).then((res) => {
          if (res.responseCode === 200) {
            setCarSummerRecord(res.model);
            setLoading(false);
          } else {
            setLoading(false);
            toast("Something went wrong");
          }
        });
      } catch (error) {
        // Handle errors
        setError(error);
        // Display toaster message for the error
        toast.error("Error fetching data from the server", {
          position: toast.POSITION.TOP_CENTER,
        });
        setLoading(false);
      }
    };

    // Call the function to start the AJAX request
    fetchData();
  }, []);

  // List for Car Invoice Total Record
  useEffect(() => {
    if (dialogVisible) {
      try {
        setpopUpLoading(true);

        getRequest({
          requesturl: getUrl() + `/CarInvoice/GetCarInvoice?IsCt=` + 0,
        })
          .then((res) => {
            setCarInvoice(res.list);
            setpopUpLoading(false);
          })
          .catch((error) => {
            setpopUpLoading(false);
            console.error("Error fetching data:", error);
            // Handle the error (e.g., show an error message)
          });
      } catch (error) {
        setpopUpLoading(false);
        console.error("An unexpected error occurred:", error);
        // Handle the unexpected error (e.g., show a generic error message)
      }
    }
  }, [dialogVisible]);

  //List for Car Invoice Late Record

  useEffect(() => {
    if (latedialogVisible) {
      try {
        setpopUpLoading(true);
        getRequest({
          requesturl: getUrl() + `/CarInvoice/GetCarInvoice?IsCt=` + 1,
        })
          .then((res) => {
            setLateCarInvoice(res.list);
            setpopUpLoading(false);
          })
          .catch((error) => {
            setpopUpLoading(false);
            console.error("Error fetching data:", error);
            // Handle the error (e.g., show an error message)
          });
      } catch (error) {
        setpopUpLoading(false);
        console.error("An unexpected error occurred:", error);
        // Handle the unexpected error (e.g., show a generic error message)
      }
    }
  }, [latedialogVisible]);

  //List for Service Invoice  Record

  useEffect(() => {
    if (servicedialogVisible) {
      try {
        setpopUpLoading(true);
        getRequest({
          requesturl: getUrl() + `/ServiceInvoice/GetServiceInvoice`,
        })
          .then((res) => {
            setServiceInvoice(res.list);
            setpopUpLoading(false);
          })
          .catch((error) => {
            setpopUpLoading(false);
            console.error("Error fetching data:", error);
            // Handle the error (e.g., show an error message)
          });
      } catch (error) {
        setpopUpLoading(false);
        console.error("An unexpected error occurred:", error);
        // Handle the unexpected error (e.g., show a generic error message)
      }
    }
  }, [servicedialogVisible]);

  //List for License Plate  Record

  useEffect(() => {
    if (licensePlatedialogVisible) {
      try {
        setpopUpLoading(true);
        getRequest({
          requesturl: getUrl() + `/LicencePlateData/GetLicencePlateData`,
        })
          .then((res) => {
            setlicensePlate(res.list);
            setpopUpLoading(false);
          })
          .catch((error) => {
            setpopUpLoading(false);
            console.error("Error fetching data:", error);
            // Handle the error (e.g., show an error message)
          });
      } catch (error) {
        setpopUpLoading(false);
        console.error("An unexpected error occurred:", error);
        // Handle the unexpected error (e.g., show a generic error message)
      }
    }
  }, [licensePlatedialogVisible]);

  //List for Foreign Paper  Record

  useEffect(() => {
    if (foreignPaperdialogVisible) {
      try {
        setpopUpLoading(true);
        getRequest({
          requesturl: getUrl() + `/LicencePlateData/GetForeignPaperData`,
        })
          .then((res) => {
            setforeignPaper(res.list);
            setpopUpLoading(false);
          })
          .catch((error) => {
            setpopUpLoading(false);
            console.error("Error fetching data:", error);
            // Handle the error (e.g., show an error message)
          });
      } catch (error) {
        setpopUpLoading(false);
        console.error("An unexpected error occurred:", error);
        // Handle the unexpected error (e.g., show a generic error message)
      }
    }
  }, [foreignPaperdialogVisible]);

  
  const handleOpenReadyForSaleInNewTab = (isToday) => {
    localStorage.setItem("isToday", isToday);

    //const url = `/readyForSale?IsToday=${encodeURIComponent(isToday)}`;
    window.open(`/readyForSale`, '_blank');
  };


  useEffect(() => {

      try {
        setpopUpLoading(true);
      getRequest({
        requesturl: getUrl() + `/CarStepSummary/SlotList`,
      })
        .then((res) => {
          setAuctionList(res.list);
        })
        .catch((error) => {

          console.error("Error fetching data:", error);
          // Handle the error (e.g., show an error message)
        });
    } catch (error) {
      setpopUpLoading(false);
      console.error("An unexpected error occurred:", error);
      // Handle the unexpected error (e.g., show a generic error message)
    }
  },[])
  




  useEffect(() => {

    try {

      getRequest({
        requesturl: getUrl() + `/CarStepSummary/GetBuyInfoList`,
      })
        .then((res) => {
          setBuyList(res.list);
        })
        .catch((error) => {

          console.error("Error fetching data:", error);
          // Handle the error (e.g., show an error message)
        });
    } catch (error) {
      setpopUpLoading(false);
      console.error("An unexpected error occurred:", error);
      // Handle the unexpected error (e.g., show a generic error message)
    }

  }, []);

  useEffect(() => {

    try {

      getRequest({
        requesturl: getUrl() + `/CarStepSummary/GetNewForSaleInfoList`,
      })
        .then((res) => {
          setNewForSaleList(res.list);
        })
        .catch((error) => {

          console.error("Error fetching data:", error);
          // Handle the error (e.g., show an error message)
        });
    } catch (error) {
      setpopUpLoading(false);
      console.error("An unexpected error occurred:", error);
      // Handle the unexpected error (e.g., show a generic error message)
    }

  }, []);


  // Get the current date
  const currentDate = new Date();
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const monthAbbreviation = currentDate.toLocaleString('default', { month: 'short' }).toUpperCase();
  const yearLastTwoDigits = currentDate.getFullYear().toString().slice(-2);
  const GetDateMonthForBuyer = `${currentDate.getDate().toString().padStart(2, '0')}-${months[currentDate.getMonth()]}`;
  const GetMonthYearForBuyer = `${monthAbbreviation}-${yearLastTwoDigits.toString().padStart(2, '0')}`;

  function formatDate(dateTimeString) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Parse the dateTimeString into a Date object
    const date = new Date(dateTimeString);

    // Get the day of the month
    const day = date.getDate();

    // Get the month abbreviation
    const monthAbbreviation = months[date.getMonth()];

    // Get the time (hours and minutes)
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Format the date and time
    const formattedDateTime = `${day}-${monthAbbreviation} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return formattedDateTime;
  }

  const formatMonthYrs = (inputDate) => {
    const date = new Date(inputDate);
    const month = date.toLocaleDateString('nl-NL', { month: 'short' });
    const year = date.getFullYear().toString().substr(2, 2); // Get the last two digits of the year
  
    return `${month}-${year}`;
  };
  function ConverToText(number) {
    return number === "True" ?"Automaat":"Handgeschakeld" ;
}

function metersToKilometers(distanceInMeters) {
  if (distanceInMeters < 1000) {
      return distanceInMeters + " km";
  }
  else {
      const distanceInKilometers = distanceInMeters / 1000;
      return distanceInKilometers.toFixed(2) + " km";
  }
}

  useEffect(() => {

    try {

      getRequest({
        requesturl: getUrl() + `/CarStepSummary/GetCounterSaleList`,
      })
        .then((res) => {
          setSoldOpenClose(res.list);
        })
        .catch((error) => {

          console.error("Error fetching data:", error);
          // Handle the error (e.g., show an error message)
        });
    } catch (error) {
      setpopUpLoading(false);
      console.error("An unexpected error occurred:", error);
      // Handle the unexpected error (e.g., show a generic error message)
    }

  }, []);
  useEffect(() => {

    try {

      getRequest({
        requesturl: getUrl() + `/CarStepSummary/GetCounterUserList`,
      })
        .then((res) => {
          setUniqueLogin(res.list);
        })
        .catch((error) => {

          console.error("Error fetching data:", error);
          // Handle the error (e.g., show an error message)
        });
    } catch (error) {
      setpopUpLoading(false);
      console.error("An unexpected error occurred:", error);
      // Handle the unexpected error (e.g., show a generic error message)
    }

  }, []);
  useEffect(() => {

    try {

      getRequest({
        requesturl: getUrl() + `/CarStepSummary/GetCounterBidderList`,
      })
        .then((res) => {
          setUniqueBidder(res.list);
        })
        .catch((error) => {

          console.error("Error fetching data:", error);
          // Handle the error (e.g., show an error message)
        });
    } catch (error) {
      setpopUpLoading(false);
      console.error("An unexpected error occurred:", error);
      // Handle the unexpected error (e.g., show a generic error message)
    }

  }, []);
  useEffect(() => {

    try {

      getRequest({
        requesturl: getUrl() + `/CarStepSummary/GetCounterBuyerList`,
      })
        .then((res) => {
          setUniqueBuyers(res.list);
        })
        .catch((error) => {

          console.error("Error fetching data:", error);
          // Handle the error (e.g., show an error message)
        });
    } catch (error) {
      setpopUpLoading(false);
      console.error("An unexpected error occurred:", error);
      // Handle the unexpected error (e.g., show a generic error message)
    }

  }, []);

  return (
    <React.Fragment>
      {loading ? (
        <DataLoader />
      ) : (
        <div className="conatiner-fluid content-inner mt-5 py-0">
          <div className="row">
            <div className="col-lg-8">

              <div className="card">
                <div className="card-header bg-soft-secondary py-3">
                  <h5 className="card-title">Transport</h5>
                </div>
                <div className="card-body">
                  <div className="iq-grid iq-indicator gap-4">
                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/Transport.Call_icon.png" alt="" title="Nabellen" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.transportCallBackTotalCount < 0
                              ? 0
                              : carSummerRecord.transportCallBackTotalCount}
                          </h6>

                          {carSummerRecord.transportCallBackLateCount !== 0 && (
                            <h6 className="heading-title fw-medium" style={{ color: "#e40613", cursor: "pointer" }}>
                              Te laat: {carSummerRecord.transportCallBackLateCount}
                            </h6>
                          )}
                          {carSummerRecord.transportCallBackTodayCount !== 0 && (
                            <h6 className="heading-title fw-medium" style={{ cursor: "pointer", cursor: "pointer" }}>
                              Vandaag: {carSummerRecord.transportCallBackTodayCount}
                            </h6>
                          )}

                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img
                            src="img/Transport.PutForPickup_icon.png"
                            alt=""
                            title="Wacht op klaarzetten"
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.transportWaitForSetupTotalCount < 0
                              ? 0
                              : carSummerRecord.transportWaitForSetupTotalCount}
                          </h6>
                          {carSummerRecord.transportWaitForSetupLateCount !== 0 && (
                            <h6 className="heading-title fw-medium" style={{ color: "#e40613", cursor: "pointer" }}>
                              Te laat: {carSummerRecord.transportWaitForSetupLateCount}
                            </h6>
                          )}
                          {carSummerRecord.transportWaitForSetupTodayCount !== 0 && (
                            <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                              Vandaag: {carSummerRecord.transportWaitForSetupTodayCount}
                            </h6>
                          )}

                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/Transport.Pickup_icon.png" title="Af te halen" alt="" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.transportPickUpTotalCount < 0
                              ? 0
                              : carSummerRecord.transportPickUpTotalCount}
                          </h6>
                          {carSummerRecord.transportPickUpLateCount !== 0 && (
                            <h6 className="heading-title fw-medium" style={{ color: "#e40613", cursor: "pointer" }}>
                              Te laat: {carSummerRecord.transportPickUpLateCount}
                            </h6>
                          )}
                          {carSummerRecord.transportPickUpTodayCount !== 0 && (
                            <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                              Vandaag: {carSummerRecord.transportPickUpTodayCount}
                            </h6>
                          )}

                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/Transport.Delivery_icon.png" title="Op transport" alt="" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.transportOnTransportTotalCount < 0
                              ? 0
                              : carSummerRecord.transportOnTransportTotalCount}
                          </h6>
                          {carSummerRecord.transportOnTransportLateCount !== 0 && (
                            <h6 className="heading-title fw-medium" style={{ color: "#e40613", cursor: "pointer" }}>
                              Te laat: {carSummerRecord.transportOnTransportLateCount}
                            </h6>
                          )}
                          {carSummerRecord.transportOnTransportTodayCount !== 0 && (
                            <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                              Vandaag: {carSummerRecord.transportOnTransportTodayCount}
                            </h6>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/Transport.Failed_icon.png" title="Fout transport" alt="" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.transportCancelTransportTotalCount <
                              0
                              ? 0
                              : carSummerRecord.transportCancelTransportTotalCount}
                          </h6>
                          {carSummerRecord.transportCancelTransportLateCount !== 0 && (
                            <h6 className="heading-title fw-medium" style={{ color: "#e40613", cursor: "pointer" }}>
                              Te laat: {carSummerRecord.transportCancelTransportLateCount}
                            </h6>
                          )}
                          {carSummerRecord.transportCancelTransportTodayCount !== 0 && (
                            <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                              Vandaag: {carSummerRecord.transportCancelTransportTodayCount}
                            </h6>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header bg-soft-secondary py-3">
                  <h5 className="card-title">
                    ToDo{" "}
                    <small className="ps-2">
                      <a href="" className="text-muted text-sm">
                        Alle locaties
                      </a>
                    </small>
                  </h5>
                </div>
                <div className="card-body">
                  <div className="iq-grid iq-indicator gap-4">
                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/entry_icon.png" title="Entry" alt="" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.toDoEntryTotalCount < 0
                              ? 0
                              : carSummerRecord.toDoEntryTotalCount}
                          </h6>
                          <h6
                            className="heading-title fw-medium"
                            style={{ color: "#e40613", cursor: "pointer" }}
                          >
                            Te laat:{" "}
                            {carSummerRecord.toDoEntryLateCount < 0
                              ? 0
                              : carSummerRecord.toDoEntryLateCount}
                          </h6>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/wash_icon.png" alt="" title="Wassen" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.toDoWashTotalCount < 0
                              ? 0
                              : carSummerRecord.toDoWashTotalCount}
                          </h6>
                          <h6
                            className="heading-title fw-medium"
                            style={{ color: "#e40613", cursor: "pointer" }}
                          >
                            Te laat:{" "}
                            {carSummerRecord.toDoWashLateCount < 0
                              ? 0
                              : carSummerRecord.toDoWashLateCount}
                          </h6>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/parallel_icon.png" title="Proces" alt="" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.toDoProcessTotalCount < 0
                              ? 0
                              : carSummerRecord.toDoProcessTotalCount}
                          </h6>
                          <h6
                            className="heading-title fw-medium"
                            style={{ color: "#e40613", cursor: "pointer" }}
                          >
                            Te laat:{" "}
                            {carSummerRecord.toDoProcessLateCount < 0
                              ? 0
                              : carSummerRecord.toDoProcessLateCount}
                          </h6>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/check_icon.png" title="Controle" alt="" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.toDoCheckTotalCount < 0
                              ? 0
                              : carSummerRecord.toDoCheckTotalCount}
                          </h6>
                          <h6
                            className="heading-title fw-medium"
                            style={{ color: "#e40613", cursor: "pointer" }}
                          >
                            Te laat:{" "}
                            {carSummerRecord.toDoCheckLateCount < 0
                              ? 0
                              : carSummerRecord.toDoCheckLateCount}
                          </h6>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/valuation_icon.png" title="Taxtie" alt="" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.toDoValuationTotalCount < 0
                              ? 0
                              : carSummerRecord.toDoValuationTotalCount}
                          </h6>
                          <h6
                            className="heading-title fw-medium"
                            style={{ color: "#e40613", cursor: "pointer" }}
                          >
                            Te laat:{" "}
                            {carSummerRecord.toDoValuationLateCount < 0
                              ? 0
                              : carSummerRecord.toDoValuationLateCount}
                          </h6>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/kentekencheck_icon.png" title="Kenteken gegevens" alt="" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.toDoLicensePlateDetailsTotalCount <
                              0
                              ? 0
                              : carSummerRecord.toDoLicensePlateDetailsTotalCount}
                          </h6>
                          <h6
                            className="heading-title fw-medium"
                            style={{ color: "#e40613", cursor: "pointer" }}
                          >
                            Te laat:{" "}
                            {carSummerRecord.toDoLicensePlateDetailsLateCount <
                              0
                              ? 0
                              : carSummerRecord.toDoLicensePlateDetailsLateCount}
                          </h6>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/finalcheck_icon.png" title="Finl check" alt="" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.toDoFinalCheckTotalCount < 0
                              ? 0
                              : carSummerRecord.toDoFinalCheckTotalCount}
                          </h6>
                          <h6
                            className="heading-title fw-medium"
                            style={{ color: "#e40613", cursor: "pointer" }}
                          >
                            Te laat:{" "}
                            {carSummerRecord.toDoFinalCheckLateCount < 0
                              ? 0
                              : carSummerRecord.toDoFinalCheckLateCount}
                          </h6>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/Memo.Action_icon.png" title="Acties" alt="" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.toDoActionsTotalCount < 0
                              ? 0
                              : carSummerRecord.toDoActionsTotalCount}
                          </h6>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/carservices_icon.png" title="Car services" alt="" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.toDoCarServicesTotalCount < 0
                              ? 0
                              : carSummerRecord.toDoCarServicesTotalCount}
                          </h6>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/Todo.Pending_icon.png" alt="" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.toDoOnHoldTotalCount < 0
                              ? 0
                              : carSummerRecord.toDoOnHoldTotalCount}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header bg-soft-secondary py-3">
                  <h5 className="card-title">Verkopen</h5>
                </div>
                <div className="card-body">
                  <div className="iq-grid iq-indicator gap-4">
                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img
                            src="img/Sale.Ready_icon.png"
                            alt=""
                            title="Sales Ready"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleOpenReadyForSaleInNewTab(0)}
                          />
                        </div>
                        <div className="ms-3">
                          <h6
                            className="heading-title fw-medium"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleOpenReadyForSaleInNewTab(0)}
                          >
                            Totaal:{" "}
                            {carSummerRecord.sellSalesReadyTotalCount < 0
                              ? 0
                              : carSummerRecord.sellSalesReadyTotalCount}
                          </h6>
                          {carSummerRecord.sellSalesReadyTodayCount == 0 && (
                            <h6
                              className="heading-title fw-medium"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleOpenReadyForSaleInNewTab(1)}
                            >
                              Vandaag :{" "} 
                              {carSummerRecord.sellSalesReadyTodayCount}
                            </h6>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/Sale.OnSale.Auction_icon.png" title="In verkoop" alt="" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>Totaal: 0</h6>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/Sale.OnSale.Tender_icon.png" title="In verkoop" alt="" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.sellOnSaleTotalCount < 0
                              ? 0
                              : carSummerRecord.sellOnSaleTotalCount}
                          </h6>
                          {carSummerRecord.sellOnSaleLateCount !== 0 && (
                            <h6 className="heading-title fw-medium" style={{ color: "#e40613", cursor: "pointer" }}>
                              Te laat: {carSummerRecord.sellOnSaleLateCount}
                            </h6>
                          )}
                          {carSummerRecord.sellOnSaleTodayCount !== 0 && (
                            <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                              Te laat: {carSummerRecord.sellOnSaleTodayCount}
                            </h6>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/Sale.Provisional_icon.png" title="Provisioneel" alt="" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.sellProvisionalTotalCount < 0
                              ? 0
                              : carSummerRecord.sellProvisionalTotalCount}
                          </h6>
                          {carSummerRecord.sellProvisionalLateCount !== 0 && (
                            <h6 className="heading-title fw-medium" style={{ color: "#e40613", cursor: "pointer" }}>
                              Te laat: {carSummerRecord.sellProvisionalLateCount}
                            </h6>
                          )}
                          {carSummerRecord.sellProvisionalTodayCount !== 0 && (
                            <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                              Te laat: {carSummerRecord.sellProvisionalTodayCount}
                            </h6>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header bg-soft-secondary py-3">
                  <h5 className="card-title">Kopen</h5>
                </div>
                <div className="card-body">
                  <div className="iq-grid iq-indicator gap-4">
                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/Sale.OnSale.Auction_icon.png" title="In verkoop" alt="" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>Totaal: 0</h6>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/Sale.OnSale.Tender_icon.png" style={{ cursor: "pointer" }} title="In verkoop" alt="" />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.buyOnSaleTotalCount < 0
                              ? 0
                              : carSummerRecord.buyOnSaleTotalCount}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header bg-soft-secondary py-3">
                  <h5 className="card-title">
                    <span className="grid">
                      <span className="g-col-3">Auto factuur</span>
                      <span className="g-col-3">Diensten factuur</span>
                      <span className="g-col-3">Kenteken gegevens</span>
                      <span className="g-col-3">Buitenlandse papieren</span>
                    </span>
                  </h5>
                </div>
                <div className="card-body">
                  <div className="iq-grid iq-indicator gap-4">
                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img
                            src="img/Invoice.Car_icon.png"
                            title="Auto factuur"
                            style={{ cursor: "pointer" }}
                            alt=""
                            // onClick={() => handleCarInvoiceInNewTab(0)}
                          />
                        </div>
                        <div className="ms-3">
                          <h6
                            className="heading-title fw-medium"
                            style={{ cursor: "pointer" }}
                            //onClick={() => handleCarInvoiceInNewTab(0)}
                          >
                            Totaal:{" "}
                            {carSummerRecord.carInvoiceTotalCount < 0
                              ? 0
                              : carSummerRecord.carInvoiceTotalCount}
                          </h6>
                          <h6
                            className="heading-title fw-medium"
                            //onClick={() => handleCarInvoiceInNewTab(1)}
                            style={{ color: "#e40613", cursor: "pointer" }}
                          >
                            Ta laat:{" "}
                            {carSummerRecord.carInvoiceLateCount < 0
                              ? 0
                              : carSummerRecord.carInvoiceLateCount}
                          </h6>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img
                            src="img/Invoice.Service_icon.png"
                            title="Diensten factuur"
                            style={{ cursor: "pointer" }}
                            alt=""
                            onClick={() => setServiceDialogVisible(true)}
                          />
                        </div>
                        <div className="ms-3">
                          <h6
                            className="heading-title fw-medium"
                            style={{ cursor: "pointer" }}
                            onClick={() => setServiceDialogVisible(true)}
                          >
                            Totaal:{" "}
                            {carSummerRecord.servicesInvoiceTotalCount < 0
                              ? 0
                              : carSummerRecord.servicesInvoiceTotalCount}
                          </h6>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img
                            src="img/Invoice.Papers_icon.png"
                            title="Kenteken gegevens"
                            style={{ cursor: "pointer" }}
                            alt=""
                            onClick={() => setlicensePlateDialogVisible(true)}
                          />
                        </div>
                        <div className="ms-3">
                          <h6
                            className="heading-title fw-medium"
                            style={{ cursor: "pointer" }}
                            onClick={() => setlicensePlateDialogVisible(true)}
                          >
                            Totaal:{" "}
                            {carSummerRecord.licensePlateDataTotalCount < 0
                              ? 0
                              : carSummerRecord.licensePlateDataTotalCount}
                          </h6>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img
                            src="img/Invoice.Papers_icon.png"
                            title="Buitenlandse papieren"
                            style={{ cursor: "pointer" }}
                            alt=""
                            onClick={() => setforeignPaperDialogVisible(true)}
                          />
                        </div>
                        <div className="ms-3">
                          <h6
                            className="heading-title fw-medium"
                            style={{ cursor: "pointer" }}
                            onClick={() => setforeignPaperDialogVisible(true)}
                          >
                            Totaal:{" "}
                            {carSummerRecord.foreignPapersTotalCount < 0
                              ? 0
                              : carSummerRecord.foreignPapersTotalCount}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header bg-soft-secondary py-3">
                  <h5 className="card-title">Eind aflevering</h5>
                </div>
                <div className="card-body">
                  <div className="iq-grid iq-indicator gap-4">
                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/Todo.Pending_icon.png" title="wacht op vrijgave" alt="" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.finalDeliveryWaitingForReleaseTotalCount <
                              0
                              ? 0
                              : carSummerRecord.finalDeliveryWaitingForReleaseTotalCount}
                          </h6>
                          <h6
                            className="heading-title fw-medium"
                            style={{ color: "#e40613", cursor: "pointer" }}
                          >
                            Ta laat:{" "}
                            {carSummerRecord.finalDeliveryWaitingForReleaseLateCount <
                              0
                              ? 0
                              : carSummerRecord.finalDeliveryWaitingForReleaseLateCount}
                          </h6>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img
                            src="img/Transport.PutForPickup_icon.png"
                            title="Wacht op klaarzetten"
                            style={{ cursor: "pointer" }}
                            alt=""
                          />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.finalDeliveryWaitForSetupTotalCount <
                              0
                              ? 0
                              : carSummerRecord.finalDeliveryWaitForSetupTotalCount}
                          </h6>
                          <h6
                            className="heading-title fw-medium"
                            style={{ color: "#e40613", cursor: "pointer" }}
                          >
                            Ta laat:{" "}
                            {carSummerRecord.finalDeliveryWaitForSetupLateCount <
                              0
                              ? 0
                              : carSummerRecord.finalDeliveryWaitForSetupLateCount}
                          </h6>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/Transport.Pickup_icon.png" title="Af te halen" alt="" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:
                            {carSummerRecord.finalDeliveryPickUpTotalCount < 0
                              ? 0
                              : carSummerRecord.finalDeliveryPickUpTotalCount}
                          </h6>
                          <h6
                            className="heading-title fw-medium"
                            style={{ color: "#e40613", cursor: "pointer" }}
                          >
                            Ta laat:{" "}
                            {carSummerRecord.finalDeliveryPickUpLateCount < 0
                              ? 0
                              : carSummerRecord.finalDeliveryPickUpLateCount}
                          </h6>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img src="img/Transport.Delivery_icon.png" title="Op transport" alt="" style={{ cursor: "pointer" }} />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.finalDeliveryOnTransportTotalCount <
                              0
                              ? 0
                              : carSummerRecord.finalDeliveryOnTransportTotalCount}
                          </h6>
                          <h6
                            className="heading-title fw-medium"
                            style={{ color: "#e40613", cursor: "pointer" }}

                          >
                            Ta laat:{" "}
                            {carSummerRecord.finalDeliveryOnTransportLateCount <
                              0
                              ? 0
                              : carSummerRecord.finalDeliveryOnTransportLateCount}
                          </h6>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 shadow-sm bg-gray">
                      <div className="d-flex align-items-center">
                        <div>
                          <img
                            src="img/Transport.Failed_icon.png"
                            title="Fout transport"
                            style={{ cursor: "pointer" }}
                            alt="" />
                        </div>
                        <div className="ms-3">
                          <h6 className="heading-title fw-medium" style={{ cursor: "pointer" }}>
                            Totaal:{" "}
                            {carSummerRecord.finalDeliveryCancelTransportTotalCount <
                              0
                              ? 0
                              : carSummerRecord.finalDeliveryCancelTransportTotalCount}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>







            </div>

            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h5>Veilingen</h5>
                </div>
                <div className="card-body">
                  <div className="border" style={{ paddingLeft: "10px" }}>

                    {auctionList.map((auction,index) => (
                      
                      (auction.slotTypeId === 3) && (<div key={index} className="d-flex align-items-center  py-3">
                        {auction.slotLogoPath && (
                          <img
                            src={"img/" + auction.slotLogoPath.replace("CompanyLogo\\", "")}
                            style={{ width: "25px" }}
                            alt=""
                          />
                        )}
                        <h6 style={{ marginLeft: "7px", cursor:"pointer" }}>
                          {auction.slotName}({auction.slotCarCount})
                        </h6>

                      </div>)
                    
                    ))}
                    {auctionList.map((auction,index) => (
                      
                      (auction.slotTypeId === 1) && (<div key={index} className="d-flex align-items-center  py-3">
                        {auction.slotLogoPath && (
                          <img
                            src={"img/" + auction.slotLogoPath.replace("CompanyLogo\\", "")}
                            style={{ width: "25px" }}
                            alt=""
                          />
                        )}
                        <h6 style={{ marginLeft: "7px", cursor:"pointer" }}>
                          <span>{auction.slotName}</span><br />
                          {formatDate(auction.slotDateTime)}
                        </h6><br></br>

                      </div>)
                      ))}
                    {auctionList.map((auction,index) => (
                      
                      (auction.slotTypeId === 4) && (<div key={index} className="d-flex align-items-center  py-3">
                        {auction.slotLogoPath && (
                          <img
                            src={"img/" + auction.slotLogoPath.replace("CompanyLogo\\", "")}
                            style={{ width: "25px" }}
                            alt=""
                          />
                        )}
                        <h6 style={{ marginLeft: "7px", cursor:"pointer" }}>
                          <span>{auction.slotName}</span><br />
                          {formatDate(auction.slotDateTime)}
                        </h6>

                      </div>)
                    ))}
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <h5>Marketing informatie</h5>
                </div>
                <div className="card-body">
                  <div className="border" style={{ paddingLeft: "10px" }}>
                    <div className="d-flex align-items-center  py-3">
                      <div className="bd-example table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col"></th>
                              <th scope="col">{GetDateMonthForBuyer}</th>
                              <th scope="col">{GetMonthYearForBuyer}</th>
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <h5>Nieuw in verkoop</h5>
                </div>
                <div className="card-body">
                  <div className="border">
                    <div className="d-flex align-items-center py-3">
                      <div className="bd-example table-responsive">
                        <table className="table">
                          <tbody>
                            {
                              newForSaleList.map((saleList,index) => (
                                <tr key={index}>
                                  <td style={{textAlign:"center"}}>
                                  {saleList.carImagePath && (
                                      <img
                                        src="img/Car1.jpg"
                                        //src={"img/" + saleList.carImagePath.replace("CompanyLogo\\", "")}
                                        style={{ width: "100px", height:"80px" }}
                                        alt=""
                                      />
                                    )}<br/>
                                    <span title={formatKenteken(saleList.kenteken)} style={{ cursor: "pointer" }}>{formatKenteken(saleList.kenteken)}</span>
                                    
                                    </td>
                                  <td>
                                    <h6><b>{saleList.brandName} {saleList.modelName} {saleList.carType}</b></h6>
                                    
                                    {saleList.isAutomatic != null && (ConverToText(saleList.isAutomatic))}{saleList.isAutomatic !=null? ', ':''}{formatMonthYrs(saleList.firstRegDate)}{saleList.dashboardMileage!=null ?', ':''}{saleList.dashboardMileage != null && metersToKilometers(saleList.dashboardMileage)}
                                    <br />

                                    {saleList.slotLogoPath && (
                                      <img
                                        title="Afschrijving 43352"
                                        src={"img/" + saleList.slotLogoPath.replace("CompanyLogo\\", "")}
                                        style={{ width: "25px", cursor:"pointer" }}
                                        alt=""
                                      />
                                    )}
                                    <span style={{cursor:"pointer" }} title="Afschrijving 43352">{formatDate(saleList.slotDateTime)}</span>
                                    
                                  </td>
                                </tr>
                              ))
                            }
                            {/* <tr>
                              
                              <td style={{textAlign:"center"}}>
                              <img
                                  src="img/5822837_B1.a8990a372f2e4665ae1f4543ec43c23c_thumb.jpg"
                                  style={{ width: "100px", height:"80px" }}
                                  alt=""
                                />
                                <br/>
                                15-NK-DR
                                </td>
                              <td>
                                <h6>Seat ALHAMBRA 1.8-20VT Signo</h6>
                                <br />
                                Automatic, Oct-03, 159,741 km
                                <br />
                                <img
                                  src="img/Auction1.jpg"
                                  style={{ width: "25px" }}
                                  alt=""
                                />
                                04-Apr 00:00
                              </td>
                            </tr>
                            <tr>
                              <td><img
                                  src="img/5822837_B1.a8990a372f2e4665ae1f4543ec43c23c_thumb.jpg"
                                  style={{ width: "60px", height:"80px" }}
                                  alt=""
                                />
                                <br/>1-ASD-02</td>
                              <td>
                                <h6>A.M.C. Eagle asdfsad</h6>
                                <br />
                                Oct-08
                                <br />
                                <img
                                  src="img/Auction1.jpg"
                                  style={{ width: "25px" }}
                                  alt=""
                                />
                                04-Oct 00:00
                              </td>
                            </tr>
                            <tr>
                              <td>EN-08-10</td>
                              <td>
                                <h6>BMW 3-SERIE BMW3</h6>
                                <br />
                                Apr-20, 8,000 km
                                <br />
                                <img
                                  src="img/Auction1.jpg"
                                  style={{ width: "25px" }}
                                  alt=""
                                />
                                08-Apr 00:00
                              </td>
                            </tr>
                            <tr>
                              <td>21-NZK-8</td>
                              <td>
                                <h6>Mazda 2 1.3 XS</h6>
                                <br />
                                Dec-10, 0 km
                                <br />
                                <img
                                  src="img/Auction1.jpg"
                                  style={{ width: "25px" }}
                                  alt=""
                                />
                                31-Mar 00:00
                              </td>
                            </tr> */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <h5>Koop</h5>
                </div>
                <div className="card-body">
                  <div className="border" style={{ paddingLeft: "10px" }}>
                    <div className="d-flex align-items-center py-3">
                      <div className="bd-example table-responsive">
                        <table className="table rightAlign">
                          <tbody >
                            <tr>
                              <td>
                                <img
                                  src="img/Buy1.jpg"
                                  title="Klik hier voor details"
                                  style={{ width: "25px", margin: "5px", cursor: "pointer" }}
                                  alt=""
                                />
                                <span title="Klik hier voor details"
                                  style={{ cursor: "pointer", ':hover': { color: 'red' } }}>
                                  Pay
                                </span>
                              </td>
                              <td>{buyList[0].countIN}</td>
                              <td>{buyList[0].amountIN}</td>
                            </tr>
                            <tr>
                              <td>
                                <img
                                  src="img/Buy2.jpg"
                                  title="Klik hier voor details"
                                  style={{ width: "25px", margin: "5px", cursor: "pointer" }}
                                  alt=""
                                />
                                <span
                                  title="Klik hier voor details"
                                  style={{ cursor: "pointer" }}>
                                  Provisional
                                </span>
                              </td>
                              <td>{buyList[0].countPB}</td>
                              <td>{buyList[0].amountPB}</td>
                            </tr>
                            <tr>
                              <td>
                                <img
                                  src="img/Buy3.jpg"
                                  title="Klik hier voor details"
                                  style={{ width: "25px", margin: "5px", cursor: "pointer" }}
                                  alt=""
                                />
                                <span
                                  title="Klik hier voor details"
                                  style={{ cursor: "pointer" }}>
                                  Highest Bid
                                </span>
                              </td>
                              <td>{buyList[0].countHB}</td>
                              <td>{buyList[0].amountHB}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {dialogVisible && (
        <div className="card">
          <Dialog
            visible={dialogVisible}
            style={{ width: "75vw", backgroundColor: "white", height: "500px" }}
            maximizable
            modal
            contentStyle={{ height: "300px" }}
            onHide={() => setDialogVisible(false)}
            footer={dialogFooterTemplate}
          >
            {popUpLoading ? (
              <DataLoader />
            ) : (
              <DataTable
                title="Betalingen"
                columns={carInvoiceColumns}
                data={carInvoice}
                pagination // Enable pagination
                paginationPerPage={5} // Number of items per page
                paginationRowsPerPageOptions={[5, 10, 15]} // Options for items per page
                tableStyle={{ minWidth: '50rem' }}
              />
            )}
          </Dialog>
        </div>
      )}

      {latedialogVisible && (
        <div className="card">
          <Dialog
            visible={latedialogVisible}
            style={{ width: "75vw", backgroundColor: "white", height: "500px" }}
            maximizable
            modal
            contentStyle={{ height: "300px" }}
            onHide={() => setLateDialogVisible(false)}
            footer={latedialogFooterTemplate}
          >
            {popUpLoading ? (
              <DataLoader />
            ) : (
              <DataTable
                title="Betalingen"
                columns={carInvoiceColumns}
                data={lateCarInvoice}
                pagination // Enable pagination
                paginationPerPage={5} // Number of items per page
                paginationRowsPerPageOptions={[5, 10, 15]} // Options for items per page
              />
            )}
          </Dialog>
        </div>
      )}

      {servicedialogVisible && (
        <div className="card">
          <Dialog
            visible={servicedialogVisible}
            style={{ width: "75vw", backgroundColor: "white", height: "500px" }}
            maximizable
            modal
            contentStyle={{ height: "300px" }}
            onHide={() => setServiceDialogVisible(false)}
            footer={servicedialogFooterTemplate}
          >
            {popUpLoading ? (
              <DataLoader />
            ) : (
              <DataTable
                title="Kentekencards"
                columns={serviceColumns}
                data={serviInvoice}
                pagination // Enable pagination
                paginationPerPage={5} // Number of items per page
                paginationRowsPerPageOptions={[5, 10, 15]} // Options for items per page
              />
            )}
          </Dialog>
        </div>
      )}

      {licensePlatedialogVisible && (
        <div className="card">
          <Dialog
            visible={licensePlatedialogVisible}
            style={{ width: "75vw", backgroundColor: "white", height: "500px" }}
            maximizable
            modal
            contentStyle={{ height: "300px" }}
            onHide={() => setlicensePlateDialogVisible(false)}
            footer={licensePlatedialogFooterTemplate}
          >
            {popUpLoading ? (
              <DataLoader />
            ) : (
              <DataTable
                title="Kentekencards"
                columns={lecensePlateColumns}
                data={licensePlate}
                pagination // Enable pagination
                paginationPerPage={5} // Number of items per page
                paginationRowsPerPageOptions={[5, 10, 15]} // Options for items per page
              />
            )}
          </Dialog>
        </div>
      )}

      {foreignPaperdialogVisible && (
        <div className="card">
          <Dialog
            visible={foreignPaperdialogVisible}
            style={{ width: "75vw", backgroundColor: "white", height: "500px" }}
            maximizable
            modal
            contentStyle={{ height: "300px" }}
            onHide={() => setforeignPaperDialogVisible(false)}
            footer={foreignPaperdialogFooterTemplate}
          >
            {popUpLoading ? (
              <DataLoader />
            ) : (
              <DataTable
                title="License plate cards"
                columns={lecensePlateColumns}
                data={foreignPaper}
                pagination // Enable pagination
                paginationPerPage={5} // Number of items per page
                paginationRowsPerPageOptions={[5, 10, 15]} // Options for items per page
              />
            )}
          </Dialog>
        </div>
      )}
      <ToastContainer />
    </React.Fragment>
  );
}