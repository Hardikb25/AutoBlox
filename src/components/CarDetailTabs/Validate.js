function ValidateString(text,regExp,errMsg){
    let result="";
    let revalidator = new RegExp(regExp).test(text);
    if(!revalidator){
        result = errMsg + "\n";
    }
    return(
        result
    );
}

export default ValidateString