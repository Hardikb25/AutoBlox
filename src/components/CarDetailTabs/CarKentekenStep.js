import * as React from "react";
import { postRequest, getUrl, getRequest } from "../ApiCalls";
import CONSTANT from "../Global";
import DataLoader from "../Loader";

function CarKentekenStep(props) {
  const [RegInfo, setRegInfo] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const [OwnerMileage, setOwnerMileage] = React.useState("");
  const [MileageUnitId, setMileageUnitId] = React.useState(1);

  const [cbIsORBDisabled, setcbIsORBDisabled] = React.useState(false);
  const [cbIsOwnerCodeMandatoryDisabled, setcbIsOwnerCodeMandatoryDisabled] = React.useState(false);
  const [ownerCodeMandatory, setownerCodeMandatory] = React.useState(!props.carDocs.ownerCodeMandatory);
  const [isORB, setisORB] = React.useState(props.carDocs.isORBDisabled);

  React.useEffect(() => {
    SetCarInfo();
    if (props.carDocs.ownerMileage > 0) {
      setOwnerMileage(props.carDocs.ownerMileage);
      setMileageUnitId(props.carDocs.ownerMileageUnitId);
    } else {
      setOwnerMileage(props.carProperties.dashboardMileage);
      setMileageUnitId(props.carProperties.dashboardMileageUnitId);
    }
  }, []);
  const SetCarInfo = () => {
    var info;
    info =
      "Kenteken " +
      (props.car.formatedKenteken != "" && props.car.formatedKenteken != null
        ? props.car.formatedKenteken
        : "n/a");
    info +=
      " ChassisNr " +
      (props.car.chassisNr != "" && props.car.chassisNr != null
        ? props.car.chassisNr
        : "n/a");
    setRegInfo(info);
    var isAdministrator = localStorage.getItem("UserCompanyType") == 1;
    var IsCarAdmin =
      isAdministrator &&
      localStorage.getItem("CompanyId") == props.car.adminCompanyId;
    var IsSold = props.carSaleStatus.saleStatusId == 4;
    var IsClosedSale = IsSold && props.carSaleStatus.IsGuaranteedSale;
    var IsSaleAdmin =
      isAdministrator &&
      localStorage.getItem("CompanyId") ==
        props.carSaleStatus.saleAdminCompanyId;
    //var IsOwner = ( !IsCarAdmin && !IsSaleAdmin && car.CurrentUserIsOwner );
    var IsOwner = false;
    var HasPaperRole = true;

    setcbIsORBDisabled((IsCarAdmin || IsOwner) && HasPaperRole);
    setcbIsOwnerCodeMandatoryDisabled(!IsSold && HasPaperRole && IsCarAdmin);
  };
  const onChangeMileageType = (event) => {
    setMileageUnitId(parseInt(event.target.value));
  };
  return isLoading ? (
    <React.Fragment>
      <DataLoader />
    </React.Fragment>
  ) : (
    <React.Fragment>
      <div>
        {/* <div className="card">

            <div className="card-body">
              <div class="row">
                <div class="col">
                  <label class="form-label">{RegInfo}</label>
                </div>
              </div>
              <div class="row">
                <div class="col mb-2">
                  <label class="form-label">{props.car.carDetail}</label>
                </div>
              </div>
              <div class="row">
                <div class="col-md-2">
                  <label class="form-label in">(Tijdelijk) documentnummer</label>
                </div>
                <div class="col-md-3 mb-2">
                  <input type="text" class="form-control" value={props.carDocs.ownerDocNo} placeholder="" onChange={props.changeOwnerDocNo} />
                </div>
                <div class="col-md-2">
                  <label class="form-label in">Tellerstand</label>
                </div>
                <div class="col-md-3 mb-2">
                  <input type="text" class="form-control" placeholder="" value={OwnerMileage} />
                </div>
                <div class="col-md-2 mb-2">
                  <div className="d-flex" onChange={onChangeMileageType}>
                    <div class="form-check form-check-inline">
                      <input type="radio" name="rdMileageType" value="1" class="form-check-input" id="exampleRadio1" checked={MileageUnitId == 1} />
                      <label class="form-check-label" for="exampleRadio1">km</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input type="radio" name="rdMileageType" value="2" class="form-check-input" id="exampleRadio1" checked={MileageUnitId == 2} />
                      <label class="form-check-label" for="exampleRadio1">miles</label>
                    </div>
                  </div>

                </div>

              </div>
              <div class="row">
                <div class="col-md-2">
                  <label class="form-label in">Tenaamstellingscode</label>
                </div>
                <div class="col-md-3 mb-2">
                  <input type="text" class="form-control" value={props.carDocs.ownerDocCode} placeholder="" onChange={props.changeOwnerDocCode} />
                </div>
                <div class="col-md-2">
                  <label class="form-label in">Meldcode</label>
                </div>
                <div class="col-md-3 mb-3">
                  <input type="text" class="form-control" placeholder="" onChange={props.changeMeldcode} />
                </div>
                <div class="col-md-3 mb-3">

                </div>

              </div>
              <div class="row">
                <div class="col d-flex mb-3" >
                  <input type="image" src="img/question-mark.png" height="25px" />
                  <label class="form-label in">&nbsp;De codes worden zichtbaar voor ... als ... (nog onbekend)</label>

                </div>

              </div>
              <div className="row">
                <div class="col">
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" checked={props.carDocs.isORBDisabled} disabled={cbIsORBDisabled} />
                    <label class="form-check-label" for="exampleCheck1">Tenaamgesteld</label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div class="col">
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" checked={!props.carDocs.ownerCodeMandatory} disabled={cbIsOwnerCodeMandatoryDisabled} />
                    <label class="form-check-label" for="exampleCheck1">Codes zijn niet verplicht voor (open) verkoop</label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div class="col">
                  <div class="form-check mb-3 ">
                    <input type="checkbox" class="form-check-input" checked={props.carDocs.ownerNoCode} disabled />
                    <label class="form-check-label" for="exampleCheck1">De kenteken codes worden niet ontvangen, toelichting hieronder</label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div class="col">
                  <label for="validationServer01" class="form-label">Opmerkingen</label>
                  <textarea class="form-control" aria-label="With textarea"></textarea>
                 
                </div>
              </div>
            </div>
          </div> */}
        <div className="modal-body p-4">
          <div className="d-flex align-items-center justify-content-between border-bottom pb-4 mb-4">
            <p className="mb-0">
              {RegInfo} <br />
              {props.car.carDetail}
            </p>
            <div className="carimgBox min-w-74px ms-3">
              <img
                src="images/car-1.jpg"
                alt=""
                width="100%"
                height="64"
                className="object-cover rounded-1"
              />
            </div>
          </div>

          <div className="border-bottom pb-4 mb-4">
            <div className="d-flex align-items-center mb-2">
              <span className="para min-w-175px pe-1">
                (Tijdelijk) documentnummer
              </span>
              <input
                type="text"
                className="form-control w-315px"
                value={props.carDocs.ownerDocNo}
                onChange={props.changeOwnerDocNo}
              />
            </div>
            <div className="d-flex align-items-center mb-2">
              <span className="para min-w-175px pe-1">Tenaamstellingscode</span>
              <input
                type="text"
                className="form-control w-315px"
                value={props.carDocs.ownerDocCode}
                onChange={props.changeOwnerDocCode}
              />
            </div>
            <div className="d-flex align-items-center mb-2">
              <span className="para min-w-175px pe-1">Tellerstand</span>
              <div className="d-flex align-items-center">
                <input
                  type="text"
                  className="form-control w-315px me-4"
                  value={OwnerMileage}
                />
                <div className="d-flex align-items-center" >
                  <div className="chkBox d-flex me-3">
                    <input
                      type="radio"
                      id="km"
                      name="kmmiles"
                      value={1}
                      checked={MileageUnitId === 1}
                      onChange={() => setMileageUnitId(1)}
                    />
                    <label for="km" className="para">
                      km
                    </label>
                  </div>
                  <div className="chkBox d-flex">
                    <input
                      type="radio"
                      id="miles"
                      name="kmmiles"
                      value={2}
                      checked={MileageUnitId === 2}
                      onChange={() => setMileageUnitId(2)}
                    />
                    <label for="miles" className="para">
                      miles
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <span className="para min-w-175px pe-1">Melcode</span>
              <input type="text" className="form-control w-315px" onChange={props.changeMeldcode} />
            </div>
          </div>

          <div className="d-flex align-items-center mb-2">
            <span className="w-20px h-20px bg-primary d-inline-flex align-items-center justify-content-center text-white rounded-1 me-2">
              ?
            </span>
            <span>
              De codes worden zichtbaar voor ... als ... (nog onbekend)
            </span>
          </div>

          <div className="d-flex flex-column align-items-start mb-4">
            <div className="chkBox d-flex mb-2">
              <input
                type="checkbox"
                id="tenaamgesteld"
                name="tenaamgesteld"
                checked={isORB}
                disabled={cbIsORBDisabled}
                onChange={()=>setisORB(!isORB)}
              />
              <label for="tenaamgesteld" className="para">
                Tenaamgesteld
              </label>
            </div>
            <div className="chkBox d-flex mb-2">
              <input
                type="checkbox"
                id="opens"
                name="open"
                checked={!ownerCodeMandatory}
                disabled={cbIsOwnerCodeMandatoryDisabled}
                onChange={()=>setownerCodeMandatory(!ownerCodeMandatory)}
              />
              <label for="opens" className="para">
                Codes zijn niet verplicht voor (open) verkoop
              </label>
            </div>
            <div className="chkBox d-flex mb-2">
              <input
                type="checkbox"
                id="codes"
                name="codes"
                checked={props.carDocs.ownerNoCode}
                disabled
              />
              <label for="codes" className="para">
                De kenteken codes worden niet ontvangen, toelichting hieronder
              </label>
            </div>
          </div>

          <div className="d-flex mb-2">
            <span className="para min-w-175px pe-1">Opmerkingen</span>
            <textarea name="" id="" className="form-control"></textarea>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default CarKentekenStep;
