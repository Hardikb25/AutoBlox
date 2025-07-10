import * as React from "react";
import Pagination from "./Pager";
import parse from "html-react-parser";
import "../components.css";
import { encryptData, decryptData } from "../EncrypDecryptData";
import CONSTANT from "../Global";

let currentColumn = "";

function List(props) {
  let canSort = true;
  const onClickCar = (carid) => {
    var link = "/CarDetail?Id=" + encryptData(carid);
    //window.open(link, "_blank");
  };

  React.useEffect(() =>{
    StickyHeader()
  },[])
  
  const StickyHeader=()=>{
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
    function handleScroll() {
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
    
    // Attach scroll and resize event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', syncColumnWidths); 
  }

  const handleOrderChangeClick = (e) => {
    e.preventDefault();

    props.data.map(
      (item) =>
        (canSort = item[e.target.dataset.column] == undefined ? false : true)
    );
    if (canSort) {
      currentColumn = e.target.dataset.column;
      props.onOrderChange(
        e.target.dataset.column,
        e.target.dataset.order === "asc" ? "desc" : "asc"
      );
    }
  };
  return (
    <>
      {/* <table className="table border-0 table-hover table-center mb-0 table-striped"> */}
      <div className="table-responsive">
        <table className="table" cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              {props.column.map((item, index) => (
                <TableHeadItem
                  key={index}
                  item={item}
                  issortcolumn={item.value === props.SortColumn}
                  sortorder={props.SortingOrder}
                  onOrderChange={handleOrderChangeClick}
                  doNotApplySorting={item.doNotApplySorting}
                  onSelectCompany={props.onSelectCompany}
                  onSelectCar={onClickCar}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {props.TotalRecords > 0 ? (
              props.data.map((item, index) => (
                <TableRow
                  key={index}
                  item={item}
                  column={props.column}
                  deletehandler={props.deletehandler}
                  edithandler={props.edithandler}
                  onSelectCompany={props.onSelectCompany}
                  onSelectCar={onClickCar}
                />
              ))
            ) : (
              <tr>
                <td colSpan={99}>Geen data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

const TableHeadItem = ({
  item,
  issortcolumn,
  sortorder,
  onOrderChange,
  doNotApplySorting,
}) => (
  <>
    {
      doNotApplySorting ? (
        <th className="text-nowrap">
         {
          item.heading == "" ? 
          <></> :item.doNotApplySorting?<span>{item.heading}</span> :
          <a href="">
            <span>{item.heading}</span>
          </a>
         
         } 
        </th>
      ) : !item.isDisabled ? (
        <th
          className={
            issortcolumn
              ? item.value === "inProcess" ? "sorting_" + sortorder + " cursor text-nowrap" : "sorting_" + sortorder + " cursor "
              : item.value === "inProcess" ? "sorting cursor text-nowrap" :"sorting cursor"
          }
        >
          <a href="#">
            <span
              data-column={
                item.orderbycolumnName ? item.orderbycolumnName : item.value
              }
              data-order={sortorder}
              onClick={onOrderChange}
            >
              {item.heading}
            </span>
          </a>
        </th>
      ) : (
        ""
      )
      // <th
      //   className={issortcolumn ? "sorting_" + sortorder + " cursor" : "sorting cursor"}
      //   onClick={onOrderChange}
      //   data-column={
      //     item.orderbycolumnName ? item.orderbycolumnName : item.value
      //   }
      //   data-order={sortorder}
      // >
      //   {item.heading}
      //   <i
      //     className={sortorder === "asc" && item.value === currentColumn ? "icon-arrow-up" : "icon-arrow-down"}
      //   ></i>
      // </th>
    }
  </>
);
const TableRow = ({
  item,
  column,
  deletehandler,
  edithandler,
  onSelectCompany,
  onSelectCar,
}) => (
  <tr>
    {column.map((columnItem, index) => {
      const htmlString =
        String(item[`${columnItem.value}`]) === "undefined"
          ? ""
          : String(item[`${columnItem.value}`]);
      let html = "";
      if (!columnItem.isDisabled || columnItem.isDisabled == undefined) {
        html = columnItem.ishtml ? parse(htmlString) : htmlString;
        // if (columnItem.isanchortag) {
        // let sortingdiv = '<div class="d-flex max-w-215">';
        // console.log(html);
        // if (columnItem.iskentaken)
        //   sortingdiv += '<div class="carimgBox min-w-74px"><img src="images/car-1.jpg" alt="" width="100%" height="64" class="object-cover rounded-1" /></div>'

        if (columnItem.isanchortag) {
          let sortingdiv =
            '<div className="carDetails d-flex justify-content-between flex-column ps-3"><a href="/CarDetail" target="_blank">' +
            item[`${columnItem.value}`] +
            "</a></div>";
          html = parse(sortingdiv);
        }
        // sortingdiv += '</div>'
        // }
        let tooltip =
          columnItem.tooltip != undefined ? item[`${columnItem.tooltip}`] : "";
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
            <input
              type="image"
              src="images/check.svg"
              className="ms-2"
              data-bs-dismiss="modal"
              height="13px"
              data-id={item.id}
              onClick={() => onSelectCompany(item)}
            />
          ) : columnItem.iskentaken ? (
            <div className="d-flex max-w-215 align-items-start">
              <div className="carimgBox min-w-74px">
                <img
                  src={item.imageURL !== "" && item.imageURL !== null && !(item.imageURL == undefined) ?CONSTANT.IMAGE_URL+ item.imageURL.replaceAll("\\", "/") : "images/car-1.jpg"}
                  alt=""
                  width="100%"
                  height="64"
                  className="object-cover rounded-1"
                />
              </div>
              <div className="carDetails d-flex justify-content-between flex-column pt-1">
                <a href={"/CarDetail?Id="+ encryptData(item.carId)} target="_blank"  onClick={() => onSelectCar(item.carId)}>
                  {parse(item[`${columnItem.value}`])}
                </a>
              </div>
            </div>
          ) : (
            // <a class="Linkcolor" onClick={() => onSelectCar(item.carId)}>{parse(item[`${columnItem.value}`])}</a>)
            html
          );
        //html;

        return (
          <td key={index} title={tooltip} className={(columnItem.value === "carHighestBid") || (columnItem.value === "carValue") || (columnItem.value === "priceLimit")? 'text-nowrap' : ''}>
            {btnElement}
          </td>
        );
      }
    })}
  </tr>
);
export default List;
