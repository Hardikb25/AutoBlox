import * as React from 'react';
import { useRef } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Page, ExcelExport, PdfExport, Edit, Inject, Filter } from '@syncfusion/ej2-react-grids';
import { GroupSettingsModel, FilterSettingsModel, ContextMenuItem, EditSettingsModel, ColumnMenu, Toolbar } from '@syncfusion/ej2-react-grids';
//import './grid-context-menu.css';
import { getUrl, postRequest } from "../ApiCalls";
import CONSTANT from "../Global";

function CarDetailsSync() {

    const [cars, setListData] = React.useState([]);
    const contextMenuItems = ['AutoFit', 'AutoFitAll',
        'SortAscending', 'SortDescending', 'Copy', 'Edit', 'Delete', 'Save',
        'Cancel', 'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
        'LastPage', 'NextPage'];
    const editing = { allowDeleting: true, allowEditing: true }
    const [isLoading, setLoading] = React.useState(true);
    const [TotalRecords, setTotalRecords] = React.useState(50);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [currentPage2, setCurrentPage2] = React.useState(1);
    const [pageSettings, setPageSettings] = React.useState({ pageSize: 20, totalRecordsCount: TotalRecords ,currentPage: currentPage2});
    let grid;
    const filterSettings = { type: "CheckBox" };
    const toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
    const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true };
    const selectionSettings = { allowColumnSelection: true };
    const customeridRule = { required: true, minLength: 5 };
    const orderidRules = { required: true, number: true };
    const freightRules = { required: true, min: 0 };
    const columnMenuOptions = [
        { id: 'Default', text: 'Default' },
        { id: 'Custom', text: 'Custom' },
    ];
    const [memoTypes, setMemoTypes] = React.useState([]);

    const [CarStatus, setCarStatus] = React.useState(-1);
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
    const [OwnerCompanyId, setOwnerCompanyId] = React.useState(-1);
    
    function columnMenuClick(args) {
        if (args.item.id === 'select_column') {
            grid.selectionModule.selectColumn(args.column.index);
            // custom function
        }
        else if (args.item.id === 'clear_column') {
            // custom function
            grid.selectionModule.clearColumnSelection();
        }
    }
      React.useEffect(() => {
    // gridInstance.refresh();
    }, []);
    function change(e) {
        let gridMenuOption = e.value;
        if (gridMenuOption === 'Custom') {
            let columnMenuItems = [
                'SortAscending',
                'SortDescending',
                'Filter',
                { text: 'Select Column', id: 'select_column' },
                { text: 'Clear column selection', id: 'clear_column' },
            ];
            grid.columnMenuClick = columnMenuClick;
            grid.columnMenuItems = columnMenuItems;
        }
        else {
            grid.columnMenuClick = undefined;
            grid.columnMenuItems = undefined;
        }
    }
    const getCars = (
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
        tempCurrentPage=-1,
        sortField = "",
        sortOrder = "",
        tmpSearchBy
      ) => {
        let data = {
            UserId: "003b00e6-6dbf-4e97-b6bd-be0ddb3e5b7e",
            ShowAllActions: true,
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
            PageNumber: tempCurrentPage !== -1 ? tempCurrentPage : currentPage,
            Pagesize: 20,           
            SortField: "ProcessActivationTime",
            SortOrder: "desc",
        };
        setLoading(true)
        postRequest({
            requesturl: getUrl() + `/Car/GetCars`,
            formData: data,
        }).then((res) => {
            if (res.status == 401) {

            }
            else if (res) {
                setPageSettings({ totalRecordsCount: res.data.totalItems || 0 });
                setListData(res.data.list);
                setTotalRecords(res.data.totalItems);
                setCurrentPage(currentPage)
                //gridInstance.pageSettings.currentPage = currentPage;
                setLoading(false)

            }
        });
    }

    React.useEffect(() => {
        
        console.log("first time")
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
        getCars(
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
    }, [])

    const dataStateChange = (state) => {
        const skip = state.skip || 0;
        const take = state.take || 12;
        //fetchData({ skip, take });
        console.log(skip + "skip")
        console.log(take + "take")
    };
    const onActionBegin = (args) => {
        if (args.requestType === "paging" && args.currentPage !== currentPage) {
            const currentPage = args.currentPage;
            const pageSize = args.pageSize;
            getCars(StorageID, VendorCode, StockControllerCompanyId, StockStatus, CarMemo, CarStatus, ExtStockStatusSource, ExtStockStatus, DaysOnStockFrom, DaysOnStockTo, CPeriodB, CPeriodE, IPeriodB,IPeriodE,args.currentPage);

            console.log(`Page changed to: ${currentPage}, Page size: ${pageSize}`);
            console.log('Page changed to:'+gridInstance.pageSettings.currentPage);
            setCurrentPage(args.currentPage);
            setCurrentPage2(args.currentPage);
            (gridInstance.pagerModule).goToPage(args.currentPage);
            setPageSettings((prev) => ({ ...prev, currentPage: args.currentPage }))

           // gridInstance.pageSettings.currentPage=args.currentPage;
            
        }
    };
    let gridInstance;
    const isInitialLoad = useRef(true);
const onDataBound = () => {
  console.log(gridInstance.pageSettings.currentPage +'ondatabound');
  console.log(gridInstance.pageSettings.totalRecordsCount +'ondatabound');
  //console.log(currentPage+'ondatabound')
  console.log(TotalRecords+'TotalRecords')
  if (isInitialLoad.current) {
    isInitialLoad.current = false;
    gridInstance.pageSettings.totalRecordsCount = TotalRecords 
    return;
    //gridInstance.pageSettings.totalRecordsCount = TotalRecords;
}
else{
    console.log("caaaa"+" "+ currentPage)
    gridInstance.pageSettings.totalRecordsCount = TotalRecords ;
    (gridInstance.pagerModule).goToPage(currentPage2);
    //gridInstance.pageSettings.currentPage = currentPage2

}
  //gridInstance.pageSettings.currentPage=2;
};

const onActionComplete = (args) => {
    if (args.requestType === "paging") {
      console.log("Paging action completed.");
    }
}
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
    
    return (
        <div className='container'>
            <div className="row align-items-start">
                <div className="col-9">

                    {!isLoading &&
                        
                        <div className=''>
                            <GridComponent dataBound={onDataBound} ref={(grid) => (gridInstance = grid)} dataSource={cars} allowPaging={true} pageSettings={pageSettings} actionBegin={onActionBegin} allowSorting={true} allowFiltering={true} showColumnMenu={true} actionComplete={onActionComplete} filterSettings={filterSettings}>
                                <ColumnsDirective>
                                    <ColumnDirective field='kenteken' headerText='Kenteken' width='120' textAlign='Right'></ColumnDirective>
                                    <ColumnDirective field='sort_CarDetails' headerText='Auto Details' width='160'></ColumnDirective>
                                    <ColumnDirective field='sort_Owner_Protocol' headerText='Eigenaar/workflow' format='C2' textAlign='Right' width='120' editType='numericedit' />
                                    <ColumnDirective field='inProcess' headerText='In systeem' width='200'></ColumnDirective>
                                    <ColumnDirective field='action' headerText='Aktie' width='150' ></ColumnDirective>
                                    <ColumnDirective field='location' headerText='Location' width='150'></ColumnDirective>
                                </ColumnsDirective>
                                <Inject services={[Resize, Sort, ColumnMenu, Filter, Page, Edit, Toolbar]} />
                            </GridComponent>
                        </div>
                    }

                </div>
                
            </div>
        </div >
    )
}
export default CarDetailsSync;