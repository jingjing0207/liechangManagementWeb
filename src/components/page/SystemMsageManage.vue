<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 系统消息管理</el-breadcrumb-item>
                <el-breadcrumb-item>发送系统消息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-collapse class="handle-box">
            <div class="search">
                <!--<el-input v-model="searchUserId" placeholder="输入用户名" class="handle-title"></el-input>-->
                <el-button type="primary" size="medium"  icon="el-icon-search" @click="search()">查询</el-button>
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
        <el-table :data="sendListDetail" border fit id="jdlist" style="width: 100%;font-size: 13px;text-align: center"
                  row-class-name="jdlist-row">
            <el-table-column header-align="center" prop="messageType" label="消息类型" width="110px"></el-table-column>
            <el-table-column header-align="center" prop="receiver"  show-overflow-tooltip label="指定接收对象"></el-table-column>
            <el-table-column header-align="center" prop="sendType" label="发送类型"  show-overflow-tooltip width="130px"></el-table-column>
            <el-table-column header-align="center" prop="createTime" label="创建时间" :formatter="dateTimeFormat"></el-table-column>
            <el-table-column header-align="center" prop="scheduleTime" label="指定发送时间" :formatter="setTimeFormat"></el-table-column>
            <el-table-column header-align="center" prop="content"  show-overflow-tooltip label="消息内容"></el-table-column>
        </el-table>
        <div class="pagination">
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
</template>

<script type="text/ecmascript-6">
    import Sortable from 'sortablejs'
    import axios from 'axios';
    import { GETSENDLIST } from '../../constants/Constants'
    axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
    axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('resultMessage')

    export default {
        name: "",
        data() {
            return {
                pageSize:10,
                currentPage:1,
                totalNumber:0,
                sendListDetail:[],
                pagination:{},
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                is_search: false,
                checked:false,
                deleteId:'',
                modifyId:'',
                currentCpmpany:'',
                searchUserId:'',
                search_title: '',
                sortBy: [],
                sortGroup: [
                    {value: '0', name: 'messageType', display: '消息类型'},
                    {value: '0', name: 'receiver', display: '指定接受对象'},
                    {value: '0', name: 'sendType', display: '发送类型'},
                    {value: '0', name: 'createTime', display: '创建时间'},
                    {value: '0', name: 'scheduleTime', display: '指定发送时间'}
                ],
                sortOptions: [{value: '0', label: '默认'},
                    {value: 'asc', label: '升序'},
                    {value: 'desc', label: '降序'}],
                tableData: [],

                searchName:'',
                crrentCompanyBy:[],
            }
        },
        components: {

        },
        mounted(){

        },
        created() {
            this.getData()
        },
        methods: {
            getData(){
                let self = this;
                let option = '?page='+parseInt(self.currentPage-1)+'&size='+this.pageSize
                let sortStr = ''
                if (self.sortBy.length != 0) {
                    for (var s in self.sortBy) {
                        sortStr = sortStr + '&sor' +
                            't=' + self.sortBy[s]
                    }
                }
                if (sortStr.length != 0) {
                    option = option + sortStr
                }
                self.url = GETSENDLIST;
                self.$axios.get(self.url+option).then((response) => {
                    console.log(response)
                    console.log(response.data.totalElements)
                    this.totalNumber=parseInt(response.data.totalElements)
                    this.sendListDetail=response.data.content
                })
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
            search() {
                const self = this
                let list = document.querySelectorAll('.sortOption .el-input__inner')
                let el = this.$refs.sel
                let map = {}
                self.sortBy = []
                el.forEach(obj => {
                    return map[obj.$options.propsData.name] = obj.$options.propsData.value
                })
                Array.prototype.map.call(list, obj => {
                    if (map[obj.name] != '0') {
                        self.sortBy.push(obj.name + ',' + map[obj.name])
                    }
                })
                this.currentPage = 1;
                this.getData();
            },
            handleCurrentChange(val){
                this.currentPage=val
                this.getData()
            },
            handleSizeChange(val){
                this.pageSize=parseInt(val)
                this.getData();

            },
            dateTimeFormat(row, column) {
                let time = new Date(+row.createTime);
                let rightTwo = (v) => {
                    v = '0' + v
                    return v.substring(v.length - 2, v.length)
                }
                if (time == null) return;
                return new Date(time).toLocaleString()
            },
            setTimeFormat(row, column) {
                let time = new Date(+row.scheduleTime);
                let rightTwo = (v) => {
                    v = '0' + v
                    return v.substring(v.length - 2, v.length)
                }
                if (time == null) return;
                return new Date(time).toLocaleString()
                // return new Date(time).getFullYear()+'/'+(new Date(time).getMonth()+1)+'/'+new Date(time).getDate()+' '+new Date(time).getHours()+':'+new Date(time).getMinutes()+':'+new Date(time).getSeconds()
            }
        },
        filters: {

        },
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
        border-radius:12px;
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
        color: #000;
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
        border-top: 1px solid #ebeef5;
        border-right: 1px solid #ebeef5;
        font-size: 13px;
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
        overflow: hidden;
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
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
