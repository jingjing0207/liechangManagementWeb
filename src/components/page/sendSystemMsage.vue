<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 系统消息管理</el-breadcrumb-item>
                <el-breadcrumb-item>发送系统消息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-dialog title="选择用户" :visible.sync="dialogTableVisible" style="padding-top:0!important;">
                <div style="margin-bottom: 5px;margin-left:30px;float: right;">
                    <el-input v-model="searchname" class="" size="small" style="vertical-align: middle;width:70%;"></el-input>
                    <el-button type="primary" size="small" @click="searchUser">查询</el-button>
                </div>
            <el-table
                ref="singleTable"
                :data="userList"
                highlight-current-row
                @current-change="handleSelectionChange"
                style="width: 100%;font-size: 12px;text-align: center">
                <el-table-column header-align="center" type="index" width="40"></el-table-column>
                <el-table-column header-align="center" property="username" label="用户名" width=""></el-table-column>
                <el-table-column header-align="center" property="createTime" label="创建时间" width=""></el-table-column>
                <el-table-column header-align="center" property="type" label="类型" width=""></el-table-column>
                <el-table-column header-align="center" property="state" label="状态" width="100px"></el-table-column>
                <el-table-column header-align="center" property="companyName" label="公司名称"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    layout="total, prev, pager, next"
                    :total="totalNumber">
                </el-pagination>
            </div>
        </el-dialog>
        <div>
            <el-card class="">
                <el-row>
                    <el-row :span="3" style="float:left;">
                        <h4 class="labelFont" style="width:auto;">选择发送对象:</h4>
                    </el-row>
                    <div class="" style="float: left;">
                        <el-row>
                            <el-col :span="7" style="height:26px;">
                                <el-radio v-model="radio" label="1">
                                    <h4 class="labelFont font_inner">全 体</h4>
                                </el-radio>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-radio v-model="radio" label="2">
                                    <h4 class="labelFont font_inner">用 户</h4>
                                    <el-input v-model="selectedUserId" placeholder="请选择用户" class="" disabled size="small" style="vertical-align: middle;"></el-input>
                                    <el-button type="primary" size="small" @click="showTabel" >查询</el-button>
                                </el-radio>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-radio v-model="radio" label="3">
                                    <h4 class="labelFont font_inner">公 司</h4>
                                    <el-select style="width:178px;" size="small" clearable v-model="currentCpmpany" placeholder="请选公司名称" class="currentSelect">
                                        <el-option
                                            v-for="item in allCompanies"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-radio>
                            </el-col>
                        </el-row>
                    </div>
                </el-row>
                <el-row>
                    <el-row :span="3" style="float:left;">
                        <h4 class="labelFont" style="width:auto;">选择发送时间:</h4>
                    </el-row>
                    <div class="" style="float: left;">
                        <el-row>
                            <el-col :span="6">
                                <el-radio v-model="selectSendTime" label="1">
                                    <h4 class="labelFont font_inner">立即发出</h4>
                                </el-radio>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6" style="height:26px;">
                                <el-radio v-model="selectSendTime" label="2">
                                    <h4 class="labelFont font_inner">指定时间发送</h4>
                                    <div class="block" style="display: inline-block;">
                                        <div class="block">
                                            <el-date-picker
                                                v-model="value10"
                                                type="datetime"
                                                placeholder="选择日期时间">
                                            </el-date-picker>
                                        </div>
                                    </div>
                                </el-radio>
                                <!--<p style="font-size:12px;line-height:30px;color:red;" v-show="successorfail">{{failMessag}}</p>-->
                            </el-col>
                        </el-row>
                    </div>
                </el-row>
                <el-row style="height:auto;">
                    <el-row :span="3" style="float:left;">
                        <h4 class="labelFont" style="width:auto;">输入发送内容:</h4>
                    </el-row>
                    <el-row>
                        <el-col :span="9" style="height:90px;">
                            <el-input
                                type="textarea"
                                :autosize="{ minRows: 4, maxRows: 4}"
                                placeholder="请输入内容"
                                v-model="description">
                            </el-input>
                        </el-col>
                    </el-row>
                </el-row>
                <el-row>
                    <el-row :span="6" style="float: left;text-indent: 50px;margin-top:20px;">
                        <el-button style="margin-left:100px;" type="primary" @click="submitForm">提交</el-button>
                        <el-button style="margin-left:70px;" @click="giveupSubmit">取消</el-button>
                    </el-row>
                </el-row>
            </el-card>

        </div>
    </div>
</template>

<script>
    import Sortable from 'sortablejs'
    import axios from 'axios';
    import { GETALLCOMPANIES,GETAUDITEDHES,SENDSYSTEMMSG } from '../../constants/Constants'
    axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
    // axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('userName')
    axios.defaults.headers['X-OperatorToken'] = '9cee02c6a9f848eeba3119b8a828c66d'
    //
    export default {
        name: "",
        data() {
            return {
                currentRow: null,
                value10:'',
                pageSize:5,
                currentPage:1,
                totalNumber:0,
                radio:'1',
                allCompanies:[],
                searchCompany:'',
                currentCpmpany:'',
                selectSendTime:'1',
                createTime:new Date(),
                value3: new Date(),
                description:'',
                userList:[],
                receiverId:'',
                selectedUserId:'',
                dialogTableVisible: false,
                dialogFormVisible: false,
                searchname:'',
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                formLabelWidth: '120px',
                scheduleTime:'',
                messageType:'',
                sendType:'',
                getHour:'',
                failMessag:'用户名或密码有误，请重新输入！',
                successorfail:true,
                id:''
            }
        },
        components: {

        },
        mounted(){
            this.getData()
        },
        created() {
            this.getCompaniesSelect();
        },
        methods: {
            getCompaniesSelect(){
                let self = this;
                self.url = GETALLCOMPANIES;
                self.$axios.get(self.url).then((response) => {
                    console.log(response)
                    this.allCompanies=response.data
                }).catch((error) => {
                    console.log(error)
                })
            },
            getData(){
                let self = this;
                var option = '?page=' + (self.currentPage - 1) + '&size=' + self.pageSize
                self.url = GETAUDITEDHES;
                self.$axios.get(self.url+option).then((response) => {
                    console.log(response)
                    self.totalNumber=parseInt(response.data.totalElements)
                    self.userList = response.data.content
                })
            },
            showTabel(){
                this.selectedUserId=''
                this.dialogTableVisible = true
            },
            searchUser(){
                let self = this;
                var option = '?page=' + (self.currentPage - 1) + '&size=' + self.pageSize+'&username='+this.searchname
                self.url = GETAUDITEDHES;
                self.$axios.get(self.url+option).then((response) => {
                    console.log(response)
                    self.totalNumber=parseInt(response.data.totalElements)
                    self.userList = response.data.content
                })
            },
            handleSelectionChange(val) {
                this.currentRow = val;
                console.log(val)
                console.log(val.id)
                if(val.id!=''){
                    this.selectedUserId=val.id
                }else{
                    self.$message.error('请重新选择')
                }
            },
            handleCurrentChange(val){
                this.currentPage=val
                this.getData()
            },
            submitForm(){
                let self = this;
                console.log('this is sendMsageContent')
                console.log(this.value10)
                console.log(this.radio)
                console.log(this.createTime)
                console.log(this.messageType)
                console.log(this.receiverId)
                console.log(this.scheduleTime)
                console.log(this.sendType)

                if(this.radio==1){
                    this.receiverId=0
                    this.messageType='ALL'
                }else if(this.radio==2){
                    this.receiverId=this.selectedUserId
                    this.messageType='USER'
                }else if(this.radio==3){
                    this.receiverId=this.currentCpmpany
                    this.messageType='COMPANY'
                }

                if(this.selectSendTime==1){
                    this.scheduleTime=this.createTime
                    this.sendType='SEND_NOW'
                }else if(this.selectSendTime==2){
                    this.scheduleTime=this.value10
                    this.sendType='SEND_SCHEDULE'
                }
                console.log(this.messageType)
                console.log(this.receiverId)
                console.log('打印指定发送时间')
                console.log(this.scheduleTime)
                console.log(this.messageType)
                self.url = SENDSYSTEMMSG;
                let sendMsageContent={
                    content: this.description,
                    createTime: this.createTime,
                    messageType: this.messageType,
                    receiverId: this.receiverId,
                    scheduleTime: this.scheduleTime,
                    sendFlag: false,
                    sendType: this.sendType
                }
                if(this.description!='' || this.value10!=''){
                    self.$axios.post(self.url,sendMsageContent).then((response) => {
                        console.log(response)
                        if(response.data==''){
                            this.$message({
                                type: 'success',
                                message: '消息发送成功'
                            })
                            this.description=''
                            this.selectedUserId=''
                            this.value10=''
                            this.currentCpmpany=''
                        }
                    })
                }else{
                    self.$message.error('输入不可为空，请检查并重新输入')
                }

            },
            giveupSubmit(){
                this.$message({
                    showClose: true,
                    message: '取消发送',
                    type: 'warning'
                });
                this.description=''
                this.selectedUserId=''
                this.value10=''
                this.currentCpmpany=''
            }
        },
        filters: {

        },
    }
</script>

<style scoped>
    .labelFont{
        width:auto;
        margin-right:10px;
        font-weight: 100;
    }
    .el-dialog__body{
        padding-top: 0!important;
    }
    .font_inner{
        font-weight: 100;
    }
    .el-textarea__inner{
        height: 90px;
    }
    .smallinput {
        width: calc(100% - 80px);
    }

    .smallinput1 {
        width: calc(100% - 106px);
    }

    .h-button {
        margin-bottom: 15px;
    }

    .block {
        margin-bottom: 25px;
    }

    .headImg {
        width: 90px;
        height: 90px;
        border-radius: 45px;
        vertical-align: bottom;
    }

    .info {
        margin-left: 18px;
        display: inline-block;
        vertical-align: middle;
    }

    .mainInfo svg, .mainInfo span {
        vertical-align: middle;
    }

    .mainInfo span {
        margin: 0 15px 0 5px;
        font-size: 14px;
        color: #444;
    }

    .icon {
        width: 18px;
        fill: currentColor;
        overflow: hidden;
        vertical-align: bottom;
    }

    .tag {
        margin-top: 4px;
    }

    h4 {
        /*width: 5em;*/
        text-align-last: justify;
        color: #606266;
        display: inline-block;
        font-size:14px;
    }

    .box-card {
        margin-top: 15px;
        border-bottom: none;
        border-color: #dfe6ec;
        border-radius: unset;
        box-shadow: unset;
    }

    h5 + span {
        font-size: 14px;
    }

    .name {
        color: #444;
        display: inline-block;
        font-weight: bolder;
        font-size: 20px;
        line-height: 20px;
        vertical-align: middle;
    }

    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }
</style>

<style>
    /*.postInfo-container .el-row {*/
        /*margin-bottom: 10px;*/
    /*}*/
    .el-row{
        margin-bottom: 15px;
        padding-left:15px;
    }
    .detailInfo {
        border: 1px solid #dfe6ec;
    }
    .el-card {
         margin-top: 50px;
     }
    .el-card__body {
        padding: 20px;
        padding-top: 40px!important;
    }
    .detailInfo .el-collapse-item__arrow {
        float: left;
        font-size: 14px;
        font-weight: bold;
        line-height: 14px;
        margin-top: 17px;
    }

    .detailInfo .el-collapse-item__header {
        color: #333;
        font-weight: bold;
    }

    .detailInfo .el-collapse-item__wrap {
        background-color: #fbfdff;
    }

    .detailInfo .el-collapse-item__header {
        padding: 0 15px;
        border-bottom: 1px solid #dfe6ec;
    }

    .detailInfo .el-collapse-item__content {
        padding: 10px 15px;
    }
</style>
