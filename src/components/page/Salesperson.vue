<template>
    <div class="table">
        <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="输入新密码" :label-width="formLabelWidth">
                    <el-input v-model="form.password" auto-complete="off" style="width:70%;"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" :label-width="formLabelWidth">
                    <el-input v-model="form.newPass" auto-complete="off" style="width:70%;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyPassword()">确 定</el-button>
            </div>
        </el-dialog>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>HR注册</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--<div class="handle-box">-->
        <!--<el-button type="primary" icon="delete" class="handle-del mr10">批量删除</el-button>-->
        <!--</div>-->
        <table class="table table-bordered"cellpadding="0" cellspacing="0" >
            <tr class="tr-header">
                <!--<th></th>-->
                <th>username</th>
                <th>createTime</th>
                <!--<th>headPic</th>-->
                <th>lastLoginTime</th>
                <th>type</th>
                <th>state</th>
                <th>companyName</th>
                <th>operation</th>
            </tr>
            <tr class="tr-con"  v-for="(pro,idx) in hr_list">
                <!--<td>{{pro.id}}</td>-->
                <!--<td>-->
                <!--&lt;!&ndash;<el-checkbox v-model="checked"></el-checkbox>&ndash;&gt;-->
                <!--<el-table-column type="selection"></el-table-column>-->
                <!--</td>-->
                <td>{{pro.username}}</td>
                <td>{{new Date(pro.createTime).toLocaleString()}}</td>
                <!--<td>{{pro.headPic}}</td>-->
                <td>{{new Date(pro.lastLoginTime).toLocaleString()}}</td>
                <td>{{pro.type}}</td>
                <td class="currentState">{{pro.state}}</td>
                <td>{{pro.companyName==null?"null":pro.companyName}}</td>
                <td class="last-td">
                    <el-button type="info" @click="modifyManageplatform(pro.id)">修改</el-button>

                    <el-button type="danger" @click="deleteHR(pro.id)">删除</el-button>
                </td>
            </tr>
            <tr class="tr-con pagination">
                <td colspan="7" align="center" class="lastTd">
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
    </div>
</template>

<script>
    import axios from 'axios';
    import { GETAUDITEDHES,DELETEHR,MODIEFYHRPASSWORD } from '../../constants/Constants'
    axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
    axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('resultMessage')
    export default {
        data() {
            return {
                pagination:{},
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                hr_list: [],
                idx:'',
                pro:'',
                is_search: false,
                totalNumber:0,
                pagesize:8,
                checked:false,
                deleteId:'',
                modifyId:'',
                dialogFormVisible: false,
                form: {
                    password: '',
                    newPass:''
                },
                formLabelWidth: '120px'
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
                self.url = GETAUDITEDHES;
                self.$axios.get(self.url+'?page='+parseInt(self.cur_page-1)+'&size='+this.pagesize+'&type=PLATFORM_MARKECTER').then((response) => {
                    console.log(response.data.totalElements)
                    this.totalNumber=parseInt(response.data.totalElements)
                    this.hr_list=response.data.content
                    console.log(this.hr_list)
                })
            },
            deleteHR(id){
                this.deleteId=id
                let self = this;
                self.url = DELETEHR;
                self.$axios.delete(self.url+this.deleteId).then((response) => {
                    console.log(response)
                    if(response.data==''){
                        this.getData()
                        self.$message.error('删除成功！')
                    }
                })
            },
            modifyManageplatform(id){
                this.modifyId=id
                this.form.newPass=''
                this.form.password=''
                this.dialogFormVisible=true
            },
            modifyPassword(){
                let self = this
                if(this.form.newPass==this.form.password){
                    let newModify={
                        id:this.modifyId,
                        password:this.form.newPass
                    }
                    self.url = MODIEFYHRPASSWORD;
                    self.$axios.post(self.url,newModify).then((response) => {
                        console.log(response)
                        this.dialogFormVisible=false
                        this.$message({
                            type: 'success',
                            message: '密码修改成功'
                        })
                    })
                }else{
                    self.$message.error('两次密码输入不相同,请重新输入！')
                }
            }
        }
    }
</script>

<style scoped>
    .crumbs {
        margin-bottom: 50px!important;
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
        padding:12px 10px!important;
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
