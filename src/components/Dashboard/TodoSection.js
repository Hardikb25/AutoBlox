import * as React from "react";
import { postRequest, getUrl, getRequest } from "../ApiCalls";
import CONSTANT from "../Global";
import DataLoader from "../Loader";
import '../components.css';
import { Navigate,useNavigate } from "react-router";
import ImageDiv from "./ImageDiv";
function TodoSection(props) {
    const history = useNavigate();
    const [isLoading, setLoading] = React.useState(true);
    const [TodoData, SetTodoData] = React.useState({});


    React.useEffect(() => {
      GetTodoData();
    }, []);

    const GetTodoData = () => {
        setLoading(true)
        getRequest({
            requesturl: getUrl() + `/CarStepSummary/GetCarSummaryForTodo?userId=` + localStorage.getItem("UserId"),
        }).then((res) => {if (res) {                
                SetTodoData(res.model)               
            }
            setLoading(false)
        }
        );

    }
  
    return (
    
                  <div className="border border-primary rounded-2 pa-15 mb-15">
                  <h2 className="mb-20">Todo</h2>
                  {isLoading ? <React.Fragment>
          <DataLoader isDashboard={true}></DataLoader>
        </React.Fragment> :
            <>
                  <div className="d-grid grid-col4 col-gap-30 row-gap-26">
                    <ImageDiv imageSrc="images/entry_icon.png" title="Entry" totalCount={TodoData.toDoEntryTotalCount} lateCount={TodoData.toDoEntryLateCount} todayCount={TodoData.toDoEntryTodayCount}></ImageDiv>
                    <ImageDiv imageSrc="images/wash_icon.png" title="Wassen" totalCount={TodoData.toDoWashTotalCount} lateCount={TodoData.toDoWashLateCount} todayCount={TodoData.toDoWashTodayCount}></ImageDiv>
                    <ImageDiv imageSrc="images/parallel_icon.png" title="Proces" totalCount={TodoData.toDoProcessTotalCount} lateCount={TodoData.toDoProcessLateCount} todayCount={TodoData.toDoProcessTodayCount}></ImageDiv>
                    <ImageDiv imageSrc="images/check_icon.png" title="Controle" totalCount={TodoData.toDoCheckTotalCount} lateCount={TodoData.toDoCheckLateCount} todayCount={TodoData.toDoCheckTodayCount}></ImageDiv>
                    <ImageDiv imageSrc="images/valuation_icon.png" title="Taxtie" totalCount={TodoData.toDoValuationTotalCount} lateCount={TodoData.toDoValuationLateCount} todayCount={TodoData.toDoValuationTodayCount}></ImageDiv>  
                    
                    <ImageDiv imageSrc="images/kentekencheck_icon.png" title="Kenteken gegevens" totalCount={TodoData.toDoLicensePlateDetailsTotalCount} lateCount={TodoData.toDoLicensePlateDetailsLateCount} todayCount={TodoData.toDoLicensePlateDetailsTodayCount}></ImageDiv>
                    <ImageDiv imageSrc="images/finalcheck_icon.png" title="Finl check" totalCount={TodoData.toDoFinalCheckTotalCount} lateCount={TodoData.toDoFinalCheckLateCount} todayCount={TodoData.toDoFinalCheckTodayCount}></ImageDiv>
                    <ImageDiv imageSrc="images/call.png" title="Acties" totalCount={TodoData.toDoActionsTotalCount} lateCount={TodoData.toDoActionsLateCount} todayCount={TodoData.toDoActionsTodayCount}></ImageDiv>
                    <ImageDiv imageSrc="images/carservices_icon.png" title="Car services" totalCount={TodoData.toDoCarServicesTotalCount} lateCount={TodoData.toDoCarServicesLateCount} todayCount={TodoData.toDoCarServicesTodayCount}></ImageDiv>
                    <ImageDiv imageSrc="images/Todo.Pending_icon.png" title="In wacht" totalCount={TodoData.toDoOnHoldTotalCount} lateCount={TodoData.toDoOnHoldLateCount} todayCount={TodoData.toDoOnHoldTodayCount}></ImageDiv>                                                       
                  </div>
                  </>
}
                </div>
            
    )
}

export default TodoSection;