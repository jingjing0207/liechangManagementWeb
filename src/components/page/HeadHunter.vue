<template>
    <div class="table">
        <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="输入新密码" :label-width="formLabelWidth">
                    <el-input type="password" v-model="form.password" auto-complete="off" style="width:70%;"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" :label-width="formLabelWidth">
                    <el-input type="password" v-model="form.newPass" auto-complete="off" style="width:70%;"></el-input>
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
                <el-breadcrumb-item>猎头注册</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-collapse class="handle-box">
            <div class="search">
                <el-input clearable v-model="searchName" size="medium" placeholder="搜索用户名" class="handle-title"></el-input>
                <el-button type="primary" size="medium"  icon="el-icon-search" @click="search">查询</el-button>
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
        <table class="table table-bordered"cellpadding="0" cellspacing="0" >
            <tr class="tr-header">
                <th>{{username.label}}</th>
                <th>{{createTime.label}}</th>
                <th>{{lastLoginTime.label}}</th>
                <th>{{type.label}}</th>
                <th>{{state.label}}</th>
                <th>{{operation.label}}</th>
            </tr>
            <tr class="tr-con"  v-for="(pro,idx) in hr_list">
                <td>{{pro.username}}</td>
                <td>{{new Date(pro.createTime).toLocaleString()}}</td>
                <td>{{new Date(pro.lastLoginTime).toLocaleString()}}</td>
                <td>{{pro.type=="HEADHUNTER"?"猎头":"其他"}}</td>
                <td class="currentState">{{pro.state | stateFormat}}</td>
                <td class="last-td">
                    <el-button v-if="pro.state != 'Disabled'" type="primary" @click="modifyManageplatform(pro.id)">修改</el-button>
                    <el-button v-if="pro.state != 'Disabled'" type="info" @click="deleteHR(pro.id)">删除</el-button>

                    <el-button v-if="pro.state == 'Disabled'" disabled="disabled"  type="primary" @click="modifyManageplatform(pro.id)">修改</el-button>
                    <el-button v-if="pro.state == 'Disabled'" disabled="disabled" type="info" @click="deleteManage(pro.id)">删除</el-button>
                </td>
            </tr>

        </table>
        <div colspan="7" class="lastTd" style="text-align: right;margin:20px 0;">
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
    </div>
</template>

<script>
    import Sortable from 'sortablejs'
    import axios from 'axios';
    import { GETAUDITEDHES,DELETEHR,MODIEFYHRPASSWORD } from '../../constants/Constants'
    axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
    axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('resultMessage')
    export default {
        filters: {
            stateFormat(val) {
                let v = (val + '').toString().toLowerCase();
                if (v ==='using') {
                    return '启用'
                } else if (v ==='auditing') {
                    return '审核'
                } else {
                    return '禁用'
                }
            }
        },
        data() {
            return {
                searchName:'',
                username:{
                    title:'username',
                    label:'用户名'
                },
                jobNumber:{
                    title:'jobNumber',
                    label:'工号'
                },
                createTime:{
                    title:'createTime',
                    label:'创建时间'
                },
                lastLoginTime:{
                    title:'lastLoginTime',
                    label:'最后登录时间'
                },
                type:{
                    title:'type',
                    label:'类型'
                },
                state:{
                    title:'state',
                    label:'状态'
                },
                companyName:{
                    title:'companyName',
                    label:'公司名称'
                },
                operation:{
                    title:'operation',
                    label:'操作'
                },
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
                pagesize:10,
                checked:false,
                deleteId:'',
                modifyId:'',
                dialogFormVisible: false,
                form: {
                    password: '',
                    newPass:''
                },
                formLabelWidth: '120px',
                search_title: '',
                sortBy: [],
                sortGroup: [
                    {value: '0', name: 'username', display: '用户名'},
                    {value: '0', name: 'createTime', display: '创建时间'},
                    {value: '0', name: 'companyName', display: '公司名称'},
                    {value: '0', name: 'state', display: '状态'},
                    {value: '0', name: 'lastLoginTime', display: '最后登录时间'}
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
                this.pagesize=val;
                this.getData();
                this.search()
            },
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            setSort() {
                this.$nextTick(() => {
                    const el = document.querySelectorAll('.sortOption .el-collapse-item__content')[0];
                    this.sortable = Sortable.create(el, {
                        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
                        setData: dataTransfer => dataTransfer.setData('Text', '')
                    })
                })
            },
            search() {
                const self = this;
                let list = document.querySelectorAll('.sortOption .el-input__inner');
                let el = this.$refs.sel;
                let map = {};
                self.sortBy = [];
                el.forEach(obj => {
                    return map[obj.$options.propsData.name] = obj.$options.propsData.value
                });
                Array.prototype.map.call(list, obj => {
                    if (map[obj.name] != '0') {
                        self.sortBy.push(obj.name + ',' + map[obj.name])
                    }
                });
                this.cur_page = 1;
                let option;
                if(this.searchName!=''){
                    option = '?page='+parseInt(self.cur_page-1)+'&size='+this.pagesize+'&type=HEADHUNTER&username='+this.searchName
                }else{
                    option = '?page='+parseInt(self.cur_page-1)+'&size='+this.pagesize+'&type=HEADHUNTER'
                }
                self.$axios.get(GETAUDITEDHES+option).then((response) => {
                    console.log(response)
                    this.totalNumber=parseInt(response.data.totalElements);
                    this.hr_list=response.data.content;
                    console.log(this.hr_list)
                });
                this.getData();
            },
            getData(){
                let self = this;
                let option = '?page='+parseInt(self.cur_page-1)+'&size='+this.pagesize+'&type=HEADHUNTER';
                let sortStr = '';
                if (self.sortBy.length != 0) {
                    for (let s in self.sortBy) {
                        sortStr = sortStr + '&sort=' + self.sortBy[s]
                    }
                }
                if (sortStr.length != 0) {
                    option = option + sortStr
                }
                self.url = GETAUDITEDHES;
                self.$axios.get(self.url+option).then((response) => {
                    console.log(response);
                    this.totalNumber=parseInt(response.data.totalElements);
                    this.hr_list=response.data.content;
                    console.log(this.hr_list)
                })
            },
            deleteHR(id){
                this.deleteId=id;
                let self = this;
                self.url = DELETEHR;
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    self.$axios.delete(self.url+this.deleteId).then((response) => {
                        console.log(response);
                        if(response.data == ''){
                            this.getData();
                            self.$message.error('删除成功！')
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            modifyManageplatform(id){
                this.modifyId=id;
                this.form.newPass='';
                this.form.password='';
                this.dialogFormVisible=true
            },
            modifyPassword(){
                let self = this;
                if((self.form.password!='' && self.form.newPass!='') && (self.form.newPass == self.form.password)){
                    let newModify = {
                        id: self.modifyId,
                        password: self.form.newPass
                    }
                    self.url = MODIEFYHRPASSWORD;
                    self.$axios.post(self.url, newModify).then((response) => {
                        console.log(response);
                        this.dialogFormVisible = false;
                        this.$message({
                            type: 'success',
                            message: '密码修改成功'
                        })
                    })
                } else {
                    if(self.form.password=='' || self.form.newPass==''){
                        self.$message.error('密码输入为空，无效！')
                    }else if (self.form.newPass != self.form.password){
                        self.$message.error('两次密码不一致，请重新输入！')
                    }
                }
            }

        }
    }
</script>

<style scoped>
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
        padding:12px 10px!important;
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
