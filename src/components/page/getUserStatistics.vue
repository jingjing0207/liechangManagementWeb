<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 报表</el-breadcrumb-item>
                <el-breadcrumb-item>注册统计报表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-collapse class="handle-box">
            <div class="search">
                <div class="handle-title">
                        <el-date-picker
                            v-model="value10"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="timestamp">
                        </el-date-picker>
                        <el-date-picker
                            v-model="value9"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="timestamp">
                        </el-date-picker>
                </div>
                <el-button type="primary" size="medium" icon="el-icon-search" @click="search">查询</el-button>
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
                <th>{{companyCount.label}}</th>
                <th>{{hrCount.label}}</th>
                <th>{{hhCount.label}}</th>
                <th>{{pmCount.label}}</th>
            </tr>
            <tr class="tr-con" v-show="isData">
                <td>{{tableData.companyCount}}</td>
                <td>{{tableData.hrCount}}</td>
                <td>{{tableData.hhCount}}</td>
                <td>{{tableData.pmCount}}</td>
            </tr>
            <tr class="tr-con" v-show="noData" style="height: 60px;">
                <td colspan="4" style="color:#909399;">暂无数据</td>
            </tr>
        </table>
        <!--<div class="pagination">-->
            <!--<el-pagination-->
                <!--@size-change="sizeChange"-->
                <!--@current-change="handleCurrentChange"-->
                <!--layout="total, sizes, prev, pager, next, jumper"-->
                <!--:current-page.sync="pageNo"-->
                <!--:page-sizes="[5,10,15,20,25,30]"-->
                <!--:page-size="pagesize"-->
                <!--:total="totalElements">-->
            <!--</el-pagination>-->
        <!--</div>-->
    </div>
</template>

<script>
    import Sortable from 'sortablejs'
    import { GETUSERSTATISTICS } from '../../constants/Constants'
    import axios from 'axios';
    axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
    axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('resultMessage')

    export default {
        name: '',
        data() {
            return {
                isData:false,
                noData:true,
                companyCount:{
                    title:'companyCount',
                    label:'注册企业数量'
                },
                hrCount:{
                    title:'hrCount',
                    label:'注册猎头数量'
                },
                hhCount:{
                    title:'hhCount',
                    label:'注册HR数量'
                },
                pmCount:{
                    title:'pmCount',
                    label:'注册销售员数量'
                },
                value9:'',
                value4:'',
                value10:'',
                totalElements: 0,
                pageNo: 1,
                pagesize: 10,
                size: 10,
                search_title: '',
                sortBy: [],
                sortGroup: [
                    {value: '0', name: 'createTime', display: '创建时间'},
                    {value: '0', name: 'title', display: '标题'},
                    {value: '0', name: 'creatorCompanyName', display: '所属公司'},
                    {value: '0', name: 'creatorUserName', display: '发布人'},
                    {value: '0', name: 'education', display: '学历'},
                    {value: '0', name: 'level', display: '级别'},
                    {value: '0', name: 'position', display: '职位'},
                    {value: '0', name: 'price', display: '职位奖励'},
                    {value: '0', name: 'recruitingNumber', display: '招聘人数'}
                ],
                sortOptions: [{value: '0', label: '默认'},
                    {value: 'asc', label: '升序'},
                    {value: 'desc', label: '降序'}],
                tableData:'',
                searchMonth:'',
                allCompanies:[],
                searchCompany:'',
                currentCpmpany:''
            }
        },
        created() {
            this.setSort();
        },
        computed: {
            data() {
                if(tableData==''){
                    return "暂无数据"
                }
            }
        },
        filters: {
            priceFormat(val) {
                return (val) + '人';
            }
        },
        methods: {
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
                this.isData=true
                this.noData=false
                this.getData();
            },
            sizeChange(val) {
                this.size = val
                this.search()
            },
            handleCurrentChange(val) {
                this.getData();
            },
            getData() {
                let self = this;
                console.log(this.searchMonth)
                var option = '?startTime='+this.value10+'&endTime='+this.value9
                var sortStr = ''
                if (self.sortBy.length != 0) {
                    for (var s in self.sortBy) {
                        sortStr = sortStr + '&sort=' + self.sortBy[s]
                    }
                }
                if (self.search_title.length != 0) {
                    option = option + '&title=' + self.search_title
                }
                if (sortStr.length != 0) {
                    option = option + sortStr
                }
                self.$axios.get(GETUSERSTATISTICS + option)
                    .then(res => {
                        console.log(res)
                        self.pagesize = parseInt(self.size)
                        self.totalElements = parseInt(res.data.length)
                        self.tableData = res.data
                        console.log(self.tableData)
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
            }
        }
    }
</script>
<style scoped>
    .crumbs {
        /*margin-bottom: 50px!important;*/
    }
    .el-table thead {
        color: #333!important;
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
        padding:16px 10px!important;
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
    .selectTime{
        margin-top:10px;
    }
    .sortable-ghost {
        opacity: .7;
    }

    .cell {
        text-align: center !important;
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
        /*width: 370px;*/
        display: inline-block;
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
