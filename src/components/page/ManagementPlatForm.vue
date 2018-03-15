<template>
    <div class="table">
        <el-dialog title="新增用户" :visible.sync="dialogFormVisible">
            <el-form :model="form"style="font-size:17px;color:black;">
                <el-form-item label="头 像" :label-width="formLabelWidth">
                    <el-input v-model="newHeadpic" auto-complete="off"style="width:80%;"></el-input>
                </el-form-item>
                <el-form-item label="密 码" :label-width="formLabelWidth">
                    <el-input v-model="newPassword" auto-complete="off"style="width:80%;"></el-input>
                </el-form-item>
                <el-form-item label="角 色" :label-width="formLabelWidth">
                    <el-input v-model="newRole" auto-complete="off"style="width:80%;"></el-input>
                </el-form-item>
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="newUsername" auto-complete="off"style="width:80%;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="createOperation()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改密码" :visible.sync="dialogFormVisiblePassword">
            <el-form :model="form">
                <el-form-item label="输入新密码" :label-width="formLabelWidth">
                    <el-input type="password"  v-model="form1.password" auto-complete="off" style="width:70%;"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" :label-width="formLabelWidth">
                    <el-input type="password"  v-model="form1.newPass" auto-complete="off" style="width:70%;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisiblePassword = false">取 消</el-button>
                <el-button type="primary" @click="modifypasswordMoudal()">确 定</el-button>
            </div>
        </el-dialog>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>管理平台注册</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-collapse class="handle-box">
            <div class="search">
                <div style="display: inline-block;">
                    <el-button type="info" plain class="addInnfo" @click="addUserManagement" style="float: left;margin-right:10px;">+ 新增</el-button>
                    <el-input clearable v-model="searchName" size="medium" placeholder="搜索用户名" class="handle-title"></el-input>
                    <el-button type="primary" size="medium" icon="el-icon-search" @click="search">查询</el-button>
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
        <div class="content-table-list">
            <table class="table table-bordered"cellpadding="0" cellspacing="0" >
                <tr class="tr-header">
                    <th>{{name.label}}</th>
                    <th>{{createTime.label}}</th>
                    <th>{{lastLoginTime.label}}</th>
                    <th>{{role.label}}</th>
                    <th>{{state.label}}</th>
                    <th>{{operation.label}}</th>
                </tr>
                <tr class="tr-con"  v-for="(pro,idx) in information.data">
                    <td>{{pro.username}}</td>
                    <td>{{new Date(pro.createTime).toLocaleString()}}</td>
                    <td>{{pro.lastLoginTime==null?"":new Date(pro.lastLoginTime).toLocaleString()}}</td>
                    <td>{{pro.role}}</td>
                    <td>{{pro.state=="ENABLED"?"启用":"禁用"}}</td>
                    <td class="last-td">
                        <el-button v-if="pro.state != 'DISABLED' && pro.username!='admin'"  type="primary" @click="modifyManageplatform(pro.id)">修改</el-button>
                        <el-button v-if="pro.state != 'DISABLED' && pro.username!='admin'"  type="info" @click="deleteManage(pro.id)">删除</el-button>

                        <el-button v-if="pro.state == 'DISABLED' || pro.username=='admin'" disabled="disabled"  type="primary" @click="modifyManageplatform(pro.id)">修改</el-button>
                        <el-button v-if="pro.state == 'DISABLED' || pro.username=='admin'" disabled="disabled" type="info" @click="deleteManage(pro.id)">删除</el-button>
                    </td>
                </tr>
            </table>
            <div colspan="8" class="lastTd" style="text-align: right;margin:20px 0;">
                <div class="block">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[5,10,15,20,25,30]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalNumber">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Sortable from 'sortablejs'
    import axios from 'axios';
    import { MANAGEMENTPLATFORM , DELETEMANAGE,MODIFYMANAGE,CREATEMANAGE } from '../../constants/Constants'
    axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
    axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('resultMessage')
    export default {
        data: function(){
            const self = this;
            return {
                searchName:'',
                name:{
                    title:"name",
                    label:"用户名"
                },
                createTime:{
                    title:"createTime",
                    label:"创建时间"
                },
                lastLoginTime:{
                    title:"lastLoginTime",
                    label:"最后登录时间"
                },
                role:{
                    title:"role",
                    label:"角色"
                },
                state:{
                    title:"state",
                    label:"状态"
                },
                operation:{
                    title:"operation",
                    label:"操作"
                },
                information: {
                    pagination:{},
                    data:[]
                },
                query:'',
                idx:1,
                pro:1,
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
                dialogFormVisiblePassword:false,
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
                pageSize:10,
                formLabelWidth: '120px',
                form1:{
                    newPass:'',
                    password:''
                },

                search_title: '',
                sortBy: [],
                sortGroup: [
                    {value: '0', name: 'username', display: '用户名'},
                    {value: '0', name: 'createTime', display: '创建时间'},
                    {value: '0', name: 'lastLoginTime', display: '最后登录时间'},
                    {value: '0', name: 'state', display: '状态'}
                ],
                sortOptions: [{value: '0', label: '默认'},
                    {value: 'asc', label: '升序'},
                    {value: 'desc', label: '降序'}],
            }
        },
        components: {

        },
        mounted (){
            this.requestFlowData()
            this.setSort()
        },
        methods: {
            setSort() {
                this.$nextTick(() => {
                    const el = document.querySelectorAll('.sortOption .el-collapse-item__content')[0]
                    this.sortable = Sortable.create(el, {
                        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
                        setData: dataTransfer => dataTransfer.setData('Text', '')
                    })
                })
            },
            requestFlowData(){
                let self = this;
                var option = '?page='+parseInt(self.currentPage-1)+'&size='+self.pageSize
                var sortStr = ''
                if (self.sortBy.length != 0) {
                    for (var s in self.sortBy) {
                        sortStr = sortStr + '&sort=' + self.sortBy[s]
                    }
                }
                if (sortStr.length != 0) {
                    option = option + sortStr
                }
                self.url = MANAGEMENTPLATFORM;
                self.$axios.get(self.url+option).then((response) => {
                    console.log(response)
                    self.information.pagination = response.data
                    self.totalNumber=parseInt(response.data.totalElements)
                    console.log(this.totalNumber)
                    self.information.data = response.data.content
                    console.log(response.data.content)
                }).catch((error) => {
                        console.log(error)
                    })
            },
            handleSizeChange(val){
                this.pageSize=val
                this.requestFlowData();
                this.search()
            },
            handleCurrentChange(val) {
                this.currentPage=val
                this.requestFlowData()
            },
            search() {
                const self = this
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
                this.requestFlowData()
                self.currentPage = 1;
                self.url = MANAGEMENTPLATFORM;
                self.$axios.get(self.url+'?page='+parseInt(self.currentPage-1)+'&size='+self.pageSize+'&username='+self.searchName).then((response) => {
                    console.log(response)
                    self.information.pagination = response.data
                    self.totalNumber=parseInt(response.data.totalElements)
                    console.log(this.totalNumber)
                    self.information.data = response.data.content
                    console.log(response.data.content)
                }).catch((error) => {
                    console.log(error)
                })
            },
            modifyManageplatform(id){
                console.log(id)
                this.deleteId=id
                this.form1.newPass=''
                this.form1.password=''
                this.dialogFormVisiblePassword=true
            },
            modifypasswordMoudal() {
                let self = this
                if((self.form.password!='' && self.form.newPass!='') && (self.form.newPass == self.form.password)){
                    let prams={
                        id:this.deleteId,
                        password:this.form1.newPass
                    }
                    self.url = MODIFYMANAGE;
                    self.$axios.post(self.url,prams).then((response) => {
                        console.log('我要修改密码')
                        console.log(response)
                        this.dialogFormVisiblePassword=false
                        this.$message({
                            type: 'success',
                            message: '密码修改成功'
                        })
                    })
                        .catch((error) => {
                            console.log(error)
                        })
                }else{
                    if(self.form.password=='' || self.form.newPass==''){
                        self.$message.error('密码输入为空，无效！')
                    }else if (self.form.newPass != self.form.password){
                        self.$message.error('两次密码不一致，请重新输入！')
                    }
                }
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
    .el-button{
        padding:10px 16px!important;
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
    .search-box{
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
        border:1px solid #eee;
        cursor: default;
    }
    table tr:hover{
        cursor: pointer;
        background:#f5f7f596;
    }
    .tr-header{
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
        padding:10px!important;
    }
    .tr-con:first-child{
        border-top:none!important;
    }
    .tr-con td{
        border-top: 1px solid #eee;
        border-right: 1px solid #ebeef5;
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
