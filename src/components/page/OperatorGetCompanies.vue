<template>
    <div class="table">
        <el-dialog title="重置平台服务费" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="原服务费" :label-width="formLabelWidth">
                    <el-input disabled="disabled" v-model="form.oldPercentageServiceFee" auto-complete="off" style="width:70%;border:none;"></el-input>
                </el-form-item>
                <el-form-item label="新服务费" :label-width="formLabelWidth">
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
        <el-collapse class="handle-box">
            <div class="search">
                <div class="">
                    <el-input v-model="searchName" clearable size="medium" placeholder="输入企业名称" class="handle-title"></el-input>
                    <el-button type="primary" size="medium" icon="el-icon-search" @click="searchCompany">查询</el-button>
                </div>
            </div>
            <el-collapse-item title="排序选项" class="sortOption">
                <div class="sortItem" v-for="item of sortGroup">
                    <span>{{ item.display }}</span>
                    <el-select v-model="item.value" :name="item.name" ref="sel" size="small">
                        <el-option v-for="option in sortOptions" :label="option.label" :value="option.value"
                            :key="option.value">
                        </el-option>
                    </el-select>
                </div>
            </el-collapse-item>
        </el-collapse>
        <table class="table table-bordered" cellpadding="0" cellspacing="0" >
            <tr class="tr-header">
                <th>{{name.label}}</th>
                <th>{{settleType.label}}</th>
                <th>{{contacts.label}}</th>
                <th>{{contactNumber.label}}</th>
                <th>{{taxNumber.label}}</th>
                <th>{{address.label}}</th>
                <th>{{state.label}}</th>
                <th>{{setCompanyServiceFee.label}}</th>
                <th>{{gethrManager.label}}</th>
            </tr>
            <tr class="tr-con"  v-for="(pro,idx) in hr_list">
                <td style="max-width:78px;" @click="showOffer(pro.id,pro.name)">{{pro.name}}</td>
                <td>{{pro.settleType| stateFormat}}</td>
                <td>
                    {{pro.contacts==null?"":pro.contacts}}
                </td>
                <td>
                    {{pro.contactNumber==null?"":pro.contactNumber}}
                </td>
                <td>{{pro.taxNumber==''?"":pro.taxNumber}}</td>
                <td style="max-width:78px;">{{pro.address==null?"":pro.address}}</td>
                <td class="currentState" @click="changeState(pro.id,pro.state,idx)">
                    <el-button v-if="pro.state != 'OFF'" type="primary"  round style="padding: 4px 10px!important;">{{pro.state| stateChange}}</el-button>
                    <el-button v-if="pro.state=='OFF'" type="info"  round style="padding: 4px 10px!important;background-color: #c8c9cc;border-color: #c8c9cc;">{{pro.state| stateChange}}</el-button>
                </td>
                <td>
                    <el-button v-if="pro.state != 'OFF'" type="primary"  @click="modifyManageplatform(pro.id)">重置平台服务费</el-button>
                    <el-button v-if="pro.state == 'OFF'" disabled="disabled"  type="info">重置平台服务费</el-button>
                </td>
                <td class="last-td">
                    <el-button v-if="pro.state != 'OFF'" type="primary"  @click="getHRManager(pro.id)" >查看HR管理员信息</el-button>
                    <el-button v-if="pro.state == 'OFF'" disabled="disabled" type="info">查看HR管理员信息</el-button>
                </td>
            </tr>
        </table>
        <div colspan="9" class="lastTd" style="text-align: right;margin:20px 0;">
            <div class="block">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="cur_page"
                    :page-sizes="[5,10,15,20,25,30]"
                    :page-size="pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalNumber">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="该企业HR管理员信息" :visible.sync="outerVisible">
            <table style="padding:0 5px;" class="table table-bordered" cellpadding="0" cellspacing="0" >
                <tr class="tr-header hrInfo">
                    <td><strong>用户名:</strong></td>
                    <td class="contents">{{hrInfo.username}}</td>
                </tr>
                <tr class="tr-header hrInfo">
                    <td><strong>类  型:</strong></td>
                    <td>{{hrInfo.type=="HR_MANAGER"?"HR管理员":"其他"}}</td>
                    <td><strong>工  号:</strong></td>
                    <td>{{hrInfo.jobNumber}}</td>
                </tr>
                <tr class="tr-header hrInfo">
                    <td><strong>当前状态:</strong></td>
                    <td class="contents">{{hrInfo.state=="Using"?"启用":"禁用"}}</td>
                    <td><strong>评论数:</strong></td>
                    <td>{{hrInfo.evaluateCount}}</td>
                </tr>
                <tr class="tr-header hrInfo">
                    <td><strong>联系电话:</strong></td>
                    <td class="contents">{{hrInfo.cellphone}}</td>
                    <td><strong>身份证号:</strong></td>
                    <td>{{hrInfo.idCardNumber}}</td>
                </tr>
                <tr class="tr-header hrInfo">
                    <td><strong>创建时间:</strong></td>
                    <td>{{new Date(hrInfo.createTime).toLocaleString()}}</td>
                    <td><strong>最后登录时间:</strong></td>
                    <td>{{new Date(hrInfo.lastLoginTime).toLocaleString()}}</td>
                </tr>
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
                    <el-form-item label="用户名" :label-width="formLabelWidth">
                        <el-input  v-model="resetForm.resetUsername" auto-complete="off" style="width:70%;"></el-input>
                    </el-form-item>
                    <el-form-item label="密  码" :label-width="formLabelWidth">
                        <el-input type="password"  v-model="resetForm.resetPassword" auto-complete="off" style="width:70%;"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" :label-width="formLabelWidth">
                        <el-input v-model="resetForm.resetIdCardNumber" auto-complete="off" style="width:70%;"></el-input>
                    </el-form-item>
                    <el-form-item label="工  号" :label-width="formLabelWidth">
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
    import Sortable from 'sortablejs'
    import axios from 'axios';
    import { GETCOMPONANIESLIST,
        SETCOMPANYSERVICEFEE,SEARCHCOMPANY,
        GETHRMANAGER,MODIFYHRMANAGEPASSWORD,
        CHANGEHRMANAGER,CHANGECOMPANYSTATE } from '../../constants/Constants'
    axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
    axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('resultMessage')
    export default {
        filters: {
            stateFormat(val) {
                var v = (val + '').toString().toLowerCase()
                if (v == 'company_settle') {
                    return '公司结算'
                } else if (v == 'order_settle') {
                    return '订单结算'
                } else {
                    return ''
                }
            },
            stateChange(val) {
                var v = (val + '').toString().toLowerCase()
                if (v == 'on') {
                    return '开启'
                } else if (v == 'off') {
                    return '关闭'
                } else {
                    return ''
                }
            }
        },
        computed: {

        },
        data() {
            return {
                changestate:'',
                changeCompanyId:'',
                value3:false,
                name:{
                    title:'name',
                    label:'企业名称'
                },
                settleType:{
                    title:'settleType',
                    label:'结算方式'
                },
                contacts:{
                    title:'contacts',
                    label:'联系人'
                },
                contactNumber:{
                    title:'contactNumber',
                    label:'联系电话'
                },
                state:{
                    title:'state',
                    label:'状态'
                },
                taxNumber:{
                    title:'taxNumber',
                    label:'税号'
                },
                address:{
                    title:'address',
                    label:'地址'
                },
                setCompanyServiceFee:{
                    title:'setCompanyServiceFee',
                    label:'设置平台服务费'
                },
                gethrManager:{
                    title:'gethrManager',
                    label:'获取HR管理员'
                },
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
                pagesize:10,
                checked:false,
                deleteId:'',
                modifyId:'',
                dialogFormVisible: false,
                form: {
                    percentageServiceFee: '',
                    oldPercentageServiceFee:0.1,
                },
                formLabelWidth: '160px',
                searchName:'',
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
                },

                search_title: '',
                sortBy: [],
                sortGroup: [
                    {value: '0', name: 'contactNumber', display: '联系电话'},
                    {value: '0', name: 'taxNumber', display: '税号'},
                    {value: '0', name: 'settleType', display: '结算方式'},
                    {value: '0', name: 'state', display: '状态'},
                    {value: '0', name: 'address', display: '地址'},
                    {value: '0', name: 'contacts', display: '联系人'}
                ],
                sortOptions: [{value: '0', label: '默认'},
                    {value: 'asc', label: '升序'},
                    {value: 'desc', label: '降序'}],
            }
        },
        created(){
            this.getData();
            this.setSort()
        },
        methods: {
            handleSizeChange(val){
                this.pagesize=val
                this.getData();
                this.searchCompany()
            },
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            setSort() {
                this.$nextTick(() => {
                    const el = document.querySelectorAll('.sortOption .el-collapse-item__content')[0]
                    this.sortable = Sortable.create(el, {
                        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
                        setData: dataTransfer => dataTransfer.setData('Text', '')
                    })
                })
            },
            getData(){
                let self = this;
                var option = '?page='+parseInt(self.cur_page-1)+'&size='+this.pagesize
                var sortStr = ''
                if (self.sortBy.length != 0) {
                    for (var s in self.sortBy) {
                        sortStr = sortStr + '&sort=' + self.sortBy[s]
                    }
                }
                if (sortStr.length != 0) {
                    option = option + sortStr
                }
                self.url = GETCOMPONANIESLIST;
                self.$axios.get(self.url+option).then((response) => {
                    console.log(response)
                    self.totalNumber=parseInt(response.data.totalElements);
                    self.hr_list=response.data.content
                    console.log(this.hr_list)
                }).catch(() => {
                    self.hr_list=[]
                    self.$message({
                        type: 'info',
                        message: '暂无数据'
                    })
                })
            },
            searchCompany(){
                let self = this;
                var list = document.querySelectorAll('.sortOption .el-input__inner')
                var el = this.$refs.sel
                var map = {}
                self.sortBy = []
                el.forEach(obj => {
                    return map[obj.$options.propsData.name] = obj.$options.propsData.value
                })
                Array.prototype.map.call(list, obj => {
                    if (map[obj.name] != '0') {
                        self.sortBy.push(obj.name + ',' + map[obj.name])
                    }
                })
                this.getData()
                self.cur_page = 1;
                self.url = GETCOMPONANIESLIST;
                self.$axios.get(self.url+'?page='+parseInt(self.cur_page-1)+'&size='+self.pagesize+'&name='+self.searchName).then((response) => {
                    console.log(response)
                    self.totalNumber=parseInt(response.data.totalElements)
                    self.hr_list=response.data.content
                    console.log(this.hr_list)
                }).catch(() => {
                    self.$message({
                        type: 'info',
                        message: '查找失败'
                    })
                })
            },
            modifyManageplatform(id){
                let self = this;
                this.modifyId=id
                self.url = SEARCHCOMPANY;
                self.$axios.get(self.url+'/'+this.modifyId).then((response) => {
                    console.log(response)
                    this.form.oldPercentageServiceFee=response.data.percentageServiceFee
                })
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
                if((self.oldPassword!='' && self.newPassword!='') && (self.newPassword == self.oldPassword)){
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
                    if(self.oldPassword=='' || self.newPassword==''){
                        self.$message.error('密码输入为空，无效！')
                    }else if (self.newPassword != self.oldPassword){
                        self.$message.error('两次密码不一致，请重新输入！')
                    }
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
                    this.form.oldPercentageServiceFee=this.form.percentageServiceFee
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
                        self.url2 = GETHRMANAGER;
                        self.$axios.get(self.url2+this.currentCompany).then((response) => {
                            console.log('reset getHRManager')
                            console.log(response)
                            this.hrInfo=response.data
                        })
                    }
                })
            },
            changeState(id,state,idx) {
                let self = this;
                this.changeCompanyId=id
                this.changestate=state
                console.log(this.changeCompanyId)
                console.log(this.changestate)
                if(this.changestate==='ON'){
                     this.changestate='OFF'
                }else if(this.changestate==='OFF'){
                     this.changestate='ON'
                }
                console.log(this.changestate)
                let changedState={
                    id:this.changeCompanyId,
                    state: this.changestate
                }
                self.url = CHANGECOMPANYSTATE;
                self.$axios.post(self.url,changedState).then((response) => {
                    console.log(response)
                    console.log(response.data.state)
                    self.hr_list[idx].state=response.data.state
                    console.log(self.hr_list.state)
                })
            },
            showOffer(id,name){
                sessionStorage.setItem("companyName",name)
                this.$router.push({path: '/OfferConfig', query: {id : id }})
            }
        }
    }
</script>

<style scoped>
    .hrInfo td{
        text-align: left;
        padding:10px 15px;
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
    .search-box{
        width:50%;
        display: inline-block;
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
        border:1px solid #ebeef5;
        cursor: default;
    }
    table tr:hover{
        cursor: pointer;
        background:#f5f7f596;
    }
    .tr-header,.hrInfo th{
        border-bottom: 1px solid #73D6ED;
    }
    .tr-header th{
        font-size: 14px;
        color: #333;
        background:#eef1f6;
        padding: 13px 10px!important;
    }
    .tr-con td,.lastTd td{
        text-align: center;
        padding:12px 5px!important;
    }
    .tr-con:first-child{
        border-top:none!important;
    }
    .tr-con td{
        border-right: 1px solid #ebeef5;
        border-top: 1px solid #ebeef5;
        font-size: 13px;
        color: #333;
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
<style scoped>
    .sortable-ghost {
        opacity: .7;
    }
    .cell{
        text-align:center!important;
    }
    .search {
        padding: 10px 15px;
        border-bottom: 1px solid #dfe6ec;
    }

    .handle-box {
        border: 1px solid #dfe6ec;
        margin-bottom: 20px;
    }

    .handle-title {
        width: 170px;
    }

    .handle-size {
        width: 180px;
        vertical-align: bottom;
    }

    .sortItem {
        border: 1px solid #bfcbd9;
        border-radius: 4px;
        display: inline-block;
        padding-right: 1px;
        margin-right: 5px;
        margin-bottom: 5px;
    }

    .sortItem span {
        display: inline-block;
        padding: 0 10px;
        line-height: 36px;
        cursor: move;
        font-size: 14px;
        vertical-align: top;
        color: white;
        background-color: #42b983;
    }
</style>
<style>
    #jdlist.el-table .cell, #jdlist.el-table th div {
        color: #333;
        padding: 0 10px;
    }

    .jdlist-row {
        cursor: pointer;
    }

    #jdlist th {
        background-color: #eef1f6;
    }

    .handle-size .el-input {
        display: inline-table;
    }

    .sortOption .el-collapse-item__arrow {
        float: left;
        font-size: 14px;
        line-height: 14px;
        margin-top: 17px;
    }

    .sortItem input {
        color: #42b983;
        border: none;
        width: 75px;
    }

    .sortOption .el-collapse-item__header {
        padding: 0 15px;
        border-bottom: 1px solid #dfe6ec;
    }

    .sortOption .el-collapse-item__content {
        padding: 10px 15px;
    }
</style>
