import * as React from "react";
import { getRequest, getUrl, postRequest } from "../ApiCalls";
import CONSTANT from "../Global";
import List from "../List/List";
import DataLoader from "../Loader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CarKentekenStep from "./CarKentekenStep";
import ModalPopup from "../Modal/ModalPopup";
import ValidateString from "./Validate";
import Pagination from "../List/Pager";
import { Navigate,useNavigate } from "react-router";

function CarTodoTab(props) {
  const history = useNavigate();
  const [bid, setbid] = React.useState(0);
  const [slotCount, setslotCount] = React.useState(0);
  const [PriceTypeCode, setPriceTypeCode] = React.useState(0);
  const [IsBtw, setIsBtw] = React.useState(false);
  const [slotType, setslotType] = React.useState("A");
  const [SlotList, setSlotList] = React.useState([]);
  const [SlotId, setSlotId] = React.useState(0);
  const [SlotTypeID, setSlotTypeID] = React.useState(3);
  const [PriceStart, setPriceStart] = React.useState(0.0);
  const [PriceMin, setPriceMin] = React.useState(0.0);
  const [DepreciationMonths, setDepreciationMonths] = React.useState(0);
  const [IsDirectSale, setIsDirectSale] = React.useState(false);
  const [CompanyList, setCompanyList] = React.useState(false);
  const [TotalRecords, setTotalRecords] = React.useState(0);
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
  const [SortColumn, setSortColumn] = React.useState("companyName");
  const [SortOrder, setSortOrder] = React.useState("");
  const [isLoading, setLoading] = React.useState(true);
  const [SortingOrder, setSortingOrder] = React.useState("asc");
  const [isLoadingCompany, setLoadingCompany] = React.useState(true);
  const [SearchBy, setSearchBy] = React.useState("");
  const [SelectedCompany, setSelectedCompany] = React.useState("");
  const [SaleDate, setSaleDate] = React.useState(Date());
  const [ModalTitleForKenteken, setModalTitle] = React.useState("");
  const [CarSaleStatus, setCarSaleStatus] = React.useState({});
  const [CarDocs, setCarDocs] = React.useState({});
  const [IsKentekenStepCompleted, setIsKentekenStepCompleted] =
    React.useState(false);
  const [ownerDocNo, setOwnerDocNo] = React.useState("");
  const [ownerDocCode, setOwnerDocCode] = React.useState("");
  const [meldCode, setMeldCode] = React.useState("");
  const [Price, setPrice] = React.useState(0.0);
  const [Limit, setLimit] = React.useState(0.0);
  const [ShowToDo, setShowToDo] = React.useState(false);
  const [CurrentActiveStep, setCurrentActiveStep] = React.useState("");
  const [lastClick, setLastClick] = React.useState(null); 
  const [isKenteknModal, setkenteknModal] = React.useState(false);
  const [LastPageReaminNo,setLastPageReaminNo]=React.useState(0);
  const column = [
    { heading: "", value: "Selection", doNotApplySorting: 1 },
    { heading: "Bedrijfsnaam", value: "companyName", doNotApplySorting: 0 },
    { heading: "Code", value: "code", doNotApplySorting: 0 },
    { heading: "KvK nr.", value: "companyKvK", doNotApplySorting: 0 },
    { heading: "Telefoon", value: "owner_Protocol", doNotApplySorting: 0 },
    { heading: "Land", value: "countryName", doNotApplySorting: 0 },
    { heading: "Plaats", value: "addressCity", doNotApplySorting: 0 },
    { heading: "PC", value: "addressPC", doNotApplySorting: 0 },
    { heading: "Straat", value: "addressStreet", doNotApplySorting: 1 },
  ];
  React.useEffect(() => {
    setLoading(true);
    let isShowTodo = false;
    getRequest({
      requesturl:
        getUrl() +
        `/CarProtocolStep/GetCarProtocolSteps?CarId=` +
        props.car.carId,
    }).then((res) => {
      if (res) {
        if (res.model != null) {
          res.model.protocolSteps.map((steps) => {
            if (steps.protocolStepId == 12 && steps.isActive) {
              isShowTodo = true;
              setShowToDo(true);
            }
            if (steps.isActive) {
              setCurrentActiveStep(steps.protocolStepDetails.protocolStepName);
            }
          });
        }
      }
      setLoading(false);

    });
  }, []);
  React.useEffect(() => {
    if (ShowToDo) {
      
      SetSaleStatusData();
      GetCompanyList("", "", SearchBy);
      GetCarReadyForSaleDetails();
      Getslots();
      GetCarKentekenModalTitle();
    }
  }, [SlotTypeID, SelectedCompany, slotType, ShowToDo, IsDirectSale]);

  React.useEffect(() => {
    if (ShowToDo) {
      GetCompanyList("", "", SearchBy);
    }
  }, [currentPage]);
  React.useEffect(() => {
    if (ShowToDo) {
      GetCarDocs();
    }
  }, [ShowToDo]);
  const GetCarKentekenModalTitle = () => {
    setLoading(true);
    getRequest({
      requesturl:
        getUrl() +
        `/CarProtocolStep/GetKentekenDialogTitle?CarId=` +
        props.car.carId +
        `&UserCompanyID=` +
        localStorage.getItem("CompanyId"),
    }).then((res) => {
      if (res) {
        setModalTitle(res);
        
      }
      setLoading(false);
    });
  };
  const Getslots = () => {
    setLoading(true);
    getRequest({
      requesturl:
        getUrl() +
        `/CarSlots/GetSlotsAvailableForOwner?CarId=` +
        props.car.carId +
        `&SloType=` +
            slotType +
            `&AdminID=` + CONSTANT.ADMIN_COMAPNY_ID,
    }).then((res) => {
      if (res) {
        const Slotslist = [];
        res.list.forEach((element) => {
          var sltype =
            (element.peepSlotTypeId > 0
              ? element.peepTypeName
              : element.slotTypeName) +
            ", " +
            (element.isOpenSlot ? "Open" : "Gesloten");
          var slotInfo =
            (element.slotDateTime == null ? "" : element.slotDateTime + " : ") +
            element.slotName +
            (sltype != ""
              ? " [" + sltype + "] " + "(" + element.slotCurrentCount + ")"
              : "");
          Slotslist.push({
            slotInfo: slotInfo,
            slotTypeId: element.slotTypeId,
            slotId: element.slotId,
          });
        });
        setSlotList(Slotslist);
      }
      setLoading(false);

    });
  };

  const GetCarReadyForSaleDetails = () => {
    setLoading(true);
    getRequest({
      requesturl:
        getUrl() + `/Car/GetCarReadyForSaleInfo?CarId=` + props.car.carId,
    }).then((res) => {
      if (res) {
        res.list.forEach((element) => {
          setbid(element.bid);
          setslotCount(element.slotCount);
          
        });
      }
      setLoading(false);
    });
  };

  const GetCompanyList = (sortField = "", sortOrder = "", search = "") => {
    setLoadingCompany(true);
    let data = {
      CarCompanyID: props.car.companyId,
      isDisabled: 0,
      recType: 2,
      isUsedInContext: 1,
      contextDependance: 4,
      DebtorNoAdminCompanyID: CONSTANT.ADMIN_COMAPNY_ID,
      CallerIsAdmin: 1,
      CallerCompanyID: CONSTANT.ADMIN_COMAPNY_ID,
      PageNumber: currentPage,
      PageSize: pageNumberLimit,
      SortField: sortField ? sortField : SortColumn,
      SortOrder: sortOrder ? sortOrder : SortingOrder,
      SearchBy: search,
    };
    postRequest({
      requesturl: getUrl() + `/Company/GetCompanyList`,
      formData: data,
    }).then((res) => {
      if (res) {
        setTotalRecords(res.data.totalItems);
        setCompanyList(res.data.list);
        setStartIndex((currentPage - 1) * pageNumberLimit);
        let endind =
          (currentPage - 1) * pageNumberLimit + (pageNumberLimit - 1);
        setEndIndex(
          endind + 1 > res.data.totalItems ? res.data.totalItems - 1 : endind
        );
      }
      setLoading(false);
      setLoadingCompany(false);
    });
  };
  const onChangeSlotList = (event) => {
    var splitString = event.target.value.split("^");
    setSlotTypeID(splitString[0]);
    setSlotId(splitString[1]);
  };

  const SetSaleStatusData = () => {
    setLoading(true);
    getRequest({
      requesturl:
        getUrl() +
        `/CarSaleStatus/GetCarSaleStatusByCarId?CarId=` +
        props.car.carId,
    }).then((res) => {
      if (res) {
        setCarSaleStatus(res.model);
        setPriceStart(res.model.priceStart);
        setPriceMin(res.model.priceMin);
        setDepreciationMonths(res.model.depreciationMonths);
      
      }
      setLoading(false);
    });
  };
  function onChangeSlotType(event) {
    setslotType(event.target.value);
  }

  function ChangeOwnerDocNo(e) {
    setOwnerDocNo(e.target.value);
  }

  function ChangeOwnerDocCode(e) {
    setOwnerDocCode(e.target.value);
  }

  function ChangeMeldcode(e) {
    setMeldCode(e.target.value);
  }

  const onClickDirectSale = (event) => {
    setIsDirectSale(!IsDirectSale);
  };

  const onClickSerachKoper = (event) => {
    event.preventDefault();
    //setshowModal(true)
  };
  const onPrevClick = () => {
    if(lastClick > 0 && (currentPage - 1) % pagination !== 0){
        if(lastClick === 1){
            if(Number.isInteger(maxPageLimit/pagination)!==true){
                setMaxPageLimit(maxPageLimit - (Math.ceil(TotalRecords / pageNumberLimit) % pagination));
            }
            else{
                setMaxPageLimit(maxPageLimit - ((Math.ceil(TotalRecords / pageNumberLimit) % pagination))-LastPageReaminNo);

            }
          setMinPageLimit(minPageLimit - pagination)
        }
        setLastClick(lastClick -1);
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
    if(Math.ceil(TotalRecords / pageNumberLimit) % pagination === 0){
        tempmaxlimit=Math.ceil(TotalRecords / pageNumberLimit)-pagination;
        setMinPageLimit(tempmaxlimit);
    }
    else{
     tempmaxlimit=Math.ceil(TotalRecords / pageNumberLimit)-(Math.ceil(TotalRecords / pageNumberLimit) % pagination);
        setMinPageLimit(tempmaxlimit);
    }
    setLastPageReaminNo((tempmaxlimit+pagination) - (Math.ceil(TotalRecords / pageNumberLimit)));
    setLastClick(Math.ceil(TotalRecords / pageNumberLimit) % pagination);
  };
  
const onPageChange = (pageNumber) => {
    setLastClick(pageNumber - minPageLimit);
    setCurrentPage(pageNumber );
};
  const onOrderChange = (columnname, order) => {
    setSortColumn(columnname);
    setSortingOrder(order);
    handleSorting(columnname, order);
  };
  const handleSorting = (sortField, sortOrder) => {
    if (sortField) {
      setSortingOrder(sortOrder);
      //setLoading(true);
      GetCompanyList(sortField, sortOrder, SearchBy);
    }
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
  };
  const handleCompanySearch = (event) => {
    setCurrentPage(1);
    GetCompanyList("", "", SearchBy);
  };
  const handleCompanySearchChange = (event) => {
    setSearchBy(event.target.value);
  };
  const handleCompanySearchRemove = (event) => {
    setSearchBy("");
    setCurrentPage(1);
    GetCompanyList("", "", "");
  };
  const onSelectCompany = (data) => {
    setSelectedCompany(data.companyName);
  };

  const OnChangeDate = (event) => {
    setSaleDate(event);
  };
  const GetCarDocs = () => {
    setLoading(true);
    getRequest({
      requesturl: getUrl() + `/CarDocs/GetCarDocsById?CarId=` + props.car.carId,
    }).then((res) => {
      if (res.model != null) {
        var IsKentekenCompleted = false;
        if (
          !res.model.hasKenteken ||
          !res.model.ownerCodeMandatory ||
          res.model.ownerNoCode
        )
          IsKentekenCompleted = true;
        else {
          if (res.model.HasOldPapers)
            IsKentekenCompleted =
              props.car.duplicateCode.Length == 3 &&
              !isNaN(props.car.duplicateCode.Substring(0, 2)) &&
              isNaN(props.car.duplicateCode[2]) &&
              props.car.meldCode != null;
          else IsKentekenCompleted = res.model.isOwnerCodeComplete;

          if (IsKentekenCompleted)
            IsKentekenCompleted =
              props.carProperties.Kilometers >= 0 ||
              res.model.ownerMileage >= 0;
        }
        setIsKentekenStepCompleted(IsKentekenCompleted);
        setCarDocs({
          ...res.model,
          isKentekenCompleted: { IsKentekenCompleted },
        });
        
      }
    });
  };
  const HandleModalOKClick = (e) => {
    e.preventDefault();
    let result = "";
    if (ownerDocNo || ownerDocCode || meldCode) {
      result = ValidateString(
        ownerDocNo,
        "^[0-9]{10}$",
        "documentnummer dient uit 10 nummers te bestaan!"
      );
      result += ValidateString(
        ownerDocCode,
        "^[0-9]{9}$",
        "Tenaamstellingscode dient uit 9 nummers te bestaan!"
      );
      result += ValidateString(
        meldCode,
        "^[0-9]{4}$",
        "Meldcode dient uit 4 nummers te bestaan!"
      );
      if (result) {
        alert(result);
        setkenteknModal(false);
      } else {
        setkenteknModal(true);
        setIsKentekenStepCompleted(true);
      }
    }
  };
  const styles = {
    datepicker: {
      width: "100%",
    },
  };
  return isLoading ? (
    <React.Fragment>
      <DataLoader />
    </React.Fragment>
  ) : !ShowToDo ? (
    <React.Fragment>
      <p>
        <strong>{CurrentActiveStep} step is currently active </strong>{" "}
      </p>
    </React.Fragment>
  ) : (
    <React.Fragment>
      {
        <>
          <div
            className="modal fade"
            id="exampleModal2"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog max-w-800px modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header text-white bg-primary p-4">
                  <h2 className="text-white mb-0 text-ellipsis">
                    Verkoper selectie
                  </h2>
                  <button
                    type="button"
                    className="btn-close text-white"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>

                <div className="modal-body p-4 pb-5">
                  <div className="d-flex align-items-center justify-content-end mb-3">
                    <div className="searchBox rounded-1 d-flex h-30px me-2">
                      <input type="search" className="flex-fill" onChange={(e)=>handleCompanySearchChange(e)} value={SearchBy}/>
                      <button className="searchIcon" onClick={handleCompanySearch}></button>
                    </div>
                    <button className="border-0 p-0 bg-transparent w-30px h-30px min-w-30px min-h-30px d-inline-flex align-items-center justify-content-center bg-primary rounded-1" onClick={handleCompanySearchRemove}>
                      <img
                        src="images/close-white.svg"
                        alt=""
                        width="10"
                        height="10"
                      />
                    </button>
                  </div>
                  <h2 className="mb-2">
                  Items {(StartIndex + 1).toLocaleString("nl")} tot{" "}
                                          {(EndIndex + 1).toLocaleString("nl")} van{" "}
                                          {TotalRecords.toLocaleString("nl")}
                                        </h2>
                  {/* <!-- Button - pagination div start --> */}
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
                  {/* <!-- Button - pagination div end --> */}

                  {isLoadingCompany ? (
                    <React.Fragment>
                      <DataLoader />
                    </React.Fragment>
                  ) : (
                    <List
                      column={column}
                      data={CompanyList}
                      {...paginationAttributes}
                      onSelectCompany={onSelectCompany}
                    />
                  )}

                  {/* <!-- Button - pagination div start --> */}
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
                  {/* <!-- Button - pagination div end -->                     */}
                </div>
              </div>
            </div>
          </div>
          <div>
            <ModalPopup
              modalId={"CompleteKenteken"}
              modalTitle={ModalTitleForKenteken}
              modelOkClick={HandleModalOKClick}
              kenteknModalComplete={()=>isKenteknModal}
              Modalbody={
                <CarKentekenStep
                  car={props.car}
                  carProperties={props.carProperties}
                  carSaleStatus={CarSaleStatus}
                  carDocs={CarDocs}
                  changeOwnerDocNo={ChangeOwnerDocNo}
                  changeOwnerDocCode={ChangeOwnerDocCode}
                  changeMeldcode={ChangeMeldcode}
                >
                
                </CarKentekenStep>
              }
            ></ModalPopup>
          </div>
          {/* <div
            className="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog max-w-700px">
              <div className="modal-content">
                <div className="modal-header text-white bg-primary p-4">
                  <h2 className="text-white mb-0 text-ellipsis">
                    Kenteken codes van Republic Auto naar ... (nog onbekend)
                  </h2>
                  <button
                    type="button"
                    className="btn-close text-white"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>

                {/* <CarKentekenStep
                  car={props.car}
                  carProperties={props.carProperties}
                  carSaleStatus={CarSaleStatus}
                  carDocs={CarDocs}
                  changeOwnerDocNo={ChangeOwnerDocNo}
                  changeOwnerDocCode={ChangeOwnerDocCode}
                  changeMeldcode={ChangeMeldcode}
                >
                  {" "}
                </CarKentekenStep> */}

                {/*  <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Annuleren
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    onClick={HandleModalOKClick}
                  >
                    Ok
                  </button>
                </div>
              </div>
            </div>
          </div> */}
        </>
      }

      <div className="border border-primary rounded-2 pa-15 pb-30">
        <h2 className="mb-4 pb-2">In verkoop zetten</h2>

        <div className="d-flex align-items-center mb-3">
          <span className="para min-w-175px pe-1">Slot type</span>
          <div className="d-flex align-items-center checkbox-me-60">
            <div className="chkBox d-flex" onChange={onChangeSlotType}>
              <input
                type="radio"
                id="radio-bca1"
                value="B"
                name="radio-bca"
                checked={slotType == "B"}
              />
              <label for="radio-bca1" className="para">
                BCA
              </label>
            </div>
            <div className="chkBox d-flex" onChange={onChangeSlotType}>
              <input
                type="radio"
                id="radio-bca"
                name="radio-bca"
                value="A"
                checked={slotType == "A"}
              />
              <label for="radio-bca" className="para">
                AutoBLOX
              </label>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center mb-3">
          {IsDirectSale ? (
            <>
              <span className="para min-w-175px pe-1">Kooper</span>
              <div className="d-flex">
                <div className="d-flex w-450px bg-lightgray rounded-1">
                  <div className="h-30px flex-fill d-flex align-items-center px-3">
                    <label className="text-ellipsis">{SelectedCompany}</label>
                  </div>
                  <button
                    className="searchIcon"
                    onClick={onClickSerachKoper}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal2"
                  ></button>
                </div>
              </div>
            </>
          ) : (
            <>
              <span className="para min-w-175px pe-1">Slot</span>
              <div className="d-flex">
                <select
                  name=""
                  id=""
                  className="form-control w-450px"
                  onChange={onChangeSlotList}
                >
                  {SlotList.map((element) => (
                    <option
                      key="1"
                      value={element.slotTypeId + "^" + element.slotId}
                    >
                      {element.slotInfo}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          <button
            className="btn btn-primary ms-8px"
            onClick={onClickDirectSale}
          >
            <i className="trashIcon"></i>
            <span>{IsDirectSale ? "Veiling verkoop" : "Direct verkoop"}</span>
          </button>
        </div>
        <div className="d-flex align-items-center mb-3">
          <span className="para min-w-175px pe-1">Aantal maal aangeboden</span>
          <span className="para">{bid}</span>
        </div>

        <div className="d-flex align-items-center mb-3">
          <span className="para min-w-175px pe-1">Hoogste bod</span>
          <span className="para">{slotCount - 1}</span>
        </div>

        <div className="d-flex align-items-center mb-3">
          <span className="para min-w-175px pe-1">Prijzen</span>
          <span className="para">
            {PriceTypeCode == 0
              ? "incl BTW & BPM"
              : IsBtw
              ? "excl BTW & BPM"
              : "Marge"}
          </span>
        </div>

        <div className="d-flex align-items-center mb-3">
          <span className="para min-w-175px pe-1">Beschikbaar</span>
          <span className="para">Meteen na verkoop </span>
        </div>
        <div className="row">
          <div className="col">
            <label className="form-label in text-danger"> </label>
          </div>
        </div>

        {!IsDirectSale ? (
          <>
            <div className="d-flex align-items-center mb-4 pb-2">
              <span className="para min-w-175px pe-1">Startprijs</span>
              <input type="text" className="form-control w-315px" onChange={(e) =>setPriceStart(e.target.value)} value={PriceStart > 0 ? PriceStart : ""} />
            </div>
            <div className="d-flex align-items-center mb-4 pb-2">
              <span className="para min-w-175px pe-1">Eind prijs</span>
              <input type="text" className="form-control w-315px" onChange={(e) => setPriceMin(e.target.value)} value={PriceMin > 0 ? PriceMin : ""} />
            </div>
            <div className="d-flex align-items-center mb-4 pb-2">
              <span className="para min-w-175px pe-1">Maanden</span>
              <input type="text" className="form-control w-315px" onChange={(e) => setDepreciationMonths(e.target.value)} value={DepreciationMonths > 0 ? DepreciationMonths : ""} />
            </div>
          </>
        ) : (
          <>
            <div className="d-flex align-items-center mb-3">
              <span className="para min-w-175px pe-1">Limiet</span>
              <input
                type="text"
                className="form-control w-315px"
                onChange={(e)=>setLimit(e.target.value)} value={Limit > 0 ? Limit : ""}
              />
            </div>
            <div className="d-flex align-items-center mb-3">
              <span className="para min-w-175px pe-1">Prijs</span>
              <input
                type="text"
                className="form-control w-315px"
                onChange={(e)=>setPrice(e.target.value)} value={Price > 0 ? Price : ""}
              />
            </div>
            <div className="d-flex align-items-center mb-3">
              <span className="para min-w-175px pe-1">Datum</span>
              <DatePicker className="flex-fill form-control w-315px min-w-186px" dateFormat="dd/MM/yyyy" selected={SaleDate} onChange={(date)=>OnChangeDate(date)}  />
            </div>
          </>
        )}
        <div className="row">
          <div className="col-md-4"></div>
          <div className="col-md-4 d-flex mb-4">
            {!IsKentekenStepCompleted ? (
              <>
                <label>Kenteken gegevens &nbsp; </label>
                <input
                  type="image"
                  src="img/icon.CarDocs.CodeO.gif"
                  data-bs-toggle="modal"
                  data-bs-target="#CompleteKenteken"
                  onClick={onClickSerachKoper}
                  height="25px"
                />
                <label> &nbsp;(niet compleet)</label>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-end">
        {
          !IsDirectSale ? <button className="btn btn-primary me-8px">
            <i className="saveIcon"></i>
            <span>Alleen waarden opslaan</span>
          </button> :<></>
        }
          
          <button className="btn btn-primary me-8px">
            <i className="onsaleIcon"></i>
            {
              !IsDirectSale ?<span>Opslaan en in verkoop zetten</span> : <span>Doorzetten naar verkoop</span>
            }
            
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default CarTodoTab;
