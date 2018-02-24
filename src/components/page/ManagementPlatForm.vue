<template>
    <div class="table">
        <el-dialog title="新增用户" :visible.sync="dialogFormVisible">
            <el-form :model="form"style="font-size:17px;color:black;">
                <el-form-item label="headPic:" :label-width="formLabelWidth">
                    <el-input v-model="newHeadpic" auto-complete="off"style="width:80%;"></el-input>
                </el-form-item>
                <el-form-item label="password:" :label-width="formLabelWidth">
                    <el-input v-model="newPassword" auto-complete="off"style="width:80%;"></el-input>
                </el-form-item>
                <el-form-item label="role:" :label-width="formLabelWidth">
                    <el-input v-model="newRole" auto-complete="off"style="width:80%;"></el-input>
                </el-form-item>
                <el-form-item label="username:" :label-width="formLabelWidth">
                    <el-input v-model="newUsername" auto-complete="off"style="width:80%;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="createOperation()">确 定</el-button>
            </div>
        </el-dialog>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>管理平台注册</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="plugins-tips">
            <el-button type="info" plain class="addInnfo" @click="addUserManagement">+ 新增</el-button>
            <div class="handle-box">
                <el-input v-model="searchId" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="requestFlowData()">搜索</el-button>
            </div>
        </div>
        <div class="content-table-list">
            <table class="table table-bordered"cellpadding="0" cellspacing="0" >
                <tr class="tr-header">
                    <th>id</th>
                    <th>createTime</th>
                    <th>headPic</th>
                    <th>lastLoginTime</th>
                    <th>role</th>
                    <th>state</th>
                    <th>username</th>
                    <th>operation</th>
                </tr>
                <tr class="tr-con"  v-for="(pro,idx) in information.data">
                    <td>{{pro.id}}</td>
                    <td>{{new Date(pro.createTime).toLocaleString()}}</td>
                    <td>{{pro.headPic}}</td>
                    <td>{{new Date(pro.lastLoginTime).toLocaleString()}}</td>
                    <td>{{pro.role}}</td>
                    <td>{{pro.state}}</td>
                    <td>{{pro.username}}</td>
                    <td class="last-td">
                        <el-button type="info" @click="modifyManageplatform(pro.id)">修改</el-button>
                        <el-button type="danger" @click="deleteManage(pro.id)">删除</el-button>
                    </td>
                </tr>
                <tr class="tr-con">
                    <td colspan="8" align="center" class="lastTd">
                        <div class="block">
                            <el-pagination
                                @current-change="handleCurrentChange"
                                :current-page.sync="currentPage"
                                :page-size="pageSize"
                                layout="total, prev, pager, next"
                                :total="totalNumber">
                            </el-pagination>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { MANAGEMENTPLATFORM , DELETEMANAGE,MODIFYMANAGE,CREATEMANAGE } from '../../constants/Constants'
    axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
    axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('resultMessage')
    export default {
        data: function(){
            const self = this;
            return {
                information: {
                    pagination:{},
                    data:[]
                },
                query:'',
                idx:'',
                pro:'',
                deleteId:'',
                searchId:'',
                modifyPassword:'',
                oldPassword:true,
                showmodifyPassword:false,
                newPass:'',
                newHeadpic:'',
                newPassword:'',
                newRole:'',
                newUsername:'',
                dialogFormVisible: false,
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
                totalNumber:0,
                currentPage:1,
                pageSize:0,
                formLabelWidth: '120px',
            }
        },
        components: {

        },
        mounted (){
        },
        created(){
            this.init()
        },
        methods: {
            init() {
                this.currentPage = 1;
                this.pageSize = 8;
                this.requestFlowData();
            },
            requestFlowData() {
                let self = this
                axios.get(MANAGEMENTPLATFORM+'?page='+parseInt(self.currentPage-1)+'&size='+self.pageSize)
                    .then((response) => {
                        console.log(response)
                        this.information.pagination = response.data
                        this.totalNumber=parseInt(response.data.totalElements)
                        console.log(this.totalNumber)
                        this.information.data = response.data.content
                        console.log(response.data.content)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            },
            handleCurrentChange(val) {
                this.init()
                this.currentPage=val
                this.requestFlowData()
            },
            modifypasswordMoudal() {
                this.$prompt('请输入新密码', '密码修改', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                    this.$message({
                        type: 'success',
                        message: '密码修改成功'
                    })
                    let prams={
                        id:this.deleteId,
                        password:value
                    }
                    axios.post(MODIFYMANAGE,prams)
                        .then((response) => {
                            console.log('我要修改密码')
                            console.log(response)
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消修改'
                    });
                });
            },
            addUserManagement(){
                this.dialogFormVisible=true
            },
            createOperation(){
                this.dialogFormVisible=false
                let createOperationPrams={
                    headPic:this.newHeadpic,
                    password:this.newPassword,
                    role:this.newRole,
                    username:this.newUsername
                }
                axios.post(CREATEMANAGE,createOperationPrams)
                    .then((response) => {
                        this.requestFlowData()
                        this.$message({
                            type: 'success',
                            message: '成功新增',
                            showInput:false
                        }).then(({ value }) => {

                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '取消'
                            })
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            },
            modifyManageplatform(id){
                console.log(id)
                this.deleteId=id
                this.modifypasswordMoudal()
            },
            username() {
                let resultMessage = sessionStorage.getItem('username')
                if (resultMessage !== '' && resultMessage !== undefined) {
                    this.requestFlowData()
                } else {
                    this.$router.push({path: '/login'})
                }
            },
            deleteManage(id){
                this.deleteId=id
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    axios.delete(DELETEMANAGE + this.deleteId, this.headers)
                        .then((response) => {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            })
                            console.log('删除')
                            console.log(id)
                            console.log(response)
                            this.username()
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style scoped>
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
        padding:10px!important;
    }
    .tr-con:first-child{
        border-top:none!important;
    }
    .tr-con td{
        border-top: 1px solid #eee;
        font-size: 12px;
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
    /*::-webkit-scrollbar{*/
         /*display: none;*/
    /*}*/
</style>
