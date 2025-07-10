import * as React from "react";
import { useState, useEffect, useRef } from "react";
import DataLoader from "../Loader";
import { getRequest, postRequest } from "../ApiCalls";
import DataTable, { Alignment } from "react-data-table-component";
import * as XLSX from "xlsx"
import { getUrl } from "../ApiCalls";
import { event } from "jquery";
import List from "../List/List.js";
import CONSTANT from "../Global";
import "../components.css";
import GridView from "../List/GridView";
import Pagination from "../List/Pager";
import { Navigate, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";


function ReadyForSale(props) {
  const history = useNavigate();
  const [isLoadingExcel, setisLoadingExcel] = useState(false);
  const [readyForSaleList, setReadyForSaleList] = useState([]);
  const [ownerData, setOwnerData] = useState([]);
  const [processes, setProcessesData] = useState([]);
  const [interneAccountmanage, setInterneAccountmanage] = useState([]);
  const [carlocationData, setCarlocationData] = useState([]);
  const [SearchBy, setSearchBy] = React.useState('');
  const [StorageOwnerID, setStorageOwnerID] = useState(-1);
  const [StorageProcessesID, setStorageProcessesID] = useState(-1);
  const [StorageGAccMrID, setStorageGAccMrID] = useState("-1");
  const [StorageCarLocationID, setStorageCarLocationID] = useState(-1);
  const [currentPage, setCurrentPage] = React.useState(1);

  const pageNumberLimit = CONSTANT.PAGENUMBERLIMIT;
  const pagination = CONSTANT.PAGINATION;
  const [lastClick, setLastClick] = React.useState(null);

  const [maxPageLimit, setMaxPageLimit] = React.useState(pagination);
  const [minPageLimit, setMinPageLimit] = React.useState(0);
  const [StartIndex, setStartIndex] = React.useState(
    (currentPage - 1) * maxPageLimit
  );
  const [EndIndex, setEndIndex] = React.useState(
    (currentPage - 1) * maxPageLimit + (maxPageLimit - 1)
  );
  const [SortColumn, setSortColumn] = React.useState("Kenteken");
  const [SortingOrder, setSortingOrder] = React.useState("desc");
  const [TotalRecords, setTotalRecords] = React.useState(0);
  const [isListView, setListView] = React.useState(true);
  const [Pagechange, setPagechange] = React.useState(true);
  const isFirstRender = useRef(true);
  //let IsToday = window.location.href.split('=')[1]; 

  const IsToday = localStorage.getItem('isToday');
  const [LastPageReaminNo, setLastPageReaminNo] = React.useState(0);
  const changeView = (View) => {
    if (View == "gridView") {
      setListView(false);
    }
    else {
      setListView(true);
    }
  };
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [filteredArray, setFilteredArray] = React.useState([]);










  const listViewRef = React.useRef(null);
  const lastTriggeredPageRef = React.useRef(currentPage);
  React.useEffect(() => {
    lastTriggeredPageRef.current = currentPage;
  }, [currentPage]);

  const handleScroll = () => {
    const currentRec = listViewRef.current.querySelector(".table-responsive")
    if (currentRec) {
      const { scrollTop, scrollHeight, clientHeight } = currentRec;

      const roundedScrollTop = Math.round(scrollTop + clientHeight);
      const roundedScrollHeight = Math.round(scrollHeight);

      if (roundedScrollTop >= roundedScrollHeight - 1) {
        let pagecount = TotalRecords < maxPageLimit ? 1 : Math.ceil(TotalRecords / pageNumberLimit)
        if (currentPage === lastTriggeredPageRef.current) {
          lastTriggeredPageRef.current += 1;
          if (currentPage < pagecount) {
            onNextClick();
          }
        }
      }
    }
  };

  React.useEffect(() => {
    if (isFirstRender.current) {
      // Skip the effect for the first render
      isFirstRender.current = false;
      return;
    }
    else {
      const timer = setTimeout(() => {
        const table = document.querySelector('.table');
        const thead = table.querySelector('thead');
        const thElements = thead.querySelectorAll('th');
        const tbody = table.querySelector('tbody');
        const tdRows = tbody.querySelectorAll('tr');

        // Placeholder to avoid layout jerking
        const placeholder = document.createElement('div');
        thead.parentNode.insertBefore(placeholder, thead);

        // Function to sync widths between <th> and corresponding <td>
        function syncColumnWidths() {
          const thWidths = Array.from(thElements).map(th => th.offsetWidth + 'px');
          // Set the width for each <th>
          thElements.forEach((th, index) => {
            th.style.width = thWidths[index];
          });

          // Ensure <td> cells in each row also match the <th> width
          tdRows.forEach(row => {
            const tdElements = row.querySelectorAll('td');
            tdElements.forEach((td, index) => {
              td.style.width = thWidths[index];
            });
          });

          // Set the height of the placeholder to match the thead height
          placeholder.style.height = `${thead.offsetHeight}px`;
        }

        // Function to handle scrolling and make the <thead> sticky
        function handleScrollbar() {
          const rect = table.getBoundingClientRect();
          if (rect.top <= 0) {
            syncColumnWidths(); // Sync column widths before fixing the <thead>
            thead.classList.add('fixed');
            thead.style.width = `${table.offsetWidth}px`; // Ensure the <thead> has the correct width
            placeholder.style.display = 'block'; // Show the placeholder to avoid jerking
          } else {
            thead.classList.remove('fixed');
            thead.style.width = ''; // Reset the width
            placeholder.style.display = 'none'; // Hide the placeholder
          }
        }
        syncColumnWidths()
        handleScrollbar()
      }, 0);
    }
  }, [Pagechange])
  const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    return function () {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  };

  React.useEffect(() => {
    const currentRef = listViewRef.current.querySelector(".table-responsive");
    if (currentRef && !isLoadingExcel) {
      currentRef.addEventListener('scroll', throttle(handleScroll, 200));
    }

    return () => {
      if (currentRef && !isLoadingExcel) {
        currentRef.removeEventListener('scroll', throttle(handleScroll, 200));
      }
    };
  }, [isLoadingExcel, handleScroll]);

  let tmpSearchBy = '';

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchBy(inputValue);
    if (inputValue === '') {
      handleClearSearch();
    }
    else if (inputValue !== "") {
      //handleKentekenSearch()
      setCurrentPage(1);
      setisLoadingExcel(true);
      setMaxPageLimit(pagination);
      setMinPageLimit(0);
      GetSalesList('', '', inputValue);
    }
  };

  const handleKentekenSearch = (event) => {
    setCurrentPage(1);
    setisLoadingExcel(true);
    setMaxPageLimit(pagination);
    setMinPageLimit(0);
    tmpSearchBy = SearchBy;
    setisLoadingExcel(true);
    GetSalesList('', '', tmpSearchBy);
  }

  const handleClearSearch = () => {
    setSearchBy('');
    setStorageOwnerID(-1);
    setStorageProcessesID(-1);
    setTimeout(() => {
      // setisLoadingExcel(true);
      setStorageGAccMrID("-1");
      // setisLoadingExcel(false);
    }, 1000);
    setStorageCarLocationID(-1);
    setisLoadingExcel(true);
    GetOwnerList();
    GetGAccMrList();
    GetCarLocationList();
    GetProcessesList();
    setisLoadingExcel(true);
    GetSalesList('', '', tmpSearchBy);
  }

  const onPrevClick = () => {
    if (lastClick > 0) {
      if (lastClick === 1) {
        if (Number.isInteger(maxPageLimit / pagination) !== true) {
          setMaxPageLimit(maxPageLimit - (Math.ceil(TotalRecords / pageNumberLimit) % pagination));
        }
        else {
          setMaxPageLimit(maxPageLimit - ((Math.ceil(TotalRecords / pageNumberLimit) % pagination)) - LastPageReaminNo);

        }
        setMinPageLimit(minPageLimit - pagination)
      }
      setLastClick(lastClick - 1);
    }
    else if ((currentPage - 1) % pagination === 0) {
      setMaxPageLimit(maxPageLimit - pagination);
      setMinPageLimit(minPageLimit - pagination);

    }
    setCurrentPage((prev) => prev - 1);
  };

  const onNextClick = () => {
    if (currentPage + 1 > maxPageLimit) {
      setMaxPageLimit(maxPageLimit + pagination);
      setMinPageLimit(minPageLimit + pagination);
    }
    setCurrentPage((prev) => prev + 1);
  };
  const onFirstClick = () => {
    setCurrentPage(1);
    setMaxPageLimit(pagination);
    setMinPageLimit(0);
  };

  const onLastClick = () => {
    setCurrentPage(Math.ceil(TotalRecords / pageNumberLimit));
    setMaxPageLimit(Math.ceil(TotalRecords / pageNumberLimit));
    let tempmaxlimit = 0;
    if (Math.ceil(TotalRecords / pageNumberLimit) % pagination === 0) {
      tempmaxlimit = Math.ceil(TotalRecords / pageNumberLimit) - pagination;
      setMinPageLimit(tempmaxlimit);
    }
    else {
      tempmaxlimit = Math.ceil(TotalRecords / pageNumberLimit) - (Math.ceil(TotalRecords / pageNumberLimit) % pagination);
      setMinPageLimit(tempmaxlimit);
    }
    setLastPageReaminNo((tempmaxlimit + pagination) - (Math.ceil(TotalRecords / pageNumberLimit)));
    setLastClick(Math.ceil(TotalRecords / pageNumberLimit) % pagination);
  };

  const onPageChange = (pageNumber) => {
    setLastClick(pageNumber - minPageLimit);
    setCurrentPage(pageNumber);
  };
  // const onPageChange = (pageNumber) => {
  //     setCurrentPage(pageNumber);
  // };

  const onOrderChange = (columnname, order) => {
    setSortColumn(columnname);
    setSortingOrder(order);
    handleSorting(columnname, order);
  };

  const handleSorting = (sortField, sortOrder) => {
    if (sortField) {
      setSortingOrder(sortOrder);
      setisLoadingExcel(true);
      tmpSearchBy = SearchBy;
      GetSalesList(sortField, sortOrder, tmpSearchBy);
    }
  };

  // List for SaleReady Total Record
  React.useEffect(() => {
    setisLoadingExcel(true);
    GetOwnerList();
    GetProcessesList();
    GetGAccMrList();
    GetCarLocationList();
    tmpSearchBy = SearchBy;
    GetSalesList('', '', tmpSearchBy);
  }, [StorageOwnerID, StorageProcessesID, StorageGAccMrID, StorageCarLocationID, currentPage]);

  const GetSalesList = (sortField = '', sortOrder = '', tmpSearchBy = '') => {
    console.log("CHeck is today:" + IsToday);
    let data = {
        AdminCompanyID: CONSTANT.ADMIN_COMAPNY_ID,
      OwnerCompanyID: -1,
      OwnerID: StorageOwnerID,
      IsToday: IsToday !== null ? IsToday : 0,
      ProcessAdminID: StorageProcessesID,
      SearchBy: tmpSearchBy !== "" ? tmpSearchBy.replace(/[-\s]/g, '') : tmpSearchBy,
      AccMgrID: StorageGAccMrID,
      PreliminarySlotID: 0,
      StorageID: StorageCarLocationID,
      Location: "-1",
      IsFilterLocationFilterNeeded: true,
      PageNumber: currentPage,
      PageSize: pageNumberLimit,
      SortField: sortField ? sortField : SortColumn,
      SortOrder: sortOrder ? sortOrder : SortingOrder
    };
    postRequest({
      requesturl: getUrl() + `/Sell/GetSaleReady`,
      formData: data,
    })
      .then((res) => {
        if (res.status == 401) {
          history("/");
        }
        else {
          console.log(StorageOwnerID)
          console.log(IsToday + "isok")
          setReadyForSaleList(res.data.list);
          setisLoadingExcel(false);
          setPagechange(!Pagechange)
          setTotalRecords(res.data.totalItems);
          setStartIndex((currentPage - 1) * pageNumberLimit);
          let endind = (currentPage - 1) * pageNumberLimit + (pageNumberLimit - 1);
          setEndIndex(
            endind + 1 > res.data.totalItems ? res.data.totalItems - 1 : endind
          );
        }
      })
  }
  console.log("StartIndex " + StartIndex)
  const paginationAttributes = {
    currentPage,
    maxPageLimit,
    minPageLimit,
    StartIndex,
    EndIndex,
    TotalRecords,
    SortColumn,
    SortingOrder,
    onPrevClick: onPrevClick,
    onNextClick: onNextClick,
    onPageChange: onPageChange,
    onOrderChange: onOrderChange,
  };

  const GetOwnerList = () => {
    getRequest({
      requesturl: getUrl() + `/Sell/GetOwnerDropDownList`,
    }).then((res) => {
      if (res.status == 401) {
        history("/");
      }
      else if (res) {
        setOwnerData(res.list);
      }
    });
  }

  const GetGAccMrList = () => {
    getRequest({
      requesturl: getUrl() + `/Sell/GetInternal_Account_Manager_DropDownList`,
    }).then((res) => {
      if (res.status == 401) {
        history("/");
      }
      else if (res) {
        setInterneAccountmanage(res.list);
      }
    });
  }

  const GetProcessesList = () => {
    getRequest({
      requesturl: getUrl() + `/Sell/GetProcessesDropDownList`,
    }).then((res) => {
      if (res.status == 401) {
        history("/");
      }
      else if (res) {
        setProcessesData(res.list);
      }
    });
  }
  const GetCarLocationList = () => {
    getRequest({
      requesturl: getUrl() + `/Sell/GetCarLocatinDDList?AccMgrId=` + StorageGAccMrID + `&OwnerId=` + StorageOwnerID,
    }).then((res) => {
      if (res.status == 401) {
        history("/");
      }
      else if (res) {
        setCarlocationData(res.list);
      }
    });
  }

  const column = [
    { heading: "Kenteken", value: "kenteken", ishtml: 0, isanchortag: 0, doNotApplySorting: 0, isGridView: 1, isChecked: 1 },
    //{ heading: "Kenteken", value: "kenteken", ishtml: 0, isanchortag: 0, doNotApplySorting: 0 },
    // { heading: "Auto details", value: "sort_CarDetails", ishtml: 0, isanchortag: 0, doNotApplySorting: 0, iskentaken: 1 },
    { heading: "Auto details", value: "sort_CarDetails", ishtml: 1, isanchortag: 0, doNotApplySorting: 0, iskentaken: 1, isGridViewAutodetails: 1, isGridView: 1, isChecked: 1 },
    { heading: "gridKenteken", value: "kenteken", ishtml: 0, isanchortag: 0, doNotApplySorting: 0, isGridViewKentaken: 1, isGridView: 1, isDisabled: 1, },
    { heading: "Eigenaar", value: "ownerName", ishtml: 0, isanchortag: 0, doNotApplySorting: 0, isGridView: 0, isChecked: 1 },
    { heading: "Accm", value: "accMgrInitials", ishtml: 0, isanchortag: 0, doNotApplySorting: 0, isGridView: 0, isChecked: 1 },
    { heading: "Slots", value: "saleRetryCount", ishtml: 0, isanchortag: 0, doNotApplySorting: 0, isGridView: 0, isChecked: 1 },
    { heading: "Dagen", value: "stepDays", ishtml: 0, isanchortag: 0, doNotApplySorting: 0, isGridView: 0, isChecked: 1 },
    { heading: "Limiet", value: "priceLimit", ishtml: 1, isanchortag: 0, doNotApplySorting: 0, currency: "€", isGridView: 0, isChecked: 1 },
    { heading: "Taxatie", value: "carValue", ishtml: 1, isanchortag: 0, doNotApplySorting: 0, currency: "€", isGridView: 0, isChecked: 1 },
    // { heading: "Bod", value: "carHighestBid", ishtml: 1, isanchortag: 0, doNotApplySorting: 0, currency: "€", isGridView: 0 }
  ];

  // Function to open and close popup
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const filteredColumns = column.filter(col => col.heading !== 'gridKenteken');

  const checkboxOptions = filteredColumns.map((column, index) => ({
    id: index + 1, // Assign an id for each option
    label: column.heading // Use the heading value as the label
  }));

  // Set default checked based on `ischecked === 1`
  const [selectedOptions, setSelectedOptions] = useState(
    column.filter(col => col.isChecked === 1).map(col => col.heading)
  );
  const handleCheckboxChange = (id) => {
    setSelectedOptions((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };
  const filterArrays = () => {
    const result = [];
    for (let i = 0; i < column.length; i++) {
      const item = column[i];
      if (selectedOptions.includes(item.heading)) {
        result.push(item); // Add item to result if value matches
      }
    }
    setFilteredArray(result);
    togglePopup();
  }

  // const exportToExcel = async () => {

  //   const data1 = readyForSaleList;
  //   const headers = Object.keys(data1[0]);

  //   const dataArray = [headers]; // Initialize with headers as first row
  //   data1.forEach(item => {
  //     const row = Object.values(item).map(value => {
  //       // Remove <br/> and <b></b> tags
  //       return typeof value === 'string' ? value.replace(/<br\>/g, ' ').replace(/<b>/g, '').replace(/<\/b>/g, '') : value;


  //     });
  //     dataArray.push(row);
  //   });

  //   const ws = XLSX.utils.aoa_to_sheet(dataArray);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //   XLSX.writeFile(wb, 'Ready for sale.xlsx');
  // }
  return (
    <React.Fragment>

      <div className="conatiner-fluid content-inner mt-5 py-0">
        {/* <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Mijn auto's</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">Mijn auto's</li>
              </ul>
            </div>
          </div>
        </div> */}

        {/* <div className="student-group-form">
          <div className="row">
            <div className="col-lg-3 col-md-4">
              <div className="form-group d_flex">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Kenteken ..."
                  value={SearchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                />
                <img
                  className="search_width cursor"
                  onClick={handleKentekenSearch}
                  src="../img/Search.png"
                />
              </div>
            </div>
          </div>
        </div> */}

        {/* <div className="container text-center mb-15">
                    <p className="mb-0">Ophalen RDW bedrijfsvoorraad (bron: VWE) tarief pm € 0,00</p>
                    <p className="mb-0">Last update: 02 - 02 - 2024 06:34:13</p>
                </div> */}
        <section className="midSec">
          <div className="container">
            <div className="row align-items-start">
              <div className="col-9">
                <div className="border border-primary rounded-2 pa-15 mb-15">
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-1">
                    <h2 className="mb-0">
                      Items {(StartIndex + 1).toLocaleString("nl")} tot{" "}
                      {(EndIndex + 1).toLocaleString("nl")} van{" "}
                      {TotalRecords.toLocaleString("nl")}
                    </h2>
                    <div className="actionIcons d-flex align-items-center">

                      <button className={+ isListView ? "w-20px h-20px bg-white text-primary border-0 p-0 d-inline-flex flex-center rounded-1 me-8px listGridbtn active" : "w-20px h-20px bg-white text-primary border-0 p-0 d-inline-flex flex-center rounded-1 me-8px listGridbtn "} data-target="#listView" onClick={() => changeView('listView')} title="List">
                        <svg width="15" height="8" viewBox="0 0 15 8" fill="none">
                          <path d="M3.69507 1.5V0H14.6951V1.5H3.69507ZM3.69507 4.75V3.25H14.6951V4.75H3.69507ZM3.69507 8V6.5H14.6951V8H3.69507ZM1.44507 1.5C1.25062 1.5 1.07701 1.42361 0.924235 1.27083C0.771457 1.11806 0.695068 0.940972 0.695068 0.739583C0.695068 0.538194 0.771457 0.364583 0.924235 0.21875C1.07701 0.0729167 1.2541 0 1.45549 0C1.65687 0 1.83048 0.0718745 1.97632 0.215624C2.12215 0.359375 2.19507 0.5375 2.19507 0.75C2.19507 0.944444 2.12319 1.11806 1.97944 1.27083C1.83569 1.42361 1.65757 1.5 1.44507 1.5ZM1.44507 4.75C1.25062 4.75 1.07701 4.67361 0.924235 4.52083C0.771457 4.36806 0.695068 4.19097 0.695068 3.98958C0.695068 3.78819 0.771457 3.61458 0.924235 3.46875C1.07701 3.32292 1.2541 3.25 1.45549 3.25C1.65687 3.25 1.83048 3.32188 1.97632 3.46563C2.12215 3.60938 2.19507 3.7875 2.19507 4C2.19507 4.19444 2.12319 4.36806 1.97944 4.52083C1.83569 4.67361 1.65757 4.75 1.44507 4.75ZM1.44507 8C1.25062 8 1.07701 7.92361 0.924235 7.77083C0.771457 7.61806 0.695068 7.44097 0.695068 7.23958C0.695068 7.03819 0.771457 6.86458 0.924235 6.71875C1.07701 6.57292 1.2541 6.5 1.45549 6.5C1.65687 6.5 1.83048 6.57188 1.97632 6.71563C2.12215 6.85938 2.19507 7.0375 2.19507 7.25C2.19507 7.44444 2.12319 7.61806 1.97944 7.77083C1.83569 7.92361 1.65757 8 1.44507 8Z" fill="currentcolor" />
                        </svg>
                      </button>

                      <button className={isListView ? "w-20px h-20px bg-white text-primary border-0 p-0 d-inline-flex flex-center rounded-1 me-8px listGridbtn " : "w-20px h-20px bg-white text-primary border-0 p-0 d-inline-flex flex-center rounded-1 me-8px listGridbtn active"} data-target="#gridView" onClick={() => changeView('gridView')} title="Grid">
                        <svg width="15" height="14" viewBox="0 0 15 14" fill="none">
                          <path d="M0.695068 6V0H6.69507V6H0.695068ZM0.695068 14V8H6.69507V14H0.695068ZM8.69507 6V0H14.6951V6H8.69507ZM8.69507 14V8H14.6951V14H8.69507ZM2.19507 4.5H5.19507V1.5H2.19507V4.5ZM10.1951 4.5H13.1951V1.5H10.1951V4.5ZM10.1951 12.5H13.1951V9.5H10.1951V12.5ZM2.19507 12.5H5.19507V9.5H2.19507V12.5Z" fill="currentcolor" />
                        </svg>
                      </button>

                      {/* <button className="w-20px h-20px bg-white border-0 p-0 d-inline-flex flex-center rounded-1 me-8px" onClick={exportToExcel}>
                                                <img src="images/excel.png" alt="" height="20" />
                                            </button> */}

                      <button className="w-20px h-20px bg-white text-primary border-0 p-0 d-inline-flex flex-center rounded-1 me-8px" title="Print">
                        <svg width="17" height="14" viewBox="0 0 17 14" fill="none">
                          <path d="M12.1951 4V1.5H5.19507V4H3.69507V0H13.6951V4H12.1951ZM13.4407 7.5C13.6519 7.5 13.8305 7.42855 13.9763 7.28565C14.1222 7.14273 14.1951 6.96565 14.1951 6.7544C14.1951 6.54313 14.1236 6.36458 13.9807 6.21875C13.8378 6.07292 13.6607 6 13.4495 6C13.2382 6 13.0597 6.07145 12.9138 6.21435C12.768 6.35727 12.6951 6.53435 12.6951 6.7456C12.6951 6.95687 12.7665 7.13542 12.9094 7.28125C13.0523 7.42708 13.2294 7.5 13.4407 7.5ZM12.1951 12.5V9.5H5.19507V12.5H12.1951ZM13.6951 14H3.69507V11H0.695068V6C0.695068 5.44444 0.889513 4.97222 1.2784 4.58333C1.66729 4.19444 2.13951 4 2.69507 4H14.6951C15.2506 4 15.7228 4.19444 16.1117 4.58333C16.5006 4.97222 16.6951 5.44444 16.6951 6V11H13.6951V14ZM15.2159 9.5V6.2985C15.2159 6.07172 15.1326 5.88194 14.9659 5.72917C14.7992 5.57639 14.6048 5.5 14.3826 5.5H2.98674C2.76243 5.5 2.57441 5.57667 2.42267 5.73C2.27094 5.88333 2.19507 6.07333 2.19507 6.3V9.5H3.69507V8H13.6951V9.5H15.2159Z" fill="currentcolor" />
                        </svg>
                      </button>

                      {
                        isListView === true ? (<button onClick={togglePopup} className="w-20px h-20px bg-white text-primary border-0 p-0 d-inline-flex flex-center rounded-1 me-8px" title="Sorting">
                          <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
                            <path d="M2.19507 12V7H0.695068V5.5H5.2159V7H3.69507V12H2.19507ZM2.19507 4V0H3.69507V4H2.19507ZM5.44507 4V2.5H6.94507V0H8.44507V2.5H9.94507V4H5.44507ZM6.94507 12V5.5H8.44507V12H6.94507ZM11.6951 12V9.5H10.1742V8H14.6951V9.5H13.1951V12H11.6951ZM11.6951 6.5V0H13.1951V6.5H11.6951Z" fill="currentcolor" />
                          </svg>
                        </button>) : (<button onClick={togglePopup} disabled={true} className="w-20px h-20px bg-white text-primary border-0 p-0 d-inline-flex flex-center rounded-1 me-8px" title="Sorting">
                          <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
                            <path d="M2.19507 12V7H0.695068V5.5H5.2159V7H3.69507V12H2.19507ZM2.19507 4V0H3.69507V4H2.19507ZM5.44507 4V2.5H6.94507V0H8.44507V2.5H9.94507V4H5.44507ZM6.94507 12V5.5H8.44507V12H6.94507ZM11.6951 12V9.5H10.1742V8H14.6951V9.5H13.1951V12H11.6951ZM11.6951 6.5V0H13.1951V6.5H11.6951Z" fill="currentcolor" />
                          </svg>
                        </button>)

                      }


                      <button onClick={handleClearSearch} className="w-20px h-20px bg-white text-primary border-0 p-0 d-inline-flex flex-center rounded-1" title="Refresh">
                        <svg width="13" height="12" viewBox="0 0 13 12" fill="none">
                          <path d="M6.69507 12C5.0284 12 3.61174 11.4167 2.44507 10.25C1.2784 9.08333 0.695068 7.66667 0.695068 6C0.695068 4.33333 1.2784 2.91667 2.44507 1.75C3.61174 0.583333 5.0284 0 6.69507 0C7.59785 0 8.43465 0.1875 9.20549 0.5625C9.97632 0.9375 10.6395 1.4375 11.1951 2.0625V0H12.6951V5H7.69507V3.5H10.4242C10.0215 2.88889 9.49368 2.40278 8.8409 2.04167C8.18812 1.68056 7.47285 1.5 6.69507 1.5C5.44507 1.5 4.38257 1.9375 3.50757 2.8125C2.63257 3.6875 2.19507 4.75 2.19507 6C2.19507 7.25 2.63257 8.3125 3.50757 9.1875C4.38257 10.0625 5.44507 10.5 6.69507 10.5C7.86174 10.5 8.86174 10.1146 9.69507 9.34375C10.5284 8.57292 11.0076 7.625 11.1326 6.5H12.6742C12.5492 8.05556 11.9173 9.36111 10.7784 10.4167C9.63951 11.4722 8.2784 12 6.69507 12Z" fill="currentcolor" />
                        </svg>
                      </button>

                    </div>
                  </div>
                  {TotalRecords > 0 ? (
                    <Pagination
                      currentPage={currentPage}
                      maxPageLimit={maxPageLimit}
                      minPageLimit={minPageLimit}
                      totalPages={
                        TotalRecords < maxPageLimit
                          ? 1
                          : Math.ceil(TotalRecords / pageNumberLimit)
                      }
                      totalRecords={TotalRecords}
                      startIndex={StartIndex}
                      endIndex={EndIndex}
                      onPrevClick={onPrevClick}
                      onNextClick={onNextClick}
                      onPageChange={onPageChange}
                      onFirstClick={onFirstClick}
                      onLastClick={onLastClick}
                    />
                  ) : (
                    <></>
                  )}
                  <div className="listGridbox">
                    <div className={isListView ? "listView mb-5" : "listView d-none mb-5"} id="listView" ref={listViewRef}>
                      {isLoadingExcel ? (
                        <React.Fragment>
                          <DataLoader isExportExcel={isLoadingExcel} />
                        </React.Fragment>
                      ) : (
                        <List
                          //column={filteredArray}

                          column={filteredArray.length === 0 ? column : filteredArray}
                          data={readyForSaleList}
                          {...paginationAttributes}
                        />
                      )}
                    </div>
                    <div className={isListView ? "gridView mb-5 d-none" : "gridView mb-5"} id="gridView">
                      {isLoadingExcel ? (
                        <React.Fragment>
                          <DataLoader isExportExcel={isLoadingExcel} />
                        </React.Fragment>
                      ) : (
                        <GridView column={column}
                          data={readyForSaleList}
                          {...paginationAttributes}
                        />
                      )}
                    </div>

                    {TotalRecords > 0 ? (
                      <Pagination
                        currentPage={currentPage}
                        maxPageLimit={maxPageLimit}
                        minPageLimit={minPageLimit}
                        totalPages={
                          TotalRecords < maxPageLimit
                            ? 1
                            : Math.ceil(TotalRecords / pageNumberLimit)
                        }
                        totalRecords={TotalRecords}
                        startIndex={StartIndex}
                        endIndex={EndIndex}
                        onPrevClick={onPrevClick}
                        onNextClick={onNextClick}
                        onPageChange={onPageChange}
                        onFirstClick={onFirstClick}
                        onLastClick={onLastClick}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-3 position-sticky top-0">
                <div className="bg-lightgray pa-15 pb-30 rounded-2 mb-15">
                  <h2 className="mb-3">Filter</h2>

                  <div className="searchBox carSearch rounded-1 d-flex position-relative mb-22">
                    <input type="search" className="flex-fill" value={SearchBy}
                      onChange={(e) => setSearchBy(e.target.value)}
                    // onKeyPress={handleKeyPress}
                    //onChange={handleInputChange}
                    />
                    <button className="searchIcon" onClick={handleKentekenSearch}></button>
                  </div>
                  <div className="mb-30">
                    <div className="chkBox d-flex">
                      <img
                        className="mb-0"
                        src="img/btn.List.jpg"
                        alt=""
                      />
                      <h3 className="mb-0" style={{ marginLeft: "5px", textDecoration: "underline" }}>Eigenaar</h3>
                    </div>
                  </div>
                  <div className="mb-30">
                    <div className="chkBox d-flex">
                      <img
                        className="mb-0"
                        src="img/btn.List.jpg"
                        alt=""
                      />
                      <h3 className="mb-0" style={{ marginLeft: "5px", textDecoration: "underline" }}>Veilingindeling</h3>
                    </div>
                  </div>
                  {/* <div className="mb-30">
                                        <h3 className="mb-0">Snelfilter</h3>
                                        <div className="chkBox d-flex">
                                            <input type="checkbox" id="chk-1" />
                                            <label for="chk-1" className="para">Bedrijfsvoorraad</label>
                                        </div>
                                        <div className="chkBox d-flex">
                                            <input type="checkbox" id="chk-2" />
                                            <label for="chk-2" className="para">Onder handen</label>
                                        </div>
                                    </div>
                                    <div className="mb-30">
                                        <h3 className="mb-0">Voorraad status</h3>
                                        <div className="chkBox d-flex">
                                            <input type="checkbox" id="chk-3" />
                                            <label for="chk-3" className="para">Niet op bedrijfsvoorraad</label>
                                        </div>
                                        <div className="chkBox d-flex">
                                            <input type="checkbox" id="chk-4" />
                                            <label for="chk-4" className="para">Op bedrijfsvoorrad</label>
                                        </div>
                                        <div className="chkBox d-flex">
                                            <input type="checkbox" id="chk-5" />
                                            <label for="chk-5" className="para">Niet gedefinieerd</label>
                                        </div>
                                    </div>
                                    <div className="mb-30">
                                        <h3 className="mb-0">Voorraad beheerder</h3>
                                        <div className="chkBox d-flex">
                                            <input type="checkbox" id="chk-6" />
                                            <label for="chk-6" className="para">RDW</label>
                                        </div>
                                        <div className="chkBox d-flex">
                                            <input type="checkbox" id="chk-7" />
                                            <label for="chk-7" className="para">Niet gedefinieerd</label>
                                        </div>
                                    </div>
                                    <div className="mb-30">
                                        <h3 className="mb-0">Stadagen</h3>
                                        <div className="chkBox d-flex">
                                            <input type="checkbox" id="chk-8" />
                                            <label for="chk-8" className="para">0..60</label>
                                        </div>
                                        <div className="chkBox d-flex">
                                            <input type="checkbox" id="chk-9" />
                                            <label for="chk-9" className="para">Niet gedefinieerd</label>
                                        </div>
                                    </div>
                                    <div className="mb-30">
                                        <h3 className="mb-0">Prodes status</h3>
                                        <div className="chkBox d-flex">
                                            <input type="checkbox" id="chk-10" />
                                            <label for="chk-10" className="para">In proces</label>
                                        </div>
                                        <div className="chkBox d-flex">
                                            <input type="checkbox" id="chk-11" />
                                            <label for="chk-11" className="para">In verkoop</label>
                                        </div>
                                        <div className="chkBox d-flex">
                                            <input type="checkbox" id="chk-12" />
                                            <label for="chk-12" className="para">In afhandeling/facturatie</label>
                                        </div>
                                    </div>
                                    <div className="mb-30">
                                        <h3 className="mb-0">Afgehandeld</h3>
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="para min-w-30px pe-1">van</span>
                                            <input type="text" className="flex-fill form-control border-white me-8px datepicker" />
                                            <button className="border-0 p-0 bg-transparent h-25px d-inline-flex align-items-center">
                                                <img src="images/close.png" alt="" width="10" height="10" />
                                            </button>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <span className="para min-w-30px pe-1">tot</span>
                                            <input type="text" className="flex-fill form-control border-white me-8px datepicker" />
                                            <button className="border-0 p-0 bg-transparent h-25px d-inline-flex align-items-center">
                                                <img src="images/close.png" alt="" width="10" height="10" />
                                            </button>
                                        </div>
                                    </div> */}
                  <div className="mb-30">
                    <h3 className="mb-1">Eigenaar</h3>
                    <select name="" value={StorageOwnerID} id="" className="form-control border-white" onChange={e => setStorageOwnerID(e.target.value)}>
                      <option value={-1}>Alle eigenaren</option>
                      {ownerData.length > 0 ? (
                        ownerData.map((result, index) => (<option key={index} value={result.companyId}>{result.companyName}</option>))
                      ) : (<></>)}
                    </select>
                  </div>
                  <div className="mb-30">
                    <h3 className="mb-1">Processen</h3>
                    <select name="" id="" value={StorageProcessesID} className="form-control border-white" onChange={e => setStorageProcessesID(e.target.value)}>
                      <option value={-1}>Alle processen</option>
                                          <option value={CONSTANT.ADMIN_COMAPNY_ID}>BCAADM processen</option>
                      <option value={1}>Overige processen</option>
                    </select>
                  </div>
                  <div className="mb-30">
                    <h3 className="mb-1">Interne accountmanager</h3>
                    <select name="" id="" value={StorageGAccMrID} className="form-control border-white" onChange={e => setStorageGAccMrID(e.target.value)}>
                      <option value={-1}>Alle accountmanager</option>
                      {interneAccountmanage.length > 0 ? (
                        interneAccountmanage.map((result, index) => (<option key={index} value={result.userId}>{result.userFullName}</option>))
                      ) : (<></>)}
                    </select>
                  </div>
                  <div className="mb-30">
                    <h3 className="mb-1">Locatie</h3>
                    <select name="" id="" value={StorageCarLocationID} className="form-control border-white" onChange={e => setStorageCarLocationID(e.target.value)}>
                      <option value={-1}>Alle Locatie</option>
                      {carlocationData.length > 0 ? (
                        carlocationData.map((result, index) => (<option key={index} value={result.storageId}>{result.locationName}</option>))
                      ) : (<></>)}
                    </select>
                  </div>
                  {/* <div className="mb-30">
                                        <h3 className="mb-0">Ext. bron</h3>
                                        <div className="chkBox d-flex">
                                            <input type="checkbox" id="chk-17" />
                                            <label for="chk-17" className="para">Niet gedefinieerd</label>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="mb-0">Ext. status</h3>
                                        <div className="chkBox d-flex">
                                            <input type="checkbox" id="chk-18" />
                                            <label for="chk-18" className="para">Niet gedefinieerd</label>
                                        </div>
                                    </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <div className="row">
          <div className="col-sm-3">
            <div className="card">
              <div className="card-header">
                <h5>Filters</h5>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">
                    <b>Voorraad status</b>
                  </label>
                  {stockstatatusoptions.length > 0 ? (
                    stockstatatusoptions.map((item) => (
                      <li
                        style={{ textDecoration: "none", listStyle: "none" }}
                        key={item.stockStatus}
                      >
                        <label>
                          <input
                            type="checkbox"
                            checked={item.stockStatus === StockStatus}
                            onChange={() =>
                              handleStockStatusCheckboxChange(item.stockStatus)
                            }
                          />
                          <span style={{ marginLeft: "5px" }}>
                            {item.stockStatusName}
                          </span>
                        </label>
                      </li>
                    ))
                  ) : (
                    <></>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <b>Voorraad beheerder</b>
                  </label>
                  {stockmanagers.length > 0 ? (
                    stockmanagers.map((item) => (
                      <li
                        style={{ textDecoration: "none", listStyle: "none" }}
                        key={item.stockStatusControllerCompanyId}
                      >
                        <label>
                          <input
                            type="checkbox"
                            checked={
                              item.stockStatusControllerCompanyId ===
                              StockControllerCompanyId
                            }
                            onChange={() =>
                              handleStockManagerCheckboxChange(
                                item.stockStatusControllerCompanyId
                              )
                            }
                          />
                          <span style={{ marginLeft: "5px" }}>
                            {item.stockStatusControllerCompanyName}
                          </span>
                        </label>
                      </li>
                    ))
                  ) : (
                    <></>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <b>Locatie</b>
                  </label>
                  <select
                    value={StorageID}
                    className="form-select form-control choicesjs"
                    onChange={(e) =>
                      handleStorageLocationChange(e.target.value)
                    }
                  >
                    <option title={-1} value={-1}>
                      Alle
                    </option>
                    {locations.length > 0 ? (
                      locations.map((result) => (
                        <option value={result.carLocationId}>
                          {result.carLocationName}
                        </option>
                      ))
                    ) : (
                      <></>
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <b>Eigenaar</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Eigenaar ..."
                    id="vendorId"
                    value={VendorCode}
                    onChange={(e) => setVendorCode(e.target.value)}
                  />
                </div>

                <div className="d-flex align-items-center justify-content-center">
                  <button
                    type="button"
                    className="btn btn-primary mt-3"
                    onClick={handlefilterSearch}
                  >
                    Filter
                  </button>
                  <button
                    type="button"
                    className="btn btn-soft-secondary  mt-3 ms-3"
                    onClick={handleClearSearch}
                  >
                    Clear
                  </button>
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
                      <h3 className="page-title">Mijn auto's</h3>
                    </div>
                    <div className="col-auto text-end float-end ms-auto download-grp">
                      <a
                        href="#"
                        className="btn btn-outline-primary me-2"
                        onClick={exportToExcel}
                      >
                        <i className="fas fa-file-excel"></i> Excel download
                      </a>
                    </div>
                  </div>
                </div>
                {isLoading ? (
                  <React.Fragment>
                    <DataLoader />
                  </React.Fragment>
                ) : (
                  <div className="table-responsive">
                    <List
                      column={column}
                      data={cars}
                      {...paginationAttributes}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div> */}
      </div>











      {/* <div className="conatiner-fluid content-inner mt-5 py-0">

                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Verkoopgereed </h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="/dashboard">Dashboard</a>
                                </li>
                                <li className="breadcrumb-item active">	Verkoopgereed  </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="student-group-form">
                    <div className="row">
                        <div className="col-lg-3 col-md-4">
                            <div className="form-group d_flex">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by Kenteken ..."
                                    value={SearchBy}
                                    onChange={e => setSearchBy(e.target.value)}
                                />
                                <img className="search_width cursor" onClick={handleKentekenSearch} src="../img/Search.png" />
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
                                    <label className="form-label" style={{ cursor: "pointer" }}>
                                        <img
                                            src="img/btn.List.jpg"
                                            alt=""

                                        /><b style={{ marginLeft: "5px", textDecoration: "underline" }}>Eigenaar</b>
                                        <style>{`
                                        label:hover {
                                            color: red;
                                        }
                                         `}</style></label>
                                    <label className="form-label" style={{ cursor: "pointer", float: "right" }}>
                                        <img
                                            src="img/btn.List.jpg"
                                            alt=""

                                        /><b style={{ marginLeft: "5px", textDecoration: "underline" }}>Veilingindeling</b>
                                        <style>{`
                                        label:hover {
                                            color: red;
                                        }
                                         `}</style></label>

                                </div>

                                <div className="form-group">
                                    <label className="form-label" ><b>Eigenaar</b></label>
                                    <select value={StorageOwnerID} className="form-select form-control choicesjs" onChange={e => setStorageOwnerID(e.target.value)} >
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
                                    </select>

                                </div>
                                <div className="form-group">
                                    <label className="form-label" ><b>Interne accountmanager</b></label>
                                    <select value={StorageGAccMrID} className="form-select form-control choicesjs" onChange={e => setStorageGAccMrID(e.target.value)} >
                                        <option value={-1}>Alle accountmanager</option>
                                        {interneAccountmanage.length > 0 ? (
                                            interneAccountmanage.map((result) => (<option value={result.userId}>{result.userFullName}</option>))
                                        ) : (<></>)}
                                    </select>

                                </div>
                                <div className="form-group">
                                    <label className="form-label" ><b>Locatie</b></label>
                                    <select value={StorageCarLocationID} className="form-select form-control choicesjs" onChange={e => setStorageCarLocationID(e.target.value)} >
                                        <option value={-1}>Alle Locatie</option>
                                        {carlocationData.length > 0 ? (
                                            carlocationData.map((result) => (<option value={result.storageId}>{result.locationName}</option>))
                                        ) : (<></>)}
                                    </select>

                                </div>


                                <div className="d-flex align-items-center justify-content-center">
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
                                            <h3 className="page-title">Verkoopgereed  </h3>
                                        </div>
                                    </div>
                                </div>

                                {
                                    loading ?(<React.Fragment>
                                        <DataLoader />
                                                  </React.Fragment>):
                                                (<div className="table-responsive" >
                                                    <List column={column} data={readyForSaleList} {...paginationAttributes} />
                                                </div>)
                                }




                            </div>
                        </div>
                    </div>


                </div>

            </div> */}

      {/* Popup with multiple checkboxes */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="text-white bg-primary popupHeader">
              <h3 className="mb-0">Select Column</h3>
            </div>
            <div className="popupBody">
              <form>
                {checkboxOptions.map((option) => (
                  <div key={option.id}>
                    <label className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        checked={selectedOptions.includes(option.label)}
                        onChange={() => handleCheckboxChange(option.label)}
                        style={{ marginRight: "5px" }}
                        disabled={selectedOptions.includes(option.label) && selectedOptions.length === 1}

                      />
                      {option.label}
                    </label>
                  </div>
                ))}
              </form>
              <div className="popup-buttons">
                <button className="btn btn-primary w-25 mr-1" onClick={togglePopup}>Close</button>
                <button className="btn btn-primary w-25 mr-1" onClick={filterArrays}>
                  Ok
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />

    </React.Fragment>

  );
}
export default ReadyForSale;