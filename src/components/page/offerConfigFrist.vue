<template>
    <div class="offer-box">
        <div style="font-size: 14px;">
            <span style="border-bottom: 1px solid #dcdfe6;">${candidateName}</span>
            <p style="display: inline-block;text-indent: 0;">女士/先生:</p>
            <p>您好！</p>
            <p class="textIndent">感谢您应聘我公司的相关职位，经过认真筛选和选拔，
                现非常荣幸的通知您，您已被我司录取。</p>
            <p class="department">您的工作部门是：<span style="border-bottom: 1px solid #dcdfe6;">${department} </span></p>
            <p class="position ">职位是：<span style="border-bottom: 1px solid #dcdfe6;"> ${position}</span></p>
            <p class="workplace ">您的工作地点目前是: <span style="border-bottom: 1px solid #dcdfe6;">${workplace}</span> 并根据工作需要服从安排 </p>
            <p class="leader ">您的直接上级是：<span style="border-bottom: 1px solid #dcdfe6;">${leader}</span></p>
            <p class="salary ">您的工资是：<span style="border-bottom: 1px solid #dcdfe6;">${salary}</span></p>
            <p class="probationSalary ">试用期工资：<span style="border-bottom: 1px solid #dcdfe6;">${probationSalary}</span></p>
            <p class="reportDutyTime ">您的工作起始时间是：<span style="border-bottom: 1px solid #dcdfe6;">${reportDutyTime?string("yyyy-MM-dd")}</span></p>
            <p class="contractPeriod ">您的合同年限是：<span style="border-bottom: 1px solid #dcdfe6;">${contractPeriod}</span></p>
            <p class="probationPeriod">试用期：<span style="border-bottom: 1px solid #dcdfe6;">${probationPeriod}</span></p>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
    axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('resultMessage')
    export default {
        data() {
            return {

            }
        },
        created() {


        },
        mounted(){

        },
        updated(){

        },
        methods: {

        }
    }
</script>

<style scoped>
    .info{
        border-radius: 10px;
        line-height: 20px;
        padding: 10px;
        margin: 10px;
        background-color: #ffffff;
    }
    .allContent{
        width:100%;
        height:auto;
    }
    .remove-button{
        color: #409EFF!important;
    }
    body{
        margin:0;
    }
    .offer-box {
        box-shadow: unset;
        border-radius: unset;
        padding: 0!important;
    }

    .el-card__header {
        color: #333;
    }

    .h-button {
        margin-bottom: 15px;
    }

    h3, h5 {
        text-align: center;
    }

    .el-card__body p.name {
        text-indent: unset;
    }

    p {
        font-size: 14px;
        line-height: 2em;
    }

    .wubi {
        text-align: center;
        margin-top: 15px;
    }

    .el-card__body p, li {
        text-indent: 2em;
    }

    ul {
        list-style-type: decimal;
        font-size: 14px;
        line-height: 2em;
        margin-left: 4em;
    }

    ul li {
        position: relative;
        text-indent: unset;
    }

    .el-card__body .footer {
        text-indent: 0em;
        text-align: center;
    }

    .el-textarea {
        vertical-align: text-top;
    }

    .el-input {
        text-indent: 0em;
    }

    .add-button {
        font-size: 14px;
        margin: 10px 0 0 4em;
    }

    .remove-button {
        cursor: pointer;
        color: #f56c6c;
        padding: 0;
        margin: unset;
        position: absolute;
        left: -3.5em;
        top: 7px;
    }
    .el-card{
        border:none;
        margin-top:0!important;
    }
</style>
<style>
    .offer-box .el-input .el-input__inner, .cailiao .el-input .el-input__inner {
        height: 20px;
        padding: 0 5px;
        border-top: none;
        border-left: none;
        border-right: none;
        border-radius: unset;
    }
    .el-input__inner {
        /*font-weight: 600;*/
        color: #000000;
    }
    .el-textarea__inner {
        color: #000;
        font-size: 14px!important;
        line-height: 1.5em!important;
        font-family: "Helvetica Neue",Helvetica, "microsoft yahei", arial, STHeiTi, sans-serif!important;
    }
</style>




