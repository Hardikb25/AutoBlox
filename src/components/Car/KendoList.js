import * as React from "react";
import { useRef } from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import "@progress/kendo-theme-default/dist/all.css"; 
import { getUrl, postRequest } from "../ApiCalls";
import CONSTANT from "../Global";
import { Navigate, useNavigate } from "react-router";
import { useState } from "react";
import { encryptData, decryptData } from "../EncrypDecryptData";
import ReactDatePicker from "react-datepicker";
import { process } from "@progress/kendo-data-query";
import { GridColumnMenuSort, GridColumnMenuCheckboxFilter, GridColumnMenuItemGroup,GridColumnMenuItemContent,GridColumnMenuItem } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import DataLoader from "../Loader";


const columns = [{
  title: 'kenteken',
  field: 'kenteken',
  show: true,
  filter: 'text'
}, {
  title: 'Auto Details',
  field: 'carBrandModel',
  show: true,
  filter: 'text'
}, {
  title: 'Eigenaar/Workflow',
  field: 'sort_Owner_Protocol',
  show: true,
  filter: 'text'
}, {
  title: 'In Systeem',
  field: 'inProcess',
  show: true,
  filter: 'text'
}, {
  title: 'Aktie',
  field: 'action',
  show: true,
  filter: 'text'
}, {
  title: 'Locatie',
  field: 'carLocation',
  show: true,
  filter: 'text'
}];

const CustomColumnMenu = props => {
  
  const [columns, setColumns] = React.useState(props.columns);
  const [columnsExpanded, setColumnsExpanded] = React.useState(false);
  const [filterExpanded, setFilterExpanded] = React.useState(false);
  const [data]= React.useState(props.data);

  console.log(data)

  const onToggleColumn = id => {
    const newColumns = columns.map((column, idx) => {
      return idx === id ? {
        ...column,
        show: !column.show
      } : column;
    });
    setColumns(newColumns);
  };

  const onReset = event => {
    event.preventDefault();
    const newColumns = props.columns.map(col => {
      return {
        ...col,
        show: true
      };
    });
    setColumns(newColumns);
    props.onColumnsSubmit(newColumns);
    localStorage.setItem("kendogridColumnState", JSON.stringify(newColumns));
    if (props.onCloseMenu) {
      props.onCloseMenu();
    }
  };

  const onSubmit = event => {
    if (event) {
      event.preventDefault();
    }
    props.onColumnsSubmit(columns);
    localStorage.setItem("kendogridColumnState", JSON.stringify(columns));
    if (props.onCloseMenu) {
      props.onCloseMenu();
    }
  };

  const onMenuItemClick = () => {
    const value = !columnsExpanded;
    setColumnsExpanded(value);
    setFilterExpanded(value ? false : filterExpanded);
  };

  const onFilterExpandChange = value => {
    setFilterExpanded(value);
    setColumnsExpanded(value ? false : columnsExpanded);
  };

  const oneVisibleColumn = columns.filter(c => c.show).length === 1;

  return (
    <div>
      <GridColumnMenuSort {...props} />
      <GridColumnMenuCheckboxFilter 
        {...props} 
        data={data}
        onExpandChange={onFilterExpandChange} 
        expanded={filterExpanded} 
      />
      <GridColumnMenuItemGroup>
        <GridColumnMenuItem  
          title={'Columns'} 
          iconClass={'k-i-columns'} 
          onClick={onMenuItemClick} 
        />
        <GridColumnMenuItemContent show={columnsExpanded}>
          <div className={'k-column-list-wrapper'}>
            <form onSubmit={onSubmit} onReset={onReset}>
              <div className={'k-column-list'}>
                {columns.map((column, idx) => (
                  <div key={idx} className={'k-column-list-item'}>
                    <span>
                      <input
                        id={`column-visiblity-show-${idx}`}
                        className="k-checkbox k-checkbox-md k-rounded-md"
                        type="checkbox"
                        readOnly={true}
                        disabled={column.show && oneVisibleColumn}
                        checked={column.show}
                        onClick={() => onToggleColumn(idx)}
                      />
                      <label 
                        htmlFor={`column-visiblity-show-${idx}`} 
                        className="k-checkbox-label" 
                        style={{ userSelect: 'none',"marginLeft": "5px" }}
                      >
                        {column.title}
                      </label>
                    </span>
                  </div>
                ))}
              </div>
              <div className={'k-actions k-hstack k-justify-content-stretch'}>
                <Button type="reset" style={{"font-size":"1.3rem"}}>Reset</Button>
                <Button themeColor={'primary'} style={{"font-size":"1.3rem"}}>Save</Button>
              </div>
            </form>
          </div>
        </GridColumnMenuItemContent>
      </GridColumnMenuItemGroup>
    </div>
  );
};


function CarKendoList()
{
    const [cars, setCars] = useState([]);
    const [UserId, setUserId] = React.useState(
        "003b00e6-6dbf-4e97-b6bd-be0ddb3e5b7e"
      );
    const [ShowAllActions, setShowAllActions] = React.useState(true);
    const [SearchBy, setSearchBy] = React.useState(null);
    const [OwnerCompanyId, setOwnerCompanyId] = React.useState(-1);
    const history = useNavigate();
    const [VendorCode, setVendorCode] = React.useState("");
    const [StorageID, setStorageID] = React.useState(-1);
    const [StockControllerCompanyId, setStockControllerCompanyId] = React.useState(-1);
    const [StockStatus, setStockStatus] = React.useState(-1);
    const [CarMemo, setCarMemo] = React.useState(-1);
    const [CarStatus, setCarStatus] = React.useState(-1);
    const [ExtStockStatusSource, setExtStockStatusSource] = React.useState(null);
    const [ExtStockStatus, setExtStockStatus] = React.useState(null);
    const [DaysOnStockFrom, setDaysOnStockFrom] = React.useState(-1);
    const [DaysOnStockTo, setDaysOnStockTo] = React.useState(-1);
    const [CPeriodB, setCPeriodB] = React.useState(null);
    const [CPeriodE, setCPeriodE] = React.useState(null);
    const [IPeriodB, setIPeriodB] = React.useState(null);
    const [IPeriodE, setIPeriodE] = React.useState(null);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalRecords, setTotalRecords] = useState(0);
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [locations, setLocationsData] = React.useState([]);
    const [stockmanagers, setStockManagersData] = React.useState([]);
    const [stockstatatusoptions, setStockStatusOptions] = React.useState([]);
    const [memoTypes, setMemoTypes] = React.useState([]);
    const [carStatusList, setCarStatusList] = React.useState([]);
    const [extStockStatusSourceList, setExtStockStatusSourceList] = React.useState([]);
    const [extStockStatusList, setextStockStatusList] = React.useState([]);
    const [daysStockList, setdaysStockList] = React.useState([]);
    const [IsSnelfilter1, setIsSnelfilter1] = React.useState(false);
    const [IsSnelfilter2, setIsSnelfilter2] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [filter, setFilter] = useState(null);
    const [columnsVisibility, setColumnsVisibility] = useState({
      kenteken: true,
      carBrandModel: true,
      sort_Owner_Protocol: true,
      inProcess: true,
      action: true,
      carLocation: true,
    });
    const [sort, setSort] = React.useState({ field: '', dir: '' }); // Sorting state

    const [stateColumns, setStateColumns] = React.useState(columns);

    const onColumnsSubmit = columnsState => {
      setStateColumns(columnsState);
    };

    const toggleColumnVisibility = (columnKey) => {
      setColumnsVisibility((prevVisibility) => ({
        ...prevVisibility,
        [columnKey]: !prevVisibility[columnKey],
      }));
    };

    const handleCheckboxChange1 = () => {
      setIsSnelfilter1(!IsSnelfilter1);
    };
    
    const handleCheckboxChange2 = () => {
      setIsSnelfilter2(!IsSnelfilter2);
    };

    const handlefilterSearch = () => {
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
      fetchCars(tempStorageID, tempVendorCode, tempStockControllerCompanyId, tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo, tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
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
      setCarStatus(-1);
      setExtStockStatusSource(null);
      setExtStockStatus(null);
      setDaysOnStockFrom(-1);
      setDaysOnStockTo(-1);
      setCPeriodB(null);
      setCPeriodE(null);
      setIPeriodB(null);
      setIPeriodE(null);
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
      fetchCars(
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
    };

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
  

  const handleStorageLocationChange = (storageid) => {
    setStorageID(storageid);
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
    StorageLocationList(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo,tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
      fetchCars(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo, tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
  };

  const handleStockManagerCheckboxChange = (companyId) => {
    setStockControllerCompanyId(companyId);
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
    StorageLocationList(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo,tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
      fetchCars(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo, tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
  };

  const handleStockStatusCheckboxChange = (stockstatus) => {
    setStockStatus(stockstatus);
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
    StorageLocationList(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo,tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
      fetchCars(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo, tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
  };

  const handleMemoTypeCheckbox = (memoType) => {
    setCarMemo(memoType);
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
    StorageLocationList(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo,tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
      fetchCars(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo, tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
  };

  const handleCarStatusCheckboxChange = (carStatus) => {
    setCarStatus(carStatus);
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
    StorageLocationList(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo,tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
      fetchCars(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo, tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
  }

  const handleExtStockStatusSourceCheckboxChange = (extStockStatusSource) => {
    setExtStockStatusSource(extStockStatusSource);
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
    StorageLocationList(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo,tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
      fetchCars(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo, tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
  }

  const handleExtStockStatusCheckboxChange = (extStockStatus) => {
    setExtStockStatus(extStockStatus);
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
    StorageLocationList(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo,tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
      fetchCars(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
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
    StorageLocationList(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo,tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
    fetchCars(tempStorageID, tempVendorCode, tempStockControllerCompanyId,
      tempStockStatus, tempMemoType, tempcarStatus, tempExtStockStatusSource, tempExtStockStatus, tempDaysOnStockFrom, tempDaysOnStockTo, tempCPeriodB, tempCPeriodE, tempIPeriodB, tempIPeriodE);
  }

  const fetchCars = (
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
    tempIPeriodE) => {
    
    setIsLoading(true);
    const data = {
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
      SearchBy: SearchBy === null ? SearchBy : SearchBy.replace(/[-\s]/g, ""),
      StockStatus: tempStockStatus,
      DaysOnStockFrom: tempDaysOnStockFrom,
      DaysOnStockTo: tempDaysOnStockTo,
      ExtStockStatusSource: tempExtStockStatusSource,
      ExtStockStatus: tempExtStockStatus,
      StockControllerCompanyId: tmpStockControllerCompanyId,
      OwnerCompanyId: OwnerCompanyId,
      PageNumber: currentPage,
      PageSize: pageSize,
      SortField: sortField,
      SortOrder: sortOrder,
    };
    postRequest({
      requesturl: getUrl() + `/Car/GetCars`,
      formData: data,
    }).then((res) => {
      if (res.status === 401) {
        history("/");
      } else if (res) {
        setCars(res.data.list);
        setTotalRecords(res.data.totalItems);
        setIsLoading(false);
      }
    });
  };

  React.useEffect(() => {
    
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

    const savedColumns = localStorage.getItem("kendogridColumnState");
    if (savedColumns) {
      setStateColumns(JSON.parse(savedColumns));
    }
    fetchCars(
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
      tempIPeriodE)
  }, [currentPage, pageSize, sortField, sortOrder]);

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

  const handlePageChange = (event) => {
    const { skip, take } = event.page;  
    setCurrentPage(skip / take + 1); 
    setPageSize(take); 
    fetchCars(
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
  };

  const handleSortChange = (event) => {
    const sort = event.sort[0];
    const updatedSort = {
      ...sort,
      field: sort?.field === "carBrandModel" 
        ? "sort_CarDetails" 
        : sort?.field === "carLocation" 
        ? "location" 
        : sort?.field,
    };
  
    // if(sort?.field=="carBrandModel")
    // {
    //   sort?.field="sort_CarDetails";
    // }
    // else if(sort?.field=="carLocation")
    // {
    //   sort?.field="location";
    // }
    // setSortField(sort?.field || "");
    // setSortOrder(sort?.dir || "");

    setSortField(updatedSort.field || "");
    setSortOrder(updatedSort.dir || "");
  };

  // const handleSortChange = (event) => {
  //   const sortField = event.sort[0]?.field;
  //   const sortDirection = event.sort[0]?.dir;

  //   setSort({ field: sortField, dir: sortDirection });

  //   // Sort the data locally
  //   const sortedData = [...cars].sort((a, b) => {
  //     if (sortField) {
  //       const aValue = a[sortField] || '';
  //       const bValue = b[sortField] || '';

  //       if (sortDirection === 'asc') {
  //         return aValue > bValue ? 1 : -1;
  //       } else {
  //         return aValue < bValue ? 1 : -1;
  //       }
  //     }
  //     return 0;
  //   });

  //   setCars(sortedData);
  // };

  const AutoDetailsCell = (props) => {
    const { dataItem } = props;
      return (
        <td>
          <div className="d-flex max-w-215 align-items-start">
            <div className="carimgBox min-w-74px">
              <img
                src={dataItem.imageURL !== "" && dataItem.imageURL !== null && !(dataItem.imageURL == undefined) ?CONSTANT.IMAGE_URL+ dataItem.imageURL.replaceAll("\\", "/") : "images/car-1.jpg"} 
                alt=""
                width="100%"
                height="64"
                className="object-cover rounded-1"
              />
            </div>
            <div className="carDetails d-flex justify-content-between flex-column pt-1">
              <a
                href={`/CarDetail?Id=${encryptData(dataItem.carId)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onSelectCar(dataItem.carId)}
              >
                {/* <div
                dangerouslySetInnerHTML={{
                  __html: dataItem.carBrandModel, 
                }}
              /> */}
              <div>{dataItem.carBrandModel}</div>
              </a>
            </div>
          </div>
        </td>
      );
  };

  const PlainTextCell = (props) => {
    const { dataItem, field } = props;
    const plainText = dataItem[field]?.replace(/<br\s*\/?>/g, " ") || "";
    return <td>{plainText}</td>;
  };

  const onSelectCar = (carId) => {
    console.log(`Selected car ID: ${carId}`);
  };

  const filterData = (data, filter) => {
    if (!filter) return data;
    return process(data, { filter });
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
    fetchCars(
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
      tempIPeriodE);
  };

  const handleColumnVisibilityChange = (columnField) => {
    setColumnsVisibility((prevState) => ({
      ...prevState,
      [columnField]: !prevState[columnField],
    }));
  };

  
   
      return (
        <React.Fragment>
          <div className="conatiner-fluid content-inner  py-0">
            <section className="midSec">
              <div className="container">
                  {isLoading ? (
                    <React.Fragment>
                      <DataLoader />
                    </React.Fragment>
                  ) : (
                        <div className="row align-items-start">
                          <div className="col-9">
                            <Grid
                              data={filterData(cars, filter)}
                              filter={filter} 
                              onFilterChange={(e) => setFilter(e.filter)}
                              resizable={true}
                              total={totalRecords}
                              skip={(currentPage - 1) * pageSize}
                              take={pageSize}
                              pageable={true}
                              // sortable={true}
                              onSortChange={handleSortChange}
                              // onSortChange={handleSortChange} // Local sort handler
                              onPageChange={handlePageChange}
                            >
                            
                            {stateColumns.map((column, idx) => column.show && (
                                <GridColumn 
                                  key={idx}
                                  field={column.field} 
                                  title={column.title} 
                                  filter={column.filter}
                                  width={column.field === 'kenteken' ? '80px' : (column.field === 'carBrandModel' ? '200px' : (column.field === 'sort_Owner_Protocol' ? '140px' : (column.field === 'inProcess' ? '90px' : 'auto')))}  
                                  cell={column.field === 'carBrandModel'?AutoDetailsCell:undefined}
                                  columnMenu={props => (
                                    <CustomColumnMenu 
                                      {...props} 
                                      columns={stateColumns} 
                                      onColumnsSubmit={onColumnsSubmit} 
                                      data={cars}
                                    />
                                  )}
                                />
                              ))}
                            </Grid>
                          </div>
                          <div className="col-3 position-sticky top-0">
                <div className="bg-lightgray pa-15 pb-30 rounded-2">
                  <h2 className="mb-3">Filter</h2>

                  <div className="searchBox carSearch rounded-1 d-flex position-relative mb-22">
                    <input type="search" className="flex-fill" value={SearchBy}
                      onChange={(e) => setSearchBy(e.target.value)} />
                    <button className="searchIcon" onClick={handleKentekenSearch}></button>
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
                     )
                  }
              </div>
            </section>
          </div>
        </React.Fragment>
      );
}

export default CarKendoList;