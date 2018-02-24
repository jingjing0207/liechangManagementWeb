<template>
    <div class="table">
        <el-dialog title="重置平台服务费" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="重置：" :label-width="formLabelWidth">
                    <el-input v-model="form.percentageServiceFee" auto-complete="off" style="width:70%;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="ResetPercentageServiceFee()">确 定</el-button>
            </div>
        </el-dialog>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 企业管理</el-breadcrumb-item>
                <el-breadcrumb-item>企业列表管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="plugins-tips">
            <div class="handle-box" style="margin-bottom: 0;float: right;">
                <el-input v-model="searchId" placeholder="输入查询的企业ID" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="searchCompanyId()">搜索</el-button>
            </div>
        </div>
        <table class="table table-bordered" cellpadding="0" cellspacing="0" >
            <tr class="tr-header">
                <th>name</th>
                <th>settleType</th>
                <th>contacts</th>
                <th>contactNumber</th>
                <th>state</th>
                <th>taxNumber</th>
                <th>address</th>
                <th>setCompanyServiceFee</th>
                <th>getHRManager</th>
            </tr>
            <tr class="tr-con"  v-for="(pro,idx) in hr_list" v-show="allResult">
                <td>{{pro.name}}</td>
                <td>{{pro.settleType==null?"null":pro.settleType}}</td>
                <td>
                    {{pro.contacts==null?"null":pro.contacts}}
                </td>
                <td>
                    {{pro.contactNumber==null?"null":pro.contactNumber}}
                </td>
                <td class="currentState">{{pro.state}}</td>
                <td>{{pro.taxNumber==''?"null":pro.taxNumber}}</td>
                <td>{{pro.address==null?"null":pro.address}}</td>
                <td class="last-td">
                    <el-button type="primary" plain @click="modifyManageplatform(pro.id)">重置平台服务费</el-button>
                    <!--<el-button type="danger" @click="deleteHR(pro.id)">删除</el-button>-->
                </td><td class="last-td">
                <el-button type="info" plain @click="getHRManager(pro.id)">获取HR管理员信息</el-button>
                <!--<el-button type="danger" @click="deleteHR(pro.id)">删除</el-button>-->
            </td>
            </tr>
            <tr class="tr-con" v-show="searchResult">
                <td>{{searhresult.name}}</td>
                <td>{{searhresult.settleType==null?"null":searhresult.settleType}}</td>
                <td>
                    {{searhresult.contacts==null?"null":searhresult.contacts}}
                </td>
                <td>
                    {{searhresult.contactNumber==null?"null":searhresult.contactNumber}}
                </td>
                <td class="currentState">{{searhresult.state}}</td>
                <td>{{searhresult.taxNumber==''?"null":searhresult.taxNumber}}</td>
                <td>{{searhresult.address==null?"null":searhresult.address}}</td>
                <td class="last-td">
                    <el-button type="primary" plain @click="modifyManageplatform(searhresult.id)">重置平台服务费</el-button>
                    <!--<el-button type="danger" @click="deleteHR(pro.id)">删除</el-button>-->
                </td>
            </tr>
            <tr class="tr-con pagination">
                <td colspan="9" align="center" class="lastTd">
                    <div class="block">
                        <el-pagination
                            @current-change ="handleCurrentChange"
                            layout="total, prev, pager, next"
                            :page-size="pagesize"
                            :total=totalNumber>
                        </el-pagination>
                    </div>
                </td>
            </tr>
        </table>
        <el-dialog title="该企业HR管理员信息" :visible.sync="outerVisible">
            <table class="table table-bordered" cellpadding="0" cellspacing="0" >
                <tr class="tr-header tr-con hrInfo">
                    <td><strong>cellphone:</strong></td>
                    <td>{{hrInfo.cellphone}}</td>
                    <td><strong>username:</strong></td>
                    <td>{{hrInfo.username}}</td>
                    <td><strong>createTime:</strong></td>
                    <td>{{new Date(hrInfo.createTime).toLocaleString()}}</td>

                    <!--new Date(pro.createTime).toLocaleString()-->
                </tr>
                <tr class="tr-header tr-con hrInfo">
                    <td><strong>evaluateCount:</strong></td>
                    <td>{{hrInfo.evaluateCount}}</td>
                    <td><strong>idCardNumber:</strong></td>
                    <td>{{hrInfo.idCardNumber}}</td>
                    <td><strong>jobNumber:</strong></td>
                    <td>{{hrInfo.jobNumber}}</td>
                </tr>
                <tr class="tr-header tr-con hrInfo">
                    <td><strong>lastLoginTime:</strong></td>
                    <td>{{new Date(hrInfo.lastLoginTime).toLocaleString()}}</td>
                    <td><strong>state:</strong></td>
                    <td>{{hrInfo.state}}</td>
                    <td><strong>type:</strong></td>
                    <td>{{hrInfo.type}}</td>
                </tr>
                <!--<div class="company" v-show="isShow">-->
                    <!--<tr class="tr-header tr-con hrInfo">-->
                        <!--<td colspan="2" rowspan="4"><strong>company</strong></td>-->
                        <!--<td><strong>name:</strong></td>-->
                        <!--<td>{{hrInfo.company.name}}</td>-->
                        <!--<td><strong>settleType:</strong></td>-->
                        <!--<td>{{hrInfo.company.settleType}}</td>-->
                    <!--</tr>-->
                    <!--<tr class="tr-header tr-con hrInfo">-->
                        <!--<td><strong>address:</strong></td>-->
                        <!--<td>{{hrInfo.company.address}}</td>-->
                        <!--<td><strong>contactNumber:</strong></td>-->
                        <!--<td>{{hrInfo.company.contactNumber}}</td>-->
                    <!--</tr>-->
                    <!--<tr class="tr-header tr-con hrInfo">-->
                        <!--<td><strong>contacts:</strong></td>-->
                        <!--<td>{{hrInfo.company.contacts}}</td>-->
                        <!--<td><strong>createTime:</strong></td>-->
                        <!--<td>{{hrInfo.company.createTime}}</td>-->
                    <!--</tr>-->
                    <!--<tr class="tr-header tr-con hrInfo">-->
                        <!--<td><strong>state:</strong></td>-->
                        <!--<td>{{hrInfo.company.state}}</td>-->
                        <!--<td><strong>taxNumber:</strong></td>-->
                        <!--<td>{{hrInfo.company.taxNumber}}</td>-->
                    <!--</tr>-->
                <!--</div>-->
            </table>
            <el-dialog
                width="50%"
                title="修改HR管理员密码"
                :visible.sync="innerVisible"
                append-to-body>
                <el-form :model="form">
                    <el-form-item label="输入新密码" :label-width="formLabelWidth">
                        <el-input type="password" v-model="oldPassword" auto-complete="off" style="width:70%;"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" :label-width="formLabelWidth">
                        <el-input type="password"  v-model="newPassword" auto-complete="off" style="width:70%;"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="modifyManagerPassword()">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog
                width="50%"
                title="变更HR管理员"
                :visible.sync="otherInnerVisible"
                append-to-body>
                <el-form :model="form">
                    <el-form-item label="username" :label-width="formLabelWidth">
                        <el-input  v-model="resetForm.resetUsername" auto-complete="off" style="width:70%;"></el-input>
                    </el-form-item>
                    <el-form-item label="password" :label-width="formLabelWidth">
                        <el-input type="password"  v-model="resetForm.resetPassword" auto-complete="off" style="width:70%;"></el-input>
                    </el-form-item>
                    <el-form-item label="idCardNumber" :label-width="formLabelWidth">
                        <el-input v-model="resetForm.resetIdCardNumber" auto-complete="off" style="width:70%;"></el-input>
                    </el-form-item>
                    <el-form-item label="jobNumber" :label-width="formLabelWidth">
                        <el-input  v-model="resetForm.resetJobNumber" auto-complete="off" style="width:70%;"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="resetHrManager()">确 定</el-button>
                </div>
            </el-dialog>
            <div slot="footer" class="dialog-footer">
                <el-button @click="outerVisible = false">取 消</el-button>
                <el-button type="info" @click="otherInnerVisible = true">变更HR管理员</el-button>
                <el-button type="primary" @click="innerVisible = true">修改HR管理员密码</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios';
    import {GETCOMPONANIESLIST,
        SETCOMPANYSERVICEFEE,SEARCHCOMPANY,
        GETHRMANAGER,MODIFYHRMANAGEPASSWORD,
        CHANGEHRMANAGER} from '../../constants/Constants'
    axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
    axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('resultMessage')
    export default {
        data() {
            return {
                centerDialogVisible:false,
                inputValue: '',
                pagination:{},
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                hr_list: [],
                idx:'',
                pro:0,
                is_search: false,
                totalNumber:0,
                pagesize:8,
                checked:false,
                deleteId:'',
                modifyId:'',
                dialogFormVisible: false,
                form: {
                    percentageServiceFee: ''
                },
                formLabelWidth: '160px',
                searchId:'',
                searchResult:false,
                allResult:true,
                searhresult:'',
                currentCompany:'',
                outerVisible:false,
                innerVisible: false,
                hrInfo:'',
                isShow:false,
                oldPassword:'',
                newPassword:'',
                otherInnerVisible:false,
                resetForm:{
                    resetUsername:'',
                    resetPassword:'',
                    resetIdCardNumber:'',
                    resetJobNumber:'',
                }
            }
        },
        created(){
            this.getData();
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            getData(){
                let self = this;
                self.url = GETCOMPONANIESLIST;
                self.$axios.get(self.url+'?page='+parseInt(self.cur_page-1)+'&size='+this.pagesize).then((response) => {
                    console.log(response)
                    this.totalNumber=parseInt(response.data.totalElements)
                    this.hr_list=response.data.content
                    console.log(this.hr_list)
                })
            },
            searchCompanyId(){
                let self = this;
                self.url = SEARCHCOMPANY;
                self.$axios.get(self.url+'/'+this.searchId).then((response) => {
                    console.log(response)
                    this.totalNumber=1
                    this.searhresult=response.data
                    console.log(this.searhresult)
                    this.searchResult=true
                    this.allResult=false
                })
            },
            modifyManageplatform(id){
                this.modifyId=id
                this.form.percentageServiceFee=''
                this.dialogFormVisible=true
            },
            getHRManager(id){
                this.currentCompany=id
                sessionStorage.setItem('companyId',this.currentCompany)
                let self = this;
                self.url = GETHRMANAGER;
                self.$axios.get(self.url+this.currentCompany).then((response) => {
                    this.outerVisible =true
                    console.log('success getHRManager')
                    console.log(response)
                    this.hrInfo=response.data
                    sessionStorage.setItem('hrManagerId', response.data.id)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '查找失败，该企业无HR管理员信息！'
                    })
                })
            },
            modifyManagerPassword(){
                let self = this
                if(this.newPassword==this.oldPassword){
                    let modifyManager={
                        id:sessionStorage.getItem('hrManagerId'),
                        password:this.newPassword
                    }
                    self.url = MODIFYHRMANAGEPASSWORD;
                    self.$axios.post(self.url,modifyManager).then((response) => {
                        console.log(response)
                        this.$message({
                            type: 'success',
                            message: '密码修改成功'
                        })
                    })
                }else{
                    self.$message.error('两次密码输入不相同,请重新输入！')
                }
            },
            ResetPercentageServiceFee() {
                let self = this
                let newModify = {
                    id: this.modifyId,
                    percentageServiceFee: this.form.percentageServiceFee
                }
                self.url = SETCOMPANYSERVICEFEE;
                self.$axios.post(self.url, newModify).then((response) => {
                    console.log(response)
                    this.dialogFormVisible = false
                    this.$message({
                        type: 'success',
                        message: '重置成功'
                    })
                })
            },
            resetHrManager(){
                console.log(this.currentCompany)
                let resetInfo={
                    companyId:sessionStorage.getItem('companyId'),
                    idCardNumber:this.resetForm.resetIdCardNumber,
                    jobNumber:this.resetForm.resetJobNumber,
                    password:this.resetForm.resetPassword,
                    username:this.resetForm.resetUsername
                }
                let self = this
                self.url = CHANGEHRMANAGER;
                self.$axios.post(self.url, resetInfo).then((response) => {
                    console.log(response)
                    if(response.status==200){
                        this.$message({
                            type: 'success',
                            message: '变更成功'
                        })
                        // self.url2 = GETHRMANAGER;
                        // self.$axios.get(self.url2+this.currentCompany).then((response) => {
                        //     console.log('success getHRManager')
                        //     console.log(response)
                        //     this.hrInfo=response.data
                        // })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .hrInfo td{
        border-right: 1px solid #eeeeee;
    }
    .el-table thead {
        color: #000!important;
    }
    .handle-box{
        margin-bottom: 20px;
    }
    .el-button{
        padding:10px 16px!important;
    }
    .handle-select{
        width: 120px;
    }
    .handle-input{
        width: 300px;
        display: inline-block;
    }

    .el-input__inner{
        width: 60%!important;
    }
    .el-form-item__label {
        font-size: 17px!important;
        color: black!important;
    }
    .el-message-box__message p span{
        display: block;
        font-size:16px;
        color:black;
        margin-top:8px;
    }
    .el-message-box .el-message-box__header{
        padding: 20px 21px 23px!important;
        background: #242424!important;
    }
    .el-message-box__title{
        font-size: 18px!important;
    }
    .el-message-box__message p span{
        font-size:18px;
        color:black;
    }
    .modifyPassword{
        /*display: none;*/
    }
    .handle-box{
        width:50%;
        display: inline-block;
    }
    .handle-input{
        width:70%;
        margin-left:2%;
    }
    .plugins-tips{
        overflow: hidden;
        padding: 12px 21px!important;
    }
    .addInnfo{
        /*float: right;*/
    }
    .content-table-list{
        width:100%;
        border-radius:12px!important;
    }
    table{
        width:100%;
        height:auto;
        border-radius:12px;
        border:1px solid #eee;
        cursor: default;
    }
    .tr-header{
        border-bottom: 1px solid #73D6ED;
    }
    .tr-header th{
        font-size: 14px;
        color: #000;
    }
    .tr-header th,.tr-con td,.lastTd td{
        text-align: center;
        padding:12px 2px!important;
    }
    .tr-con:first-child{
        border-top:none!important;
    }
    .tr-con td{
        /*border-right:1px solid #eee;*/
        border-top: 1px solid #ebeef5;
        font-size: 12px;
        color: #606266;
    }
    .last-td{
        border-right:none!important;
    }
    .lastTd td{
        padding: 20px!important;
    }
    .passwordTitle{
        max-width: 115px;
        overflow-x: auto;
    }
</style>
