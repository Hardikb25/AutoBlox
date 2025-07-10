import * as React from "react";
import { postRequest, getUrl, getRequest } from "../ApiCalls";
import CONSTANT from "../Global";
import DataLoader from "../Loader";
import '../components.css';
import moment from 'moment';
import DatePicker from "react-datepicker";
import { Navigate,useNavigate } from "react-router";
function CarStatusTab(props) {
    const history = useNavigate();
    const [isLoading, setLoading] = React.useState(true);
    const [CarProtocol, setCarProtocol] = React.useState({});
    const [datePickerIsOpen, setDatePickerIsOpen] = React.useState(false);
    const [DateSelected, setDateSelected] = React.useState();

    React.useEffect(() => {
        GetCarProtocol();
    }, []);

    const GetCarProtocol = () => {
        setLoading(true)
        getRequest({
            requesturl: getUrl() + `/CarProtocolStep/GetCarProtocolSteps?CarId=` + props.car.carId,
        }).then((res) => {if (res) {
                console.log(res.model)
                setCarProtocol(res.model)
                
            }
            setLoading(false)
        }
        );

    }
    const handleDateChange = (date) => {
        const d = new Date(date);
        setDateSelected(d);
    }
    const openDatePicker = () => {
        setDatePickerIsOpen(!datePickerIsOpen)
    }
    const HideDatePicker = () => {
        setDatePickerIsOpen(false)
    }

    return (
        isLoading ? <React.Fragment>
            <DataLoader />
        </React.Fragment> :
            <>
                <div className="row row-cols-2 row-20">
                    <div className="col">
                        <div className="border border-primary rounded-2 pa-15 mb-15">

                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h2 className="mb-0">Voorraadstatus</h2>
                                <div className="d-flex">
                                    <button className="w-20px h-20px d-inline-flex align-items-center justify-content-center me-1">
                                        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                                            <path d="M3.79818 8.64752L0.277344 5.10586L1.31901 4.06419L3.79818 6.52252L9.81901 0.522522L10.8607 1.58502L3.79818 8.64752Z" fill="#152D6D" />
                                        </svg>
                                    </button>
                                    <button className="w-20px h-20px d-inline-flex align-items-center justify-content-center">
                                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                            <path d="M1.13135 10.585L0.0688477 9.52252L4.00635 5.58502L0.0688477 1.64752L1.13135 0.585022L5.06885 4.52252L9.00635 0.585022L10.0688 1.64752L6.13135 5.58502L10.0688 9.52252L9.00635 10.585L5.06885 6.64752L1.13135 10.585Z" fill="#152D6D" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="d-flex align-items-center mb-2">
                                <span className="para min-w-175px pe-1">Huidige voorraadstatus</span>
                                <select name="" id="" className="form-control">
                                    <option value="">Onbekend</option>
                                    <option value="1">1</option>
                                </select>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <span className="para min-w-175px pe-1">Voorraadstatus beheerder</span>
                                <select name="" id="" className="form-control">
                                    <option value="">Onbekend</option>
                                    <option value="1">1</option>
                                </select>
                            </div>
                            <div className="d-flex mb-2">
                                <span className="para min-w-175px pe-1">Statuswijziging</span>
                                <span className="para text-danger">{moment(props.car.stockStatusTime).format("DD-MMM-yyyy HH:mm:ss") + " " + props.car.stockStatusDetail} </span>
                            </div>

                        </div>
                    </div>
                    <div className="col">
                        <div className="border border-primary rounded-2 pa-15 pb-24 mb-15">
                            <h2 className="mb-4 pb-1">Proces status</h2>

                            <div className="d-flex align-items-center flex-wrap checkbox-me-60">
                                <div className="chkBox d-flex">
                                    <input type="checkbox" id="chk-1" />
                                    <label for="chk-1" className="para">In proces</label>
                                </div>
                                <div className="chkBox d-flex">
                                    <input type="checkbox" id="chk-2" />
                                    <label for="chk-2" className="para">In wacht</label>
                                </div>
                                <div className="chkBox d-flex">
                                    <input type="checkbox" id="chk-3" />
                                    <label for="chk-3" className="para">In wacht tot</label>
                                </div>
                            </div>

                        </div>
                        <div className="border border-primary rounded-2 pa-15 pb-30 mb-15">
                            <h2 className="mb-4 pb-1">Beschikbaarheid na verkoop</h2>

                            <div className="d-flex flex-column">
                                <div className="chkBox d-flex mb-2">
                                    <input type="checkbox" id="chk-4" />
                                    <label for="chk-4" className="para">Auto is meteen beschikbaar</label>
                                </div>
                                <div className="d-flex mb-2 align-items-center">
                                    <div className="chkBox d-flex">
                                        <input type="checkbox" id="chk-5" />
                                        <label for="chk-5" className="para">Auto is beschikbaar vanaf</label>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <DatePicker
                                            selected={DateSelected}
                                            onChange={handleDateChange}
                                            onClickOutside={openDatePicker}
                                            open={datePickerIsOpen}
                                            className="flex-fill form-control me-8px min-w-186px ms-3"
                                        /> 
                                        <button className="border-0 ps-4 bg-transparent h-25px align-items-center" onClick={openDatePicker}><img src="images/calendar.png" alt="" width="15" height="15" /></button>
                                        <button className="border-0 ps-3 bg-transparent h-25px d-inline-flex align-items-center" onClick={HideDatePicker}>
                                            <img src="images/close.png" alt="" width="10" height="10" />
                                        </button>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="d-flex chkBox">
                                        <input type="checkbox" id="chk-6" />
                                        <label for="chk-6" className="para">Auto is beschikbaar</label>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <input type="text" className="form-control me-8px ms-3 w-60px" />
                                        <span className="para">dagen na verkoop</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="col col-12">
                        <div className="border border-primary rounded-2 pa-15 mb-15">

                            <div className="d-flex flex-wrap justify-content-between align-items-center row-gap-18 mb-5">
                                <h2 className="mb-0">Workflow stappen - {CarProtocol.companyProtocol.code + ' (' + CarProtocol.companyProtocol.companyProtocolName + ')'}</h2>

                                <div className="d-flex">
                                    <button className="btn btn-primary me-8px">
                                        <i className="trashIcon"></i>
                                        <span>Verwijder auto</span>
                                    </button>
                                    <button className="btn btn-primary me-8px">
                                        <i className="crossIcon"></i>
                                        <span>Ongedaan maken</span>
                                    </button>
                                    <button className="btn btn-primary me-8px">
                                        <i className="addIcon"></i>
                                        <span>Start nieuwe workflow</span>
                                    </button>
                                    <button className="btn btn-primary me-8px">
                                        <i className="person-editIcon"></i>
                                        <span>Wijzig eigenaar</span>
                                    </button>
                                    <button className="btn btn-primary me-8px">
                                        <i className="schemaIcon"></i>
                                        <span>Toon workflow</span>
                                    </button>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table tableNew" cellspacing="0" cellpadding="0">
                                    <thead>
                                        <tr>
                                            <th>Stap</th>
                                            <th>Planning</th>
                                            <th>Aanvang</th>
                                            <th>Gereed</th>
                                            <th>Door</th>
                                            <th>Bedrijf</th>
                                            <th>Prijs</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            CarProtocol.protocolSteps.map((steps) =>
                                                <tr>
                                                    <td>{steps.protocolStepDetails.protocolStepName}</td>
                                                    <td>{steps.dDueDate != null ? moment(steps.dDueDate).format("DD-MMM-yyyy") : ''}</td>
                                                    <td><div className="d-flex align-items-center">
                                                        {
                                                            steps.activateTime != null ?
                                                                steps.isCancelled ?
                                                                    <>
                                                                        <i className="w-20px h-20px min-w-20px min-h-20px">
                                                                            <img src="images/close.svg" alt="" />
                                                                        </i>
                                                                    </>
                                                                    : steps.isComplete ?
                                                                        <>
                                                                            <i className="w-20px h-20px min-w-20px min-h-20px">
                                                                                <img src="images/check.svg" alt="" />
                                                                            </i>
                                                                        </> :
                                                                        steps.isActive ?
                                                                            <>
                                                                                <i className="w-20px h-20px min-w-20px min-h-20px">
                                                                                    <img src="images/edit-file.png" alt="" />
                                                                                </i>
                                                                            </> :
                                                                            <></> : <></>
                                                        }
                                                        {steps.activateTime != null ? moment(steps.activateTime).format("DD-MMM-yyyy HH:mm") : ''}

                                                    </div>
                                                    </td>
                                                    <td>{steps.completeTime != null ? moment(steps.completeTime).format("DD-MMM-yyyy HH:mm") : ''}</td>
                                                    {steps.stepCompletedByUser != null ?
                                                        <>
                                                            <td>{steps.stepCompletedByUser.userFullName}</td>
                                                            <td>{steps.stepCompletedByUser.companyName}</td>
                                                        </>

                                                        : <>
                                                            <td></td>
                                                            <td></td>
                                                        </>

                                                    }
                                                    <td>{steps.stepPrice > 0 ? '€ ' + steps.stepPrice : ''}</td>
                                                </tr>

                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </>
    )
}

export default CarStatusTab;