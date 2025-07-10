import * as React from "react";
import { useRef } from 'react';
import axios from "axios";
import List from "../List/List";
import { getUrl, postRequest } from "../ApiCalls";
import CONSTANT from "../Global";
import DataLoader from "../Loader";
import * as XLSX from "xlsx";
import "../components.css";
import GridView from "../List/GridView";
import Pagination from "../List/Pager";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import ReactDatePicker from "react-datepicker";
import { Navigate, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";

function CarList(props) {
  const [cars, setListData] = React.useState([]);
  const [locations, setLocationsData] = React.useState([]);
  const [stockmanagers, setStockManagersData] = React.useState([]);
  const [stockstatatusoptions, setStockStatusOptions] = React.useState([]);
  const [memoTypes, setMemoTypes] = React.useState([]);
  const [carStatusList, setCarStatusList] = React.useState([]);
  const [extStockStatusSourceList, setExtStockStatusSourceList] = React.useState([]);
  const [extStockStatusList, setextStockStatusList] = React.useState([]);
  const [daysStockList, setdaysStockList] = React.useState([]);

  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [filteredArray, setFilteredArray] = React.useState([]);

  const [isLoading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageNumberLimit = CONSTANT.PAGENUMBERLIMIT;
  const pagination = CONSTANT.PAGINATION;
  const [maxPageLimit, setMaxPageLimit] = React.useState(pagination);
  const [minPageLimit, setMinPageLimit] = React.useState(0);
  const [StartIndex, setStartIndex] = React.useState(
    (currentPage - 1) * maxPageLimit
  );
  const [EndIndex, setEndIndex] = React.useState(
    (currentPage - 1) * maxPageLimit + (maxPageLimit - 1)
  );
  const [SortColumn, setSortColumn] = React.useState("ProcessActivationTime");
  const [SearchString, setSearchString] = React.useState("");
  const [SortingOrder, setSortingOrder] = React.useState("desc");
  const [TotalRecords, setTotalRecords] = React.useState(0);

  const [UserId, setUserId] = React.useState(
    localStorage.getItem("UserId")
  );
  const [ShowAllActions, setShowAllActions] = React.useState(true);
  const [CarStatus, setCarStatus] = React.useState(0);
  const [CPeriodB, setCPeriodB] = React.useState(null);
  const [CPeriodE, setCPeriodE] = React.useState(null);
  const [OwnerCode, setOwnerCode] = React.useState("");
  const [VendorCode, setVendorCode] = React.useState("");
  const [CarMemo, setCarMemo] = React.useState(-1);
  const [IPeriodB, setIPeriodB] = React.useState(null);
  const [IPeriodE, setIPeriodE] = React.useState(null);
  const [StorageID, setStorageID] = React.useState(-1);
  const [SearchBy, setSearchBy] = React.useState(null);
  const [StockStatus, setStockStatus] = React.useState(-1);
  const [DaysOnStockFrom, setDaysOnStockFrom] = React.useState(-1);
  const [DaysOnStockTo, setDaysOnStockTo] = React.useState(-1);
  const [ExtStockStatusSource, setExtStockStatusSource] = React.useState(null);
  const [ExtStockStatus, setExtStockStatus] = React.useState(null);
  const [StockControllerCompanyId, setStockControllerCompanyId] = React.useState(-1);
  //const [MemoType, setMemoType] = React.useState(-1);
  const [OwnerCompanyId, setOwnerCompanyId] = React.useState(-1);

  const [lastClick, setLastClick] = React.useState(null);
  const [isListView, setListView] = React.useState(true);
  const [LastPageReaminNo, setLastPageReaminNo] = React.useState(0);
  const [isLoadingExcel, setisLoadingExcel] = React.useState(false);
  const [IsSnelfilter1, setIsSnelfilter1] = React.useState(false);
  const [IsSnelfilter2, setIsSnelfilter2] = React.useState(false);

  const isFirstRender = useRef(true);
  const onPageChange = (pageNumber) => {
    setLastClick(pageNumber - minPageLimit);
    setCurrentPage(pageNumber);
  };
  const history = useNavigate();

  const onPrevClick = () => {
    if (lastClick > 0) {
      if (lastClick == 1) {
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
  // const onFirstClick = () => {
  //   // if ((currentPage - 1) % pagination === 0) {
  //   //   setMaxPageLimit(maxPageLimit - pagination);
  //   //   setMinPageLimit(minPageLimit - pagination);
  //   // }
  //   // setMaxPageLimit(maxPageLimit - pagination);
  //   // setMinPageLimit(minPageLimit - pagination);
  //   // setCurrentPage(1);
  // };

  // const onLastClick = () => {
  //   // if ((currentPage - 1) % pagination === 0) {
  //   //   setMaxPageLimit(maxPageLimit - pagination);
  //   //   setMinPageLimit(minPageLimit - pagination);
  //   // }
  // };
  let tempCarData = [
    {
      kenteken: "NS2024V",
      autodetails: "AUDI A8",
      uwref: "HK3",
      workflow: "TSKOCT",
      system: 1,
      aktie: "Controle",
      location: "VWPFS Yard",
    },
    {
      kenteken: "NS204V",
      autodetails: "AUDI A8",
      uwref: "HK3",
      workflow: "TSKOCT",
      system: 1,
      aktie: "Controle",
      location: "BCA Yard",
    },
    {
      kenteken: "NS204V",
      autodetails: "AUDI A8",
      uwref: "HK3",
      workflow: "TSKOCT",
      system: 1,
      aktie: "Controle",
      location: "BCA Yard",
    },
    {
      kenteken: "NS204V",
      autodetails: "AUDI A8",
      uwref: "HK3",
      workflow: "TSKOCT",
      system: 1,
      aktie: "Controle",
      location: "BCA Yard",
    },
    {
      kenteken: "NS204V",
      autodetails: "AUDI A8",
      uwref: "HK3",
      workflow: "TSKOCT",
      system: 1,
      aktie: "Controle",
      location: "BCA Yard",
    },
    {
      kenteken: "NS204V",
      autodetails: "AUDI A8",
      uwref: "HK3",
      workflow: "TSKOCT",
      system: 1,
      aktie: "Controle",
      location: "BCA Yard",
    },
    {
      kenteken: "NS204V",
      autodetails: "AUDI A8",
      uwref: "HK3",
      workflow: "TSKOCT",
      system: 1,
      aktie: "Controle",
      location: "BCA Yard",
    },
    {
      kenteken: "NS204V",
      autodetails: "AUDI A8",
      uwref: "HK3",
      workflow: "TSKOCT",
      system: 1,
      aktie: "Controle",
      location: "BCA Yard",
    },
  ];

  let tempStorageID = -1;
  let tempVendorCode = "";
  let tempcurrentPage = 1;
  let tempStockControllerCompanyId = -1;
  let tempStockStatus = -1;
  let tempMemoType = -1;
  let tempcarStatus = -1;
  let tempExtStockStatusSource = null;
  let tempExtStockStatus = null;
  let tempDaysOnStockFrom = -1;
  let tempDaysOnStockTo = -1;
  let tempCPeriodB = null;
  let tempCPeriodE = null;
  let tempIPeriodB = null;
  let tempIPeriodE = null;
 let tempSearchBy =null;
  const listViewRef = React.useRef(null);
  const lastTriggeredPageRef = React.useRef(currentPage);
  React.useEffect(() => {
    lastTriggeredPageRef.current = currentPage;
  }, [currentPage]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  }, [isLoading])
  const onNextClick = () => {
    if (currentPage + 1 > maxPageLimit) {
      setMaxPageLimit(maxPageLimit + pagination);
      setMinPageLimit(minPageLimit + pagination);
    }

    setCurrentPage((prev) => prev + 1);

  };

  const onOrderChange = (columnname, order) => {
    setSortColumn(columnname);
    setSortingOrder(order);
    handleSorting(columnname, order);
  };
  const handleSorting = (sortField, sortOrder) => {
    if (sortField) {
      setSortingOrder(sortOrder);
      setisLoadingExcel(true);
      listData(StorageID, VendorCode, StockControllerCompanyId,
        StockStatus, CarMemo, CarStatus, ExtStockStatusSource, ExtStockStatus, DaysOnStockFrom, DaysOnStockTo, CPeriodB, CPeriodE, IPeriodB, IPeriodE, sortField, sortOrder);
    }
  };
  const handleKentakenKeyDown = (e) => {
    console.log("prasha test kenteken:"+e);
    if (e.key === "Enter") {
        handleKentekenSearch(); // Call the search function on Enter press
    }
  };
const handleKentakenInput = (e) => {
  if (e.target.value === "") {
      console.log("Input cleared!");
      setSearchBy(""); // Reset state
      setCurrentPage(1);
      tempStorageID = StorageID;
      tempVendorCode = VendorCode;
      tempStockControllerCompanyId = StockControllerCompanyId;
      tempStockStatus = StockStatus;
      tempMemoType = CarMemo;
      tempcarStatus = CarStatus;
      tempExtStockStatusSource = ExtStockStatusSource;
      tempExtStockStatus = ExtStockStatus;
      tempDaysOnStockFrom = DaysOnStockFrom;
      tempDaysOnStockTo = DaysOnStockTo;
      tempCPeriodB = CPeriodB;
      tempCPeriodE = CPeriodE;
      tempIPeriodB = IPeriodB;
      tempIPeriodE = IPeriodE;
      tempSearchBy = "";
      setMaxPageLimit(pagination);
      setMinPageLimit(0);
      setisLoadingExcel(true);
      listData(tempStorageID, tempVendorCode, tempStockControllerCompanyId, tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo, tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE,"","",tempSearchBy);
  }
  };
  const handleKentekenSearch = (event) => {
    setCurrentPage(1);
    tempStorageID = StorageID;
    tempVendorCode = VendorCode;
    tempStockControllerCompanyId = StockControllerCompanyId;
    tempStockStatus = StockStatus;
    tempMemoType = CarMemo;
    tempcarStatus = CarStatus;
    tempExtStockStatusSource = ExtStockStatusSource;
    tempExtStockStatus = ExtStockStatus;
    tempDaysOnStockFrom = DaysOnStockFrom;
    tempDaysOnStockTo = DaysOnStockTo;
    tempCPeriodB = CPeriodB;
    tempCPeriodE = CPeriodE;
    tempIPeriodB = IPeriodB;
    tempIPeriodE = IPeriodE;
    setMaxPageLimit(pagination);
    setMinPageLimit(0);
    setisLoadingExcel(true);
    listData(tempStorageID, tempVendorCode, tempStockControllerCompanyId, tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo, tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
  };
  const handleCheckboxChange1 = () => {
    setIsSnelfilter1(!IsSnelfilter1);
  };

  const handleCheckboxChange2 = () => {
    setIsSnelfilter2(!IsSnelfilter2);
  };
  const handlefilterSearch = () => {
    setisLoadingExcel(true);
    tempStorageID = StorageID;
    tempVendorCode = VendorCode;
    tempStockControllerCompanyId = StockControllerCompanyId;
    tempStockStatus = StockStatus;
    tempMemoType = CarMemo;
    tempcarStatus = CarStatus;
    tempExtStockStatusSource = ExtStockStatusSource;
    tempExtStockStatus = ExtStockStatus;
    tempDaysOnStockFrom = DaysOnStockFrom;
    tempDaysOnStockTo = DaysOnStockTo;
    tempCPeriodB = CPeriodB;
    tempCPeriodE = CPeriodE;
    tempIPeriodB = IPeriodB;
    tempIPeriodE = IPeriodE;
    setCurrentPage(tempcurrentPage);
    setMaxPageLimit(pagination);
    setMinPageLimit(0);
    //StorageLocationList(-1, "");
    listData(tempStorageID, tempVendorCode, tempStockControllerCompanyId, tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo, tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
  };
  const handleClearSearch = () => {
    setIsSnelfilter1(false);
    setIsSnelfilter2(false);
    setCurrentPage(1);
    setSearchBy("");
    setStorageID(-1);
    setStockControllerCompanyId(-1);
    setCarMemo(-1);
    setVendorCode("");
    setStockStatus(-1);
    setCarStatus(0);
    setExtStockStatusSource(null);
    setExtStockStatus(null);
    setDaysOnStockFrom(-1);
    setDaysOnStockTo(-1);
    setCPeriodB(null);
    setCPeriodE(null);
    setIPeriodB(null);
    setIPeriodE(null);
    setisLoadingExcel(true);
    tempStorageID = -1;
    tempVendorCode = "";
    tempStockControllerCompanyId = -1;
    tempStockStatus = -1;
    tempMemoType = -1;
    tempcarStatus = -1;
    tempExtStockStatusSource = null;
    tempExtStockStatus = null;
    tempDaysOnStockFrom = -1;
    tempDaysOnStockTo = -1;
    tempCPeriodB = null;
    tempCPeriodE = null;
    tempIPeriodB = null;
    tempIPeriodE = null;
    StorageLocationList(
      tempStorageID,
      tempVendorCode,
      tempStockControllerCompanyId,
      tempStockStatus,
      tempMemoType,
      tempcarStatus,
      tempExtStockStatusSource,
      tempExtStockStatus,
      tempDaysOnStockFrom,
      tempDaysOnStockTo,
      tempCPeriodB,
      tempCPeriodE,
      tempIPeriodB,
      tempIPeriodE
    );
    listData(
      tempStorageID,
      tempVendorCode,
      tempStockControllerCompanyId,
      tempStockStatus,
      tempMemoType,
      tempcarStatus,
      tempExtStockStatusSource,
      tempExtStockStatus,
      tempDaysOnStockFrom,
      tempDaysOnStockTo,
      tempCPeriodB,
      tempCPeriodE,
      tempIPeriodB,
      tempIPeriodE,
      "",
      "",
      ""
    );
  };
  const column = [
    {
      heading: "Kenteken",
      value: "kenteken",
      ishtml: 0,
      isanchortag: 0,
      doNotApplySorting: 0,
      isGridView: 1,
      isChecked: 1
    },
    {
      heading: "Auto details",
      value: "sort_CarDetails",
      ishtml: 1,
      isanchortag: 0,
      doNotApplySorting: 0,
      iskentaken: 1,
      isGridViewAutodetails: 1,
      isGridView: 1,
      isChecked: 1
    },
    {
      heading: "gridKenteken",
      value: "kenteken",
      ishtml: 0,
      isanchortag: 0,
      doNotApplySorting: 0,
      isGridViewKentaken: 1,
      isGridView: 1,
      isDisabled: 1,
      isChecked: 0
    },
    // {
    //   heading: "Uw ref",
    //   value: "uwref",
    //   ishtml: 0,
    //   isanchortag: 0,
    //   doNotApplySorting: 1,
    // },
    {
      heading: "Eigenaar/Workflow",
      value: "sort_Owner_Protocol",
      ishtml: 1,
      isanchortag: 0,
      doNotApplySorting: 0,
      isGridView: 0,
      isChecked: 1
    },
    {
      heading: "In systeem",
      value: "inProcess",
      ishtml: 0,
      tooltip: "inProcessTooltip",
      isanchortag: 0,
      doNotApplySorting: 0,
      isGridView: 0,
      isChecked: 1
    },
    {
      heading: "Aktie",
      value: "action",
      ishtml: 0,
      isanchortag: 0,
      doNotApplySorting: 0,
      isGridView: 0,
      isChecked: 1
    },
    {
      heading: "Locatie",
      value: "location",
      ishtml: 1,
      isanchortag: 0,
      doNotApplySorting: 0,
      isGridView: 0,
      isChecked: 1
    },
  ];
  React.useEffect(() => {
    setisLoadingExcel(true);
    tempStorageID = StorageID;
    tempVendorCode = VendorCode;
    tempStockControllerCompanyId = StockControllerCompanyId;
    tempStockStatus = StockStatus;
    tempMemoType = CarMemo;
    tempcarStatus = CarStatus;
    tempExtStockStatusSource = ExtStockStatusSource;
    tempExtStockStatus = ExtStockStatus;
    tempDaysOnStockFrom = DaysOnStockFrom;
    tempDaysOnStockTo = DaysOnStockTo;
    tempCPeriodB = CPeriodB;
    tempCPeriodE = CPeriodE;
    tempIPeriodB = IPeriodB;
    tempIPeriodE = IPeriodE;
    StorageLocationList(
      -1,
      "",
      tempStockControllerCompanyId,
      tempStockStatus,
      tempMemoType,
      tempcarStatus,
      tempExtStockStatusSource,
      tempExtStockStatus,
      tempDaysOnStockFrom,
      tempDaysOnStockTo,
      tempCPeriodB,
      tempCPeriodE,
      tempIPeriodB,
      tempIPeriodE
    );
    listData(
      tempStorageID,
      tempVendorCode,
      tempStockControllerCompanyId,
      tempStockStatus,
      tempMemoType,
      tempcarStatus,
      tempExtStockStatusSource,
      tempExtStockStatus,
      tempDaysOnStockFrom,
      tempDaysOnStockTo
      , tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE
    );
  }, [currentPage, VendorCode]);
  const StorageLocationList = (
    tmpStorageID,
    tmpVendorCode,
    tmpStockControllerCompanyId,
    tempStockStatus,
    tempMemoType,
    tempcarStatus,
    tempExtStockStatusSource,
    tempExtStockStatus,
    tempDaysOnStockFrom,
    tempDaysOnStockTo,
    tempCPeriodB,
      tempCPeriodE,
      tempIPeriodB,
      tempIPeriodE
  ) => {
    let data = {
      UserId: UserId,
      ShowAllActions: ShowAllActions,
      CarStatus: tempcarStatus,
      CPeriodB: tempCPeriodB,
      CPeriodE: tempCPeriodE,
      VendorCode: tmpVendorCode,
      CarMemo: tempMemoType,
      IPeriodB: tempIPeriodB,
      IPeriodE: tempIPeriodE,
      StorageID: tmpStorageID,
      SearchBy: null,
      StockStatus: tempStockStatus,
      DaysOnStockFrom: tempDaysOnStockFrom,
      DaysOnStockTo: tempDaysOnStockTo,
      ExtStockStatusSource: tempExtStockStatusSource,
      ExtStockStatus: tempExtStockStatus,
      StockControllerCompanyId: tmpStockControllerCompanyId,
      OwnerCompanyId: OwnerCompanyId,
      PageNumber: 1,
      Pagesize: -1,
      SortField: "",
      SortOrder: "",
    };
    postRequest({
      requesturl: getUrl() + `/Car/GetForFilterOptions`,
      formData: data,
    }).then((res) => {
      if (res.status == 401) {
        history("/");
      }
      else if (res) {
        setLocationsData(res.data.locations);
        setStockManagersData(res.data.stockmanagers);
        setStockStatusOptions(res.data.stockStatusOptions);
        setMemoTypes(res.data.memoTypes);
        setCarStatusList(res.data.carStatusList);
        setExtStockStatusSourceList(res.data.extStockStatusSourceList);
        setextStockStatusList(res.data.extStockStatusList);
        setdaysStockList(res.data.daysOnStockLists);
      }
    });
  };
  const handleStorageLocationChange = (storageid) => {
    setStorageID(storageid);
    setisLoadingExcel(true);
    tempStorageID = storageid;
    tempVendorCode = VendorCode;
    tempStockControllerCompanyId = StockControllerCompanyId;
    tempStockStatus = StockStatus;
    tempMemoType = CarMemo;
    tempcarStatus = CarStatus;
    tempExtStockStatusSource = ExtStockStatusSource;
    tempExtStockStatus = ExtStockStatus;
    tempDaysOnStockFrom = DaysOnStockFrom;
    tempDaysOnStockTo = DaysOnStockTo;
    tempCPeriodB = CPeriodB;
    tempCPeriodE = CPeriodE;
    tempIPeriodB = IPeriodB;
    tempIPeriodE = IPeriodE;
    setCurrentPage(tempcurrentPage);
    setMaxPageLimit(pagination);
    setMinPageLimit(0);
    StorageLocationList(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo,tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
    listData(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo, tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
  };
  const handleStockManagerCheckboxChange = (companyId) => {
    setStockControllerCompanyId(companyId);
    setisLoadingExcel(true);
    tempStorageID = StorageID;
    tempVendorCode = VendorCode;
    tempStockControllerCompanyId = companyId;
    tempStockStatus = StockStatus;
    tempMemoType = CarMemo;
    tempcarStatus = CarStatus;
    tempExtStockStatusSource = ExtStockStatusSource;
    tempExtStockStatus = ExtStockStatus;
    tempDaysOnStockFrom = DaysOnStockFrom;
    tempDaysOnStockTo = DaysOnStockTo;
    tempCPeriodB = CPeriodB;
    tempCPeriodE = CPeriodE;
    tempIPeriodB = IPeriodB;
    tempIPeriodE = IPeriodE;
    setCurrentPage(tempcurrentPage);
    setMaxPageLimit(pagination);
    setMinPageLimit(0);
    StorageLocationList(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo,tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
    listData(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo, tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
  };



  const handleStockStatusCheckboxChange = (stockstatus) => {
    setStockStatus(stockstatus);
    setisLoadingExcel(true);
    tempStorageID = StorageID;
    tempVendorCode = VendorCode;
    tempStockControllerCompanyId = StockControllerCompanyId;
    tempStockStatus = stockstatus;
    tempMemoType = CarMemo;
    tempcarStatus = CarStatus;
    tempExtStockStatusSource = ExtStockStatusSource;
    tempExtStockStatus = ExtStockStatus;
    tempDaysOnStockFrom = DaysOnStockFrom;
    tempDaysOnStockTo = DaysOnStockTo;
    tempCPeriodB = CPeriodB;
    tempCPeriodE = CPeriodE;
    tempIPeriodB = IPeriodB;
    tempIPeriodE = IPeriodE;
    setCurrentPage(tempcurrentPage);
    setMaxPageLimit(pagination);
    setMinPageLimit(0);
    StorageLocationList(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo,tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
    listData(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo, tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
  };

  const handleMemoTypeCheckbox = (memoType) => {
    setCarMemo(memoType);
    setisLoadingExcel(true);
    tempStorageID = StorageID;
    tempVendorCode = VendorCode;
    tempStockControllerCompanyId = StockControllerCompanyId;
    tempStockStatus = StockStatus;
    tempMemoType = memoType;
    tempcarStatus = CarStatus;
    tempExtStockStatusSource = ExtStockStatusSource;
    tempExtStockStatus = ExtStockStatus;
    tempDaysOnStockFrom = DaysOnStockFrom;
    tempDaysOnStockTo = DaysOnStockTo;
    tempCPeriodB = CPeriodB;
    tempCPeriodE = CPeriodE;
    tempIPeriodB = IPeriodB;
    tempIPeriodE = IPeriodE;
    setCurrentPage(tempcurrentPage);
    setMaxPageLimit(pagination);
    setMinPageLimit(0);
    StorageLocationList(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo,tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
    listData(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo, tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
  };

  const handleCarStatusCheckboxChange = (carStatus) => {
    setCarStatus(carStatus);
    setisLoadingExcel(true);
    tempStorageID = StorageID;
    tempVendorCode = VendorCode;
    tempStockControllerCompanyId = StockControllerCompanyId;
    tempStockStatus = StockStatus;
    tempMemoType = CarMemo;
    tempcarStatus = carStatus;
    tempExtStockStatusSource = ExtStockStatusSource;
    tempExtStockStatus = ExtStockStatus;
    tempDaysOnStockFrom = DaysOnStockFrom;
    tempDaysOnStockTo = DaysOnStockTo;
    tempCPeriodB = CPeriodB;
    tempCPeriodE = CPeriodE;
    tempIPeriodB = IPeriodB;
    tempIPeriodE = IPeriodE;
    setCurrentPage(tempcurrentPage);
    setMaxPageLimit(pagination);
    setMinPageLimit(0);
    StorageLocationList(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo,tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
    listData(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo, tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
  }

  const handleExtStockStatusSourceCheckboxChange = (extStockStatusSource) => {
    setExtStockStatusSource(extStockStatusSource);
    setisLoadingExcel(true);
    tempStorageID = StorageID;
    tempVendorCode = VendorCode;
    tempStockControllerCompanyId = StockControllerCompanyId;
    tempStockStatus = StockStatus;
    tempMemoType = CarMemo;
    tempcarStatus = CarStatus;
    tempExtStockStatusSource = extStockStatusSource;
    tempExtStockStatus = ExtStockStatus;
    tempDaysOnStockFrom = DaysOnStockFrom;
    tempDaysOnStockTo = DaysOnStockTo;
    tempCPeriodB = CPeriodB;
    tempCPeriodE = CPeriodE;
    tempIPeriodB = IPeriodB;
    tempIPeriodE = IPeriodE;
    setCurrentPage(tempcurrentPage);
    setMaxPageLimit(pagination);
    setMinPageLimit(0);
    StorageLocationList(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo,tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
    listData(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo, tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
  }

  const handleExtStockStatusCheckboxChange = (extStockStatus) => {
    setExtStockStatus(extStockStatus);
    setisLoadingExcel(true);
    tempStorageID = StorageID;
    tempVendorCode = VendorCode;
    tempStockControllerCompanyId = StockControllerCompanyId;
    tempStockStatus = StockStatus;
    tempMemoType = CarMemo;
    tempcarStatus = CarStatus;
    tempExtStockStatusSource = ExtStockStatusSource;
    tempExtStockStatus = extStockStatus;
    tempDaysOnStockFrom = DaysOnStockFrom;
    tempDaysOnStockTo = DaysOnStockTo;
    tempCPeriodB = CPeriodB;
    tempCPeriodE = CPeriodE;
    tempIPeriodB = IPeriodB;
    tempIPeriodE = IPeriodE;
    setCurrentPage(tempcurrentPage);
    setMaxPageLimit(pagination);
    setMinPageLimit(0);
    StorageLocationList(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo,tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
    listData(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo, tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
  }

  const handleDaysOnStockCheckboxChange = (daysOnStockFrom, daysOnStockTo) => {
    setDaysOnStockFrom(daysOnStockFrom);
    setDaysOnStockTo(daysOnStockTo);
    tempStorageID = StorageID;
    tempVendorCode = VendorCode;
    tempStockControllerCompanyId = StockControllerCompanyId;
    tempStockStatus = StockStatus;
    tempMemoType = CarMemo;
    tempcarStatus = CarStatus;
    tempExtStockStatusSource = ExtStockStatusSource;
    tempExtStockStatus = ExtStockStatus;
    tempDaysOnStockFrom = daysOnStockFrom;
    tempDaysOnStockTo = daysOnStockTo;
    tempCPeriodB = CPeriodB;
    tempCPeriodE = CPeriodE;
    tempIPeriodB = IPeriodB;
    tempIPeriodE = IPeriodE;
    setCurrentPage(tempcurrentPage);
    setMaxPageLimit(pagination);
    setMinPageLimit(0);
    StorageLocationList(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo,tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
    listData(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo, tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
  }

  const listData = (
    tmpStorageID,
    tmpVendorCode,
    tmpStockControllerCompanyId,
    tempStockStatus,
    tempMemoType,
    tempcarStatus,
    tempExtStockStatusSource,
    tempExtStockStatus,
    tempDaysOnStockFrom,
    tempDaysOnStockTo,
    tempCPeriodB,
    tempCPeriodE,
    tempIPeriodB,
    tempIPeriodE,
    sortField = "",
    sortOrder = "",
    tmpSearchBy
  ) => {
    let data = {
      UserId: UserId,
      ShowAllActions: ShowAllActions,
      CarStatus: tempcarStatus,
      CPeriodB: tempCPeriodB,
      CPeriodE: tempCPeriodE,
      VendorCode: tmpVendorCode,
      CarMemo: tempMemoType,
      IPeriodB: tempIPeriodB,
      IPeriodE: tempIPeriodE,
      StorageID: tmpStorageID,
      SearchBy: tmpSearchBy == "" ? tmpSearchBy : SearchBy === null ? SearchBy : SearchBy.replace(/[-\s]/g, ''),
      StockStatus: tempStockStatus,
      DaysOnStockFrom: tempDaysOnStockFrom,
      DaysOnStockTo: tempDaysOnStockTo,
      ExtStockStatusSource: tempExtStockStatusSource,
      ExtStockStatus: tempExtStockStatus,
      StockControllerCompanyId: tmpStockControllerCompanyId,
      OwnerCompanyId: OwnerCompanyId,
      PageNumber: currentPage,
      Pagesize: pageNumberLimit,
      SortField: sortField ? sortField : SortColumn,
      SortOrder: sortOrder ? sortOrder : SortingOrder,
    };

    postRequest({
      requesturl: getUrl() + `/Car/GetCars`,
      formData: data,
    }).then((res) => {
      if (res.status == 401) {
        history("/");
      }
      else if (res) {
        setListData(res.data.list);
        setisLoadingExcel(false);

        setLoading(!isLoading)
        setTotalRecords(res.data.totalItems);
        setStartIndex((currentPage - 1) * pageNumberLimit);
        let endind =
          (currentPage - 1) * pageNumberLimit + (pageNumberLimit - 1);
        setEndIndex(
          endind + 1 > res.data.totalItems ? res.data.totalItems - 1 : endind
        );
      }
    });
  };
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
    onFirstClick: onFirstClick,
    onLastClick: onLastClick,
  };

  const changeView = (View) => {
    if (View == "gridView") {
      setListView(false);
    } else {
      setListView(true);
    }
  };

  //Excel Export
  const exportToExcel = async () => {
    setisLoadingExcel(true);
    const data = {
      UserId,
      ShowAllActions,
      CarStatus,
      CPeriodB,
      CPeriodE,
      OwnerCode,
      CarMemo,
      IPeriodB,
      IPeriodE,
      StorageID,
      SearchBy: SearchBy === null ? SearchBy : SearchBy.replace(/[-\s]/g, ''),
      StockStatus,
      DaysOnStockFrom,
      DaysOnStockTo,
      ExtStockStatusSource,
      ExtStockStatus,
      StockControllerCompanyId,
      OwnerCompanyId,
    };
    const token = localStorage.getItem("JwtToken");
    try {
      const url = `${getUrl()}/Car/GetCarsExcelExport`;
      const response = await axios({
        url: url,
        data: data,
        method: "POST",
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      // Process the blob for file download
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", "MyCars.xlsx");
      document.body.appendChild(link);
      link.click();

    } catch (error) {
      console.error('Error downloading the Excel file:', error);
    }
    finally {
      setisLoadingExcel(false);
    }
  };


  //Sorting Column
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
  const [selectedOptions, setSelectedOptions] = React.useState(
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
    debugger;
    setFilteredArray(result);
    togglePopup();
  }

  return (
    <React.Fragment>
      <div className="conatiner-fluid content-inner  py-0">
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

        <div className="container text-center mb-15">
          <p className="mb-0">
            Ophalen RDW bedrijfsvoorraad (bron: VWE) tarief pm € 0,00
          </p>
          <p className="mb-0">Last update: 02 - 02 - 2024 06:34:13</p>
        </div>
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
                      <button
                        className={
                          +isListView
                            ? "w-20px h-20px bg-white text-primary border-0 p-0 d-inline-flex flex-center rounded-1 me-8px listGridbtn active"
                            : "w-20px h-20px bg-white text-primary border-0 p-0 d-inline-flex flex-center rounded-1 me-8px listGridbtn "
                        }
                        data-target="#listView"
                        onClick={() => changeView("listView")}
                        title="List"
                      >
                        <svg
                          width="15"
                          height="8"
                          viewBox="0 0 15 8"
                          fill="none"
                        >
                          <path
                            d="M3.69507 1.5V0H14.6951V1.5H3.69507ZM3.69507 4.75V3.25H14.6951V4.75H3.69507ZM3.69507 8V6.5H14.6951V8H3.69507ZM1.44507 1.5C1.25062 1.5 1.07701 1.42361 0.924235 1.27083C0.771457 1.11806 0.695068 0.940972 0.695068 0.739583C0.695068 0.538194 0.771457 0.364583 0.924235 0.21875C1.07701 0.0729167 1.2541 0 1.45549 0C1.65687 0 1.83048 0.0718745 1.97632 0.215624C2.12215 0.359375 2.19507 0.5375 2.19507 0.75C2.19507 0.944444 2.12319 1.11806 1.97944 1.27083C1.83569 1.42361 1.65757 1.5 1.44507 1.5ZM1.44507 4.75C1.25062 4.75 1.07701 4.67361 0.924235 4.52083C0.771457 4.36806 0.695068 4.19097 0.695068 3.98958C0.695068 3.78819 0.771457 3.61458 0.924235 3.46875C1.07701 3.32292 1.2541 3.25 1.45549 3.25C1.65687 3.25 1.83048 3.32188 1.97632 3.46563C2.12215 3.60938 2.19507 3.7875 2.19507 4C2.19507 4.19444 2.12319 4.36806 1.97944 4.52083C1.83569 4.67361 1.65757 4.75 1.44507 4.75ZM1.44507 8C1.25062 8 1.07701 7.92361 0.924235 7.77083C0.771457 7.61806 0.695068 7.44097 0.695068 7.23958C0.695068 7.03819 0.771457 6.86458 0.924235 6.71875C1.07701 6.57292 1.2541 6.5 1.45549 6.5C1.65687 6.5 1.83048 6.57188 1.97632 6.71563C2.12215 6.85938 2.19507 7.0375 2.19507 7.25C2.19507 7.44444 2.12319 7.61806 1.97944 7.77083C1.83569 7.92361 1.65757 8 1.44507 8Z"
                            fill="currentcolor"
                          />
                        </svg>
                      </button>

                      <button
                        className={
                          isListView
                            ? "w-20px h-20px bg-white text-primary border-0 p-0 d-inline-flex flex-center rounded-1 me-8px listGridbtn "
                            : "w-20px h-20px bg-white text-primary border-0 p-0 d-inline-flex flex-center rounded-1 me-8px listGridbtn active"
                        }
                        data-target="#gridView"
                        onClick={() => changeView("gridView")}
                        title="Grid"
                      >
                        <svg
                          width="15"
                          height="14"
                          viewBox="0 0 15 14"
                          fill="none"
                        >
                          <path
                            d="M0.695068 6V0H6.69507V6H0.695068ZM0.695068 14V8H6.69507V14H0.695068ZM8.69507 6V0H14.6951V6H8.69507ZM8.69507 14V8H14.6951V14H8.69507ZM2.19507 4.5H5.19507V1.5H2.19507V4.5ZM10.1951 4.5H13.1951V1.5H10.1951V4.5ZM10.1951 12.5H13.1951V9.5H10.1951V12.5ZM2.19507 12.5H5.19507V9.5H2.19507V12.5Z"
                            fill="currentcolor"
                          />
                        </svg>
                      </button>

                      <button
                        className="w-20px h-20px bg-white border-0 p-0 d-inline-flex flex-center rounded-1 me-8px"
                        onClick={exportToExcel}
                        title="Export Excel"
                      >
                        <img src="images/excel.png" alt="" height="20" />
                      </button>

                      <button className="w-20px h-20px bg-white text-primary border-0 p-0 d-inline-flex flex-center rounded-1 me-8px" title="Print">
                        <svg
                          width="17"
                          height="14"
                          viewBox="0 0 17 14"
                          fill="none"
                        >
                          <path
                            d="M12.1951 4V1.5H5.19507V4H3.69507V0H13.6951V4H12.1951ZM13.4407 7.5C13.6519 7.5 13.8305 7.42855 13.9763 7.28565C14.1222 7.14273 14.1951 6.96565 14.1951 6.7544C14.1951 6.54313 14.1236 6.36458 13.9807 6.21875C13.8378 6.07292 13.6607 6 13.4495 6C13.2382 6 13.0597 6.07145 12.9138 6.21435C12.768 6.35727 12.6951 6.53435 12.6951 6.7456C12.6951 6.95687 12.7665 7.13542 12.9094 7.28125C13.0523 7.42708 13.2294 7.5 13.4407 7.5ZM12.1951 12.5V9.5H5.19507V12.5H12.1951ZM13.6951 14H3.69507V11H0.695068V6C0.695068 5.44444 0.889513 4.97222 1.2784 4.58333C1.66729 4.19444 2.13951 4 2.69507 4H14.6951C15.2506 4 15.7228 4.19444 16.1117 4.58333C16.5006 4.97222 16.6951 5.44444 16.6951 6V11H13.6951V14ZM15.2159 9.5V6.2985C15.2159 6.07172 15.1326 5.88194 14.9659 5.72917C14.7992 5.57639 14.6048 5.5 14.3826 5.5H2.98674C2.76243 5.5 2.57441 5.57667 2.42267 5.73C2.27094 5.88333 2.19507 6.07333 2.19507 6.3V9.5H3.69507V8H13.6951V9.5H15.2159Z"
                            fill="currentcolor"
                          />
                        </svg>
                      </button>

                      {
                        isListView === true ? (<button onClick={togglePopup} className="w-20px h-20px bg-white text-primary border-0 p-0 d-inline-flex flex-center rounded-1 me-8px" title="Sorting">
                          <svg
                            width="15"
                            height="12"
                            viewBox="0 0 15 12"
                            fill="none"
                          >
                            <path
                              d="M2.19507 12V7H0.695068V5.5H5.2159V7H3.69507V12H2.19507ZM2.19507 4V0H3.69507V4H2.19507ZM5.44507 4V2.5H6.94507V0H8.44507V2.5H9.94507V4H5.44507ZM6.94507 12V5.5H8.44507V12H6.94507ZM11.6951 12V9.5H10.1742V8H14.6951V9.5H13.1951V12H11.6951ZM11.6951 6.5V0H13.1951V6.5H11.6951Z"
                              fill="currentcolor"
                            />
                          </svg>
                        </button>) : (<button onClick={togglePopup} disabled={true} className="w-20px h-20px bg-white text-primary border-0 p-0 d-inline-flex flex-center rounded-1 me-8px" title="Sorting">
                          <svg
                            width="15"
                            height="12"
                            viewBox="0 0 15 12"
                            fill="none"
                          >
                            <path
                              d="M2.19507 12V7H0.695068V5.5H5.2159V7H3.69507V12H2.19507ZM2.19507 4V0H3.69507V4H2.19507ZM5.44507 4V2.5H6.94507V0H8.44507V2.5H9.94507V4H5.44507ZM6.94507 12V5.5H8.44507V12H6.94507ZM11.6951 12V9.5H10.1742V8H14.6951V9.5H13.1951V12H11.6951ZM11.6951 6.5V0H13.1951V6.5H11.6951Z"
                              fill="currentcolor"
                            />
                          </svg>
                        </button>)
                      }


                      <button
                        className="w-20px h-20px bg-white text-primary border-0 p-0 d-inline-flex flex-center rounded-1"
                        onClick={handleClearSearch}
                        title="Refresh"
                      >
                        <svg
                          width="13"
                          height="12"
                          viewBox="0 0 13 12"
                          fill="none"
                        >
                          <path
                            d="M6.69507 12C5.0284 12 3.61174 11.4167 2.44507 10.25C1.2784 9.08333 0.695068 7.66667 0.695068 6C0.695068 4.33333 1.2784 2.91667 2.44507 1.75C3.61174 0.583333 5.0284 0 6.69507 0C7.59785 0 8.43465 0.1875 9.20549 0.5625C9.97632 0.9375 10.6395 1.4375 11.1951 2.0625V0H12.6951V5H7.69507V3.5H10.4242C10.0215 2.88889 9.49368 2.40278 8.8409 2.04167C8.18812 1.68056 7.47285 1.5 6.69507 1.5C5.44507 1.5 4.38257 1.9375 3.50757 2.8125C2.63257 3.6875 2.19507 4.75 2.19507 6C2.19507 7.25 2.63257 8.3125 3.50757 9.1875C4.38257 10.0625 5.44507 10.5 6.69507 10.5C7.86174 10.5 8.86174 10.1146 9.69507 9.34375C10.5284 8.57292 11.0076 7.625 11.1326 6.5H12.6742C12.5492 8.05556 11.9173 9.36111 10.7784 10.4167C9.63951 11.4722 8.2784 12 6.69507 12Z"
                            fill="currentcolor"
                          />
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
                    <div
                      className={isListView ? "listView mb-5" : "listView d-none mb-5"}
                      id="listView"
                      ref={listViewRef}
                    >
                      {isLoadingExcel ? (
                        <React.Fragment>
                          <DataLoader isExportExcel={isLoadingExcel} />
                        </React.Fragment>
                      ) : isLoadingExcel ?
                        <>
                          <DataLoader isExportExcel={isLoadingExcel} />
                          <List
                            column={column}
                            data={cars}
                            {...paginationAttributes}
                          />
                        </> :
                        (
                          <List
                            //column={column}
                            column={filteredArray.length === 0 ? column : filteredArray}

                            data={cars}
                            {...paginationAttributes}
                          />
                        )}
                    </div>
                    <div
                      className={
                        isListView ? "gridView mb-5 d-none" : "gridView mb-5"
                      }
                      id="gridView"
                    >
                      {isLoadingExcel ? (
                        <React.Fragment>
                          <DataLoader isExportExcel={isLoadingExcel} />
                        </React.Fragment>
                      ) : (
                        <GridView
                          column={column}
                          data={cars}
                          {...paginationAttributes}
                        />
                      )}
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
                </div>
              </div>
              <div className="col-3 position-sticky top-0">
                <div className="bg-lightgray pa-15 pb-30 rounded-2 mb-15">
                  <h2 className="mb-3">Filter</h2>

                  <div className="searchBox carSearch rounded-1 d-flex position-relative mb-22">
                    <input type="search" className="flex-fill" value={SearchBy} onKeyDown={handleKentakenKeyDown} onInput={handleKentakenInput}
                      onChange={(e) => setSearchBy(e.target.value)} />
                    <button className="searchIcon" onClick={handleKentekenSearch} ></button>
                  </div>

                  <div className="mb-30">
                    <h3 className="mb-0">Snelfilter</h3>
                    <div className="chkBox d-flex">
                      <input className="ckh_snel" type="checkbox" id="chk-1" checked={IsSnelfilter1} onChange={handleCheckboxChange1} />
                      <label for="chk-1" className="para">Bedrijfsvoorraad</label>
                    </div>
                    <div className="chkBox d-flex">
                      <input className="ckh_snel" type="checkbox" id="chk-2" checked={IsSnelfilter2} onChange={handleCheckboxChange2} />
                      <label for="chk-2" className="para">Onder handen</label>
                    </div>
                  </div>
                  <div className="mb-30">
                    <h3 className="mb-0">Voorraad status</h3>
                    {stockstatatusoptions.length > 0 ? (
                      stockstatatusoptions.map((item) => (
                        <div className="chkBox d-flex">
                          <input type="checkbox" checked={item.stockStatus === StockStatus} onChange={() =>
                            handleStockStatusCheckboxChange(item.stockStatus)
                          } />
                          <label for="chk-3" className="para">{item.stockStatusName}</label>
                        </div>
                      ))
                    )
                      : <></>}
                  </div>
                  <div className="mb-30">
                    <h3 className="mb-0">Voorraad beheerder</h3>
                    {stockmanagers.length > 0 ? (
                      stockmanagers.map((item) => (
                        <div className="chkBox d-flex">
                          <input type="checkbox" checked={
                            item.stockStatusControllerCompanyId ===
                            StockControllerCompanyId
                          }
                            onChange={() =>
                              handleStockManagerCheckboxChange(
                                item.stockStatusControllerCompanyId
                              )
                            } />
                          <label for="chk-6" className="para">{item.stockStatusControllerCompanyName}</label>
                        </div>
                        // <div className="chkBox d-flex">
                        //   <input type="checkbox" id="chk-7" checked={isChk2_Voorraad_beheerder} onChange={handleCheckbox} />
                        //   <label for="chk-7" className="para">Niet gedefinieerd</label>
                        // </div>
                      ))
                    ) : <></>}
                  </div>
                  <div className="mb-30">
                    <h3 className="mb-0">Stadagen</h3>
                    {daysStockList.length > 0 ? (
                      daysStockList.map((item) => (
                        <div className="chkBox d-flex">
                          <input type="checkbox" checked={
                            item.daysOnStockFrom ===
                            DaysOnStockFrom && item.daysOnStockTo === DaysOnStockTo
                          }
                            onChange={() =>
                              handleDaysOnStockCheckboxChange(
                                item.daysOnStockFrom, item.daysOnStockTo
                              )
                            } />
                          <label for="chk-7" className="para">{item.daysOnStockName}</label>
                        </div>
                        // <div className="chkBox d-flex">
                        //   <input type="checkbox" id="chk-7" checked={isChk2_Voorraad_beheerder} onChange={handleCheckbox} />
                        //   <label for="chk-7" className="para">Niet gedefinieerd</label>
                        // </div>
                      ))
                    ) : <></>}
                  </div>
                  <div className="mb-30">
                    <h3 className="mb-0">Prodes status</h3>
                    {carStatusList.length > 0 ? (
                      carStatusList.map((item) => (
                        <div className="chkBox d-flex">
                          <input type="checkbox" checked={
                            item.carStatus ===
                            CarStatus
                          }
                            onChange={() =>
                              handleCarStatusCheckboxChange(
                                item.carStatus
                              )
                            }
                          />
                          <label for="chk-10" className="para">{item.carStatusName}</label>
                        </div>
                      ))
                    ) : <></>}

                  </div>
                  <div className="mb-30">
                    <h3 className="mb-0">Afgehandeld</h3>
                    <div className="d-flex align-items-center mb-2">
                      <span className="para min-w-30px pe-1">van</span>
                      {/* <input
                        type="text"
                        className="flex-fill form-control border-white me-8px datepicker"
                        value={CPeriodB}
                        onChange={(e) => setCPeriodB(e.target.value)}
                      /> */}
                      <ReactDatePicker className="flex-fill form-control border-white me-8px datepicker" dateFormat="dd/MM/yyyy" selected={CPeriodB} onChange={(date) => setCPeriodB(date)} />
                      <img className="ui-datepicker-trigger" src="images/calendar.png" alt="Select date" title="Select date"></img>
                      <button className="border-0 p-0 bg-transparent h-25px d-inline-flex align-items-center">
                        <img
                          src="images/close.png"
                          alt=""
                          width="10"
                          height="10"
                          onClick={(date) => setCPeriodB(null)}
                        />
                      </button>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="para min-w-30px pe-1">tot</span>
                      {/* <input
                        type="text"
                        className="flex-fill form-control border-white me-8px datepicker"
                        value={CPeriodE}
                        onChange={(e) => setCPeriodE(e.target.value)}
                      /> */}
                      <ReactDatePicker className="flex-fill form-control border-white me-8px datepicker" dateFormat="dd/MM/yyyy" selected={CPeriodE} onChange={(date) => setCPeriodE(date)} />
                      <img className="ui-datepicker-trigger" src="images/calendar.png" alt="Select date" title="Select date" ></img>
                      <button className="border-0 p-0 bg-transparent h-25px d-inline-flex align-items-center">
                        <img
                          src="images/close.png"
                          alt=""
                          width="10"
                          height="10"
                          onClick={(date) => setCPeriodE(null)}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="mb-30">
                    <h3 className="mb-1">Locatie</h3>
                    <select name="" id="" className="form-control border-white" value={StorageID}
                      onChange={(e) =>
                        handleStorageLocationChange(e.target.value)
                      }>
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
                  <div className="mb-30">
                    <h3 className="mb-1">Eigenaar</h3>
                    <input type="text" className="form-control border-white" id="vendorId"
                      value={VendorCode}
                      onChange={(e) => setVendorCode(e.target.value)} />
                  </div>
                  <div className="mb-30">
                    <h3 className="mb-0">Memo Type</h3>
                    {memoTypes.length > 0 ? (
                      memoTypes.map((item) => (

                        <div className="chkBox d-flex">
                          <input type="checkbox" checked={
                            item.memoType ===
                            CarMemo
                          }
                            onChange={() =>
                              handleMemoTypeCheckbox(
                                item.memoType
                              )
                            } />
                          <label for="chk-13" className="para">{item.memoTypeName}</label>
                        </div>
                      ))
                    )
                      : <></>}
                  </div>
                  <div className="mb-30">
                    <h3 className="mb-0">Factuur datum</h3>
                    <div className="d-flex align-items-center mb-2">
                      <span className="para min-w-30px pe-1">van</span>
                      {/* <input
                        type="text"
                        className="flex-fill form-control border-white me-8px datepicker"
                        value={IPeriodB}
                        onChange={(e) => setIPeriodB(e.target.value)}
                      /> */}
                      <ReactDatePicker className="flex-fill form-control border-white me-8px datepicker" dateFormat="dd/MM/yyyy" selected={IPeriodB} onChange={(date) => setIPeriodB(date)} />
                      <img className="ui-datepicker-trigger" src="images/calendar.png" alt="Select date" title="Select date"></img>
                      <button className="border-0 p-0 bg-transparent h-25px d-inline-flex align-items-center">
                        <img
                          src="images/close.png"
                          alt=""
                          width="10"
                          height="10"
                          onClick={(date) => setIPeriodB(null)}
                        />
                      </button>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="para min-w-30px pe-1">tot</span>
                      {/* <input
                        type="text"
                        className="flex-fill form-control border-white me-8px datepicker"
                        value={IPeriodE}
                        onChange={(e) => setIPeriodE(e.target.value)}
                      /> */}
                      <ReactDatePicker className="flex-fill form-control border-white me-8px datepicker" dateFormat="dd/MM/yyyy" selected={IPeriodE} onChange={(date) => setIPeriodE(date)} />
                      <img className="ui-datepicker-trigger" src="images/calendar.png" alt="Select date" title="Select date"></img>
                      <button className="border-0 p-0 bg-transparent h-25px d-inline-flex align-items-center">
                        <img
                          src="images/close.png"
                          alt=""
                          width="10"
                          height="10"
                          onClick={(date) => setIPeriodE(null)}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="mb-30">
                    <h3 className="mb-0">Ext. bron</h3>
                    {extStockStatusSourceList.length > 0 ? (
                      extStockStatusSourceList.map((item) => (
                        <div className="chkBox d-flex">
                          <input type="checkbox" checked={
                            item.extStockStatusSource ===
                            ExtStockStatusSource
                          }
                            onChange={() =>
                              handleExtStockStatusSourceCheckboxChange(
                                item.extStockStatusSource
                              )
                            }
                          />
                          <label for="chk-10" className="para">{item.extStockStatusSourceName}</label>
                        </div>
                      ))
                    ) : <></>}

                  </div>
                  <div className="mb-30">
                    <h3 className="mb-0">Ext. status</h3>
                    {extStockStatusList.length > 0 ? (
                      extStockStatusList.map((item) => (
                        <div className="chkBox d-flex">
                          <input type="checkbox" checked={
                            item.extStockStatus ===
                            ExtStockStatus
                          }
                            onChange={() =>
                              handleExtStockStatusCheckboxChange(
                                item.extStockStatus
                              )
                            }
                          />
                          <label for="chk-10" className="para">{item.extStockStatusName}</label>
                        </div>
                      ))
                    ) : <></>}
                  </div>
                  <div className="text-center">
                    <button className="btn btn-primary w-25 mr-1" onClick={handlefilterSearch}>Filter</button>
                    <button className="btn btn-secondary w-25" style={{ "marginLeft": "5px" }} onClick={handleClearSearch}>Clear</button>
                  </div>
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

export default CarList;
