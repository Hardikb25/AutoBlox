import axios from "axios";
import React from "react";
import CONSTANT from "./Global";

export const getUrl =() =>{
  return CONSTANT.ISPRODUCTIONENV === true ? CONSTANT.PRODUCTION_API_URL : CONSTANT.LOCAL_API_URL;
  
}

export const IsTokenValid = () => {
  var Jwttoken = localStorage.getItem("JwtToken");
  if(Jwttoken !== undefined && Jwttoken != "null"){
    let decodedToken = JSON.parse(atob(Jwttoken.split(".")[1]));
    let currentDate = new Date();
    // JWT exp is in seconds 
    if (decodedToken.exp * 1000 < currentDate.getTime()) {      
      return false;
    } else {     
      return true;
    }
  }
 else {
  return false;
 }
};

const getNewToken = () =>{
  var name=localStorage.getItem("EncyptedUserName");
  var pass= localStorage.getItem("EncyptedPassword");
  var data={ username:name,password:pass}
  postRequest({
    requesturl: getUrl() + "/Login/GetToken",
    formData:data,
    IsLoginRequest:true,                       
  }).then((res) => {      
   
    localStorage.setItem("JwtToken", res.data.barearToken); 
          
  }).catch((error) =>{
    console.log(error);
  });
}


const getRequestcall=(props)=>
axios
  .get(props.requesturl,{
    headers:  {
      Authorization: 'Bearer ' + localStorage.getItem("JwtToken") 
    }
  })
  .then((res) => {
    return res.data;
  })
  .catch((error) => {
    // Error
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      return {
        error: true,
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      console.log(error.request);
      return { error: true, data: error.request };
    } else {
      console.log("Error", error.message);
      return { error: true, data: error.message };
    }
  });

  const postRequestcall = (props) =>
  axios
  .post(props.requesturl, props.formData,{headers:  {
    Authorization: 'Bearer ' + localStorage.getItem("JwtToken") 
  }})
  .then((res) => {
    return res;
  })
  .catch((error) => {
    // Error
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      return {
        error: true,
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      console.log(error.request);
      return { error: true, data: error.request };
    } else {
      console.log("Error", error.message);
      return { error: true, data: error.message };
    }
  });


export const getRequest = (props) =>{
  if(props.IsLoginRequest){
    return getRequestcall(props)
  }else{
    if(!IsTokenValid()){
      //getNewToken();
      
    }
    return getRequestcall(props)
  }
}

export const deleteRequest = (props) =>
  axios
    .delete(props.requesturl)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      // Error
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        return {
          error: true,
          status: error.response.status,
          data: error.response.data,
        };
      } else if (error.request) {
        console.log(error.request);
        return { error: true, data: error.request };
      } else {
        console.log("Error", error.message);
        return { error: true, data: error.message };
      }
    });

export const postRequest = (props) =>{
  if(props.IsLoginRequest){  
    return postRequestcall(props)
  }else{
    if(!IsTokenValid()){
      //getNewToken();
    }
      return postRequestcall(props)
    }
  }
  
