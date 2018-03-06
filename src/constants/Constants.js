// const DEVBASEURL = 'http://120.78.184.120:9002'
const ONLINEBASEURL = 'http://120.78.184.120:9002'

const LOGINURL = `${ONLINEBASEURL}/api/authOperator/login`
const LOGINOUTTOKEN = `${ONLINEBASEURL}/api/authOperator/signOut`
const MANAGEMENTPLATFORM = `${ONLINEBASEURL}/api/operator/getOperators`
// const SEARCHID = `${ONLINEBASEURL}/api/operator/getOperator`
const DELETEMANAGE = `${ONLINEBASEURL}/api/operator/deleteOperator/`
const MODIFYMANAGE = `${ONLINEBASEURL}/api/operator/modifyOperator`
const CREATEMANAGE = `${ONLINEBASEURL}/api/operator/createOperator`
const GETAUDITEDHES = `${ONLINEBASEURL}/api/operatorUser/geUsers`
const DELETEHR = `${ONLINEBASEURL}/api/operatorUser/deleteUser/`
const MODIEFYHRPASSWORD = `${ONLINEBASEURL}/api/operatorUser/modifyUser`
const GETCOMPONANIESLIST = `${ONLINEBASEURL}/api/operatorCompany/getCompanies`
const SETCOMPANYSERVICEFEE = `${ONLINEBASEURL}/api/operatorCompany/setCompanyServiceFee`
const SEARCHCOMPANY = `${ONLINEBASEURL}/api/operatorCompany/getCompany`
const GETHRMANAGER = `${ONLINEBASEURL}/api/operatorCompany/getHRManager/`
const MODIFYHRMANAGEPASSWORD = `${ONLINEBASEURL}/api/operatorCompany/modifyHrManagerPassword`
const CHANGEHRMANAGER = `${ONLINEBASEURL}/api/operatorCompany/changeHrManager`
const CHANGECOMPANYSTATE = `${ONLINEBASEURL}/api/operatorCompany/setCompanyState`
const GET_JOB_LIST = `${ONLINEBASEURL}/api/operator/getJobDetails`
const GET_JOB_DETAIL = `${ONLINEBASEURL}/api/operator/getJobDetail/`
const SET_PRICE = `${ONLINEBASEURL}/api/operatorHuman/setPrice`
const GET_RESUME_LIST = `${ONLINEBASEURL}/api/operatorHuman/resumes`
const GET_RESUME_DETAIL = `${ONLINEBASEURL}/api/operatorHuman/resume/`
const MODIFY_RESUME = `${ONLINEBASEURL}/api/operatorHuman/modify`
const DELETE_RESUME = `${ONLINEBASEURL}/api/operatorHuman/delete/`
const IMPORT_RESUME = `${ONLINEBASEURL}/api/operatorHuman/importResume`
const GET_COMMISSION_COMFIRM = `${ONLINEBASEURL}/api/commissionConfirmConfig/getConfig`
const SET_COMMISSION_COMFIRM = `${ONLINEBASEURL}/api/commissionConfirmConfig/setCommissionConfirmConfig`
const GETALLCOMPANIES = `${ONLINEBASEURL}/api/operatorCompany/companies`
const SENDSYSTEMMSG=`${ONLINEBASEURL}/api/operatorMessage/sendMessage`
const GETSENDLIST=`${ONLINEBASEURL}/api/operatorMessage/getMessageLogs`
const GETCOMPANYMONTHSTATISTICS=`${ONLINEBASEURL}/api/operatorStatistics/getCompanyMonthStatistics`
const GETHRSTATISTICS=`${ONLINEBASEURL}/api/operatorStatistics/getHRStatistics`
const GETUSERSTATISTICS=`${ONLINEBASEURL}/api/operatorStatistics/getUserStatistics`
///api/operatorCompany/companies
module.exports = {
    LOGINURL: LOGINURL,
    LOGINOUTTOKEN: LOGINOUTTOKEN,
    MANAGEMENTPLATFORM:MANAGEMENTPLATFORM,
    // SEARCHID:SEARCHID,
    DELETEMANAGE:DELETEMANAGE,
    MODIFYMANAGE:MODIFYMANAGE,
    CREATEMANAGE:CREATEMANAGE,
    GETAUDITEDHES:GETAUDITEDHES,
    DELETEHR:DELETEHR,
    MODIEFYHRPASSWORD:MODIEFYHRPASSWORD,
    GETCOMPONANIESLIST:GETCOMPONANIESLIST,
    SETCOMPANYSERVICEFEE:SETCOMPANYSERVICEFEE,
    SEARCHCOMPANY:SEARCHCOMPANY,
    GETHRMANAGER:GETHRMANAGER,
    MODIFYHRMANAGEPASSWORD:MODIFYHRMANAGEPASSWORD,
    CHANGEHRMANAGER:CHANGEHRMANAGER,
    CHANGECOMPANYSTATE:CHANGECOMPANYSTATE,
    GETALLCOMPANIES:GETALLCOMPANIES,
    GET_JOB_LIST:GET_JOB_LIST,
    GET_JOB_DETAIL:GET_JOB_DETAIL,
    SET_PRICE:SET_PRICE,
    GET_RESUME_LIST:GET_RESUME_LIST,
    GET_RESUME_DETAIL:GET_RESUME_DETAIL,
    MODIFY_RESUME:MODIFY_RESUME,
    DELETE_RESUME:DELETE_RESUME,
    IMPORT_RESUME:IMPORT_RESUME,
    GET_COMMISSION_COMFIRM:GET_COMMISSION_COMFIRM,
    SET_COMMISSION_COMFIRM:SET_COMMISSION_COMFIRM,
    SENDSYSTEMMSG:SENDSYSTEMMSG,
    GETSENDLIST:GETSENDLIST,
    GETCOMPANYMONTHSTATISTICS:GETCOMPANYMONTHSTATISTICS,
    GETHRSTATISTICS:GETHRSTATISTICS,
    GETUSERSTATISTICS:GETUSERSTATISTICS
}
