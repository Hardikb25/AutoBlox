import * as React from "react";
import Pagination from "./Pager";
import "../components.css";
import parse from 'html-react-parser';
import { encryptData, decryptData } from "../EncrypDecryptData";
import CONSTANT from "../Global";
let currentColumn = '';
function GridView(props) {
    let canSort = true;
    const onClickCar = (carid) => {
        var link = "/CarDetail?Id=" + encryptData(carid);
        //window.open(link, "_blank");
      };
    const handleOrderChangeClick = (e) => {
        e.preventDefault();

        props.data.map((item) => (
            canSort = (item[e.target.dataset.column] == undefined) ? false : true
        ))
        if (canSort) {
            currentColumn = e.target.dataset.column;
            props.onOrderChange(
                e.target.dataset.column,
                e.target.dataset.order === "asc" ? "desc" : "asc"
            );

        }
    };

    const GridTemplate = ({ key, item, column, deletehandler, edithandler, onSelectCompany }) => (
        <>
            <div className="border border-primary rounded-2 pa-15">
                <div className="d-flex mb-12">
                    <div className="carimgBox min-w-156px">
                        <img src={item.imageURL !== "" && item.imageURL !== null?CONSTANT.IMAGE_URL+ item.imageURL.replaceAll("\\", "/") : "images/car-1.jpg"} alt="" width="100" height="148" className="object-cover rounded-1 w-100" />
                    </div>
                    <div className="carDetails d-flex justify-content-between flex-column ps-3">
                        <KentakenRow
                            key={key}
                            item={item}
                            column={props.column}
                            deletehandler={props.deletehandler}
                            edithandler={props.edithandler}
                            onSelectCompany={props.onSelectCompany}
                            onSelectCar={onClickCar} />
                        {/* <div>
                        <h3 className="mb-0">Volkswagen e-Golf 136pk E-DITION 2019</h3>
                        <p>Automaat <br/> 46.493 km <br/> 20 jan</p>
                    </div>
                    <div>
                        <div className="numberPlate caption d-inline-flex">48 - TDG - 5</div>    
                    </div>     */}
                    </div>
                </div>
                <div className="d-flex flex-wrap">

                    <ul className="list-unstyled specsUl min-w-156px">
                        {props.column.map((item, index) => (
                            <GridHeadItem
                                key={index}
                                item={item}
                                issortcolumn={item.value === props.SortColumn}
                                sortorder={props.SortingOrder}
                                onOrderChange={handleOrderChangeClick}
                                doNotApplySorting={item.doNotApplySorting}
                                onSelectCompany={props.onSelectCompany}
                            />
                        ))}
                    </ul>

                    <div className="ps-3" style={{ width: 'calc(100% - 156px)' }}>
                        <GridRow
                            key={key}
                            item={item}
                            column={props.column}
                            deletehandler={props.deletehandler}
                            edithandler={props.edithandler}
                            onSelectCompany={props.onSelectCompany} />

                    </div>

                </div>
            </div>
        </>
    );
    return (
        <>
           
            <div className="d-grid grid-col2 col-gap-15 row-gap-12">
                {props.TotalRecords > 0 ? (
                    props.data.map((item, index) => (
                        <GridTemplate
                            key={index}
                            item={item}
                            column={props.column}
                            deletehandler={props.deletehandler}
                            edithandler={props.edithandler}
                            onSelectCompany={props.onSelectCompany}
                        />
                    ))
                ) : (
                    <tr>
                        <td colSpan={99}>Geen data</td>
                    </tr>
                )}
            </div>

        </>
    );
}

const GridRow = ({ item, column, deletehandler, edithandler, onSelectCompany }) => (
    <>
        {column.map((columnItem, index) => {

            if(columnItem.isGridView){              
                return("")
            }
            else{
                const htmlString = String(item[`${columnItem.value}`]) === 'undefined' ? "" : String(item[`${columnItem.value}`]);
            let html = '';         
            if (!columnItem.isGridView || columnItem.isGridView == undefined) {
                html = columnItem.ishtml ? parse(htmlString) : htmlString;
            }           
            // if (columnItem.isanchortag) {
            //     const navigationurl = '<a href="/CarDetail" target="_blank">' + item[`${columnItem.value}`] + '</a>'
            //     html = parse(navigationurl);
            // }
            let tooltip = columnItem.tooltip != undefined ? item[`${columnItem.tooltip}`] : "";
            let btnElement =
                columnItem.value == "buttons" ? (
                    <span>
                        {columnItem?.isEditbuttonShown ||
                            typeof columnItem?.isEditbuttonShown === "undefined" ? (
                            <a
                                href="#"
                                data-toggle="tooltip"
                                data-id={item.id}
                                data-placement="top"
                                title=""
                                data-original-title="Edit"
                                onClick={edithandler}
                            >
                                <i className="fa fa-pencil color-muted m-r-5"></i>
                            </a>
                        ) : (
                            <></>
                        )}

                        <a
                            href="#"
                            data-toggle="tooltip"
                            data-id={item.id}
                            data-placement="top"
                            title=""
                            data-original-title="Delete"
                            style={{ paddingLeft: "20px" }}
                            onClick={deletehandler}
                        >
                            <i className="fa fa-close color-danger"></i>
                        </a>
                    </span>
                ) : columnItem.islink ? (
                    <a
                        href="#"
                        data-toggle="tooltip"
                        data-id={item.id}
                        data-placement="top"
                        title=""
                        data-original-title="Delete"
                        style={{ paddingLeft: "20px" }}
                        onClick={edithandler}
                    >
                        {item[`${columnItem.value}`]}
                    </a>
                ) : columnItem.value == "Selection" ? (

                    <input type="image" src="img/checkmark.png" className="ms-2" data-bs-dismiss="modal" height="25px" data-id={item.id} onClick={() => onSelectCompany(item)} />

                ) : (
                    html
                );
              return (btnElement.length > 0) ? (columnItem.value ==='ownerName' ? <p className="mb-2 text-ellipsis border-transparent" key={index} title={btnElement} >{btnElement}</p>:<p className="mb-2" key={index} title={tooltip} >{btnElement}</p>) : <p className="mb-2" key={index} >&nbsp;</p>;

            // return (btnElement.length > 0) ? <p className="mb-2 text-ellipsis" key={index} title={btnElement} >{btnElement}</p> : <p className="mb-2" key={index} >&nbsp;</p>;
            }
           
        })}
    </>
);

const KentakenRow = ({ item, column, deletehandler, edithandler, onSelectCompany,onSelectCar }) => (
    <>
        {column.map((columnItem, index) => {
            const htmlString = String(item[`${columnItem.value}`]) === 'undefined' ? "" : String(item[`${columnItem.value}`]);
            let html = '';
            if (columnItem.isGridViewKentaken) {
                return (<div><div className="numberPlate caption d-inline-flex">{item[`${columnItem.value}`]}
                </div></div>);
            }
            else if(columnItem.isGridViewAutodetails){
                return(
                    <div><h3 className="mb-0">
                    <a href={"/CarDetail?Id="+ encryptData(item.carId)} target="_blank" onClick={() => onSelectCar(item.carId)}>{parse(item[`${columnItem.value}`])}</a>
                    </h3></div>

                )
            }
        })}
    </>
);

const GridHeadItem = ({
    item,
    issortcolumn,
    sortorder,
    onOrderChange,
    doNotApplySorting,
}) => (<>
    {doNotApplySorting ? (
        (!item.isGridView) ? <li>{item.heading}</li> : ''
    ) : (
        (!item.isGridView) ?
            <li className={issortcolumn ? "sorting_" + sortorder + " cursor" : "sorting cursor"}
                data-column={
                    item.orderbycolumnName ? item.orderbycolumnName : item.value
                } data-order={sortorder} onClick={onOrderChange}>
                {item.heading}
            </li> : ''
    )}
</>
);



export default GridView;