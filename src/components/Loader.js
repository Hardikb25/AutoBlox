import * as React from "react";

export default function DataLoader(props){
    const isExportExcel = props.isExportExcel;
    const loaderclass= isExportExcel ?"loaderExcel":"loader";

    const isDashboard = props.isDashboard;
    const DashboardLoaderClass=isDashboard?"box-dashboard":"box"
    //console.log(!isExportExcel?"check":"check2")
    return(
              <React.Fragment>
                  <div className={loaderclass} style={{textAlign:"center",fontSize:"300px"}}>
                  <div className={DashboardLoaderClass}>
                <span className="loader-01" role="status" aria-hidden="true"></span>
                <span className="visually-hidden">Loading...</span>
            </div>
                 </div>
              </React.Fragment>
           )
}