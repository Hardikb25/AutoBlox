import * as React from "react";
import { useState, useEffect } from "react";
import DataLoader from "../Loader";
import { getRequest,postRequest } from "../ApiCalls";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx"
import { getUrl } from "../ApiCalls";
import { useParams } from "react-router";
import CONSTANT from "../Global";



function CarInvoice(props) {
    
    const [loading, setLoading] = useState(false);
    const [carInvoiceList, setcarInvoiceList] = useState([]);
    const [ownerData, setOwnerData] = useState([]);
    const [processes, setProcessesData] = useState([]);
    const [interneAccountmanage, setInterneAccountmanage] = useState([]);
    const [carlocationData, setCarlocationData] = useState([]);
    const [SearchBy, setSearchBy] = React.useState(null);
    const [StorageOwnerID, setStorageOwnerID] = useState(-1);
    const [StorageProcessesID,setStorageProcessesID]=useState(-1);
    const [StorageGAccMrID,setStorageGAccMrID]=useState("-1");
    const [StorageCarLocationID,setStorageCarLocationID]=useState("-1");
    


    const { parameter } = useParams();
    // Code for Kenteken formate

    const isLetter = (c) => /^[A-Za-z]$/.test(c);
    const isDigit = (c) => /^[0-9]$/.test(c);

    const formatKenteken = (kenteken) => {
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
    };
    const handleChange = (event) => {
        // setLoading(true)
        // setSearchBy(event.target.value);
        // getRequest({
        //     requesturl: getUrl() + `/Sell/GetSaleReady?searchBy=`+event.target.value,
        // })
        //     .then((res) => {
        //         setcarInvoiceList(res.list);
        //         setLoading(false)
        //     })
      }

      const handlefilterSearch = () => {
          console.log(StorageOwnerID)
          console.log(StorageGAccMrID + "agmr")
          GetCarInvoiceList();
        
    }
    
    const handleClearSearch=()=>{
        setSearchBy("")
        setStorageOwnerID(-1);
        setStorageProcessesID(-1);
        setStorageGAccMrID(-1);
        setStorageCarLocationID(-1)
        GetOwnerList();
        GetGAccMrList();
        GetCarLocationList();
        GetProcessesList();
    }

    // List for SaleReady Total Record
    React.useEffect(() => {
        setLoading(true)
        GetOwnerList();
        GetProcessesList();
        GetGAccMrList();
        GetCarLocationList();
        GetCarInvoiceList();


    },[]);
    const GetCarInvoiceList=()=>{
        const searchParams = new URLSearchParams(window.location.search);
        const param = searchParams.get('IsCt');
        let data = {
            SearchBy:SearchBy,
            StorageOwnerID:StorageOwnerID,
            StorageProcessesID:StorageProcessesID,
            StorageGAccMrID:StorageGAccMrID,
            StorageCarLocationID:StorageCarLocationID
          };
        getRequest({
            requesturl: getUrl() + `/CarInvoice/GetCarInvoice?IsCt=` + param
        })
            .then((res) => {
                console.log(StorageOwnerID)
                setcarInvoiceList(res.list);
                setLoading(false);

            })
    }

    const GetOwnerList=()=>{
        getRequest({
            requesturl: getUrl() + `/Sell/GetOwnerDropDownList`,
        }).then((res) => {
            if (res) {
                setOwnerData(res.list);
            }
        });
    }

    const GetGAccMrList=()=>{
        getRequest({
            requesturl: getUrl() + `/Sell/GetInternal_Account_Manager_DropDownList`,
        }).then((res) => {
            if (res) {
                setInterneAccountmanage(res.list);
            }
        });
    }

    const GetProcessesList=()=>{
        getRequest({
            requesturl: getUrl() + `/Sell/GetProcessesDropDownList`,
        }).then((res) => {
            if (res) {
                setProcessesData(res.list);
            }
        });
    }
    const GetCarLocationList=()=>{
        getRequest({
            requesturl: getUrl() + `/Sell/GetCarLocatinDDList?AccMgrId=`+StorageGAccMrID,
        }).then((res) => {
            if (res) {
                setCarlocationData(res.list);
            }
        });
    }
    
    
    const formatFirstRegDate = (dateString) => {
        const date = new Date(dateString);
        const monthAbbreviation = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear().toString().substr(-2);
        return `${monthAbbreviation}-${year}`;
    };

    function metersToKilometers(distanceInMeters) {
        if (distanceInMeters < 1000) {
            return distanceInMeters + " km";
        }
        else {
            const distanceInKilometers = distanceInMeters / 1000;
            return distanceInKilometers.toFixed(2) + " km";
        }


    }
    function ConverToText(number) {
        return number === "True" ? "Handgeschakeld" : "Automaat";
    }
    // Function for date formate
  const formattedDate = (props) => {
    const originalDate = new Date(props);
    const options = { day: "numeric", month: "short", year: "numeric" };
    const rdate = originalDate.toLocaleDateString("nl-NL", options);
    return rdate;
  };
    const carInvoiceColumns = [
        {
            name: "Datum",
            selector: (row) => row.invoiceDate,
            cell: (row) => formattedDate(row.invoiceDate),
            sortable: true,
        },
        {
            name: "Kenteken",
            selector: (row) => row.kenteken,
            cell: (row) => formatKenteken(row.kenteken),
          },
        {
            name: "Auto details",
            selector: (row) => (
                <span>
                    <b>{row.brandName} {row.modelName} {row.carType}</b>
                </span>
            ),
            sortable: true,
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

    const exportToExcel = async () => {

        const data1 = carInvoiceList;
        const headers = Object.keys(data1[0]);

        const dataArray = [headers]; // Initialize with headers as first row
        data1.forEach(item => {
            const row = Object.values(item).map(value => {
                // Remove <br/> and <b></b> tags
                return typeof value === 'string' ? value.replace(/<br\>/g, ' ').replace(/<b>/g, '').replace(/<\/b>/g, '') : value;


            });
            dataArray.push(row);
        });

        const ws = XLSX.utils.aoa_to_sheet(dataArray);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'Ready for sale.xlsx');
    }
    return (
        <React.Fragment>
            <div className="conatiner-fluid content-inner mt-5 py-0">

                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Betalingen</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="/dashboard">Dashboard</a>
                                </li>
                                <li className="breadcrumb-item active">	Betalingen </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="student-group-form">
                    <div className="row">
                        <div className="col-lg-3 col-md-4">
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by Kenteken ..."
                                    value={SearchBy}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-3">
                        <div className="card">
                            <div className="card-header">
                                <h5>Filters</h5>
                            </div>
                            <div className="card-body">

                                <div className="form-group">
                                    <label className="form-label" ><b>Eigenaar</b></label>
                                    <select value={StorageOwnerID} className="form-select form-control choicesjs" onChange={e=>setStorageOwnerID(e.target.value)} >
                                        <option value={-1}>Alle eigenaren</option>
                                        {ownerData.length > 0 ? (
                                            ownerData.map((result) => (<option value={result.companyId}>{result.companyName}</option>))
                                        ) : (<></>)}
                                    </select>

                                </div>
                                <div className="form-group">
                                    <label className="form-label" ><b>Processen</b></label>
                                    <select value={StorageProcessesID} className="form-select form-control choicesjs" onChange={e => setStorageProcessesID(e.target.value)} >
                                        <option value={-1}>Alle processen</option>
                                        <option value={CONSTANT.ADMIN_COMAPNY_ID}>BCAADM processen</option>
                                        <option value={1}>Overige processen</option>

                                        {/* {processes.length > 0 ? (
                                            processes.map((result) => (<option value={result.ddValue}>{result.ddText}</option>))
                                        ) : (<></>)} */}

                                    </select>

                                </div>
                                <div className="form-group">
                                    <label className="form-label" ><b>Interne accountmanager</b></label>
                                    <select value={StorageGAccMrID} className="form-select form-control choicesjs" onChange={e => setStorageGAccMrID(e.target.value)} >
                                        <option value={-1}></option>
                                        {interneAccountmanage.length > 0 ? (
                                            interneAccountmanage.map((result) => (<option value={result.userId}>{result.userFullName}</option>))
                                        ) : (<></>)}
                                    </select>

                                </div>
                                <div className="form-group">
                                    <label className="form-label" ><b>Locatie</b></label>
                                    <select value={StorageCarLocationID} className="form-select form-control choicesjs" onChange={e => setStorageCarLocationID(e.target.value)} >
                                        <option value={-1}></option>
                                        {carlocationData.length > 0 ? (
                                            carlocationData.map((result) => (<option value={result.storageId}>{result.locationName}</option>))
                                        ) : (<></>)}
                                    </select>

                                </div>


                                <div className="d-flex align-items-center justify-content-center">
                                    {/* <button type="button" className="btn btn-primary mt-3" onClick={handlefilterSearch}>Filter</button> */}
                                    <button type="button" className="btn btn-soft-secondary  mt-3 ms-3" onClick={handleClearSearch}>Clear</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-9">
                        <div className="card card-table">
                            <div className="card-body">
                                <div className="page-header">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h3 className="page-title">Betalingen</h3>
                                        </div>
                                        <div className="col-auto text-end float-end ms-auto download-grp">
                                            <a href="#" className="btn btn-outline-primary me-2" onClick={exportToExcel}>
                                                <i className="fas fa-file-excel"></i> Excel download
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                {
                                    loading ?(
                                        <DataLoader />
                                                  ):(
                                                     <div className="table-responsive">
                                                     <DataTable
                 
                                                         columns={carInvoiceColumns}
                                                         data={carInvoiceList}
                                                         pagination // Enable pagination
                                                         paginationPerPage={5} // Number of items per page
                                                         paginationRowsPerPageOptions={[5, 10, 15]} // Options for items per page
                                                         customStyles={{
                                                             headCells: {
                                                                 style: {
                                                                     fontWeight: 'bold',
                                                                     fontFamily: 'Sans-serif',
                                                                     fontSize: "15px"
                                                                 },
                                                             },
                                                         }}
                                                     />
                                                 </div>
                                                  )
                                }
                               



                            </div>
                        </div>
                    </div>


                </div>

            </div>

        </React.Fragment>

    );
}
export default CarInvoice;