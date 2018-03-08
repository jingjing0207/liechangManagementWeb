<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 报表</el-breadcrumb-item>
                <el-breadcrumb-item>企业HR统计报表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-collapse class="handle-box">
            <div class="search">
                <div class="handle-title">
                        <el-select clearable v-model="currentCpmpany"
                            filterable
                            remote
                            reserve-keyword
                            placeholder="输入公司名称"
                            :remote-method="remoteMethod"
                            :loading="loading">
                            <el-option
                                v-for="item in options4"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name">
                            </el-option>
                        </el-select>
                        <el-date-picker
                            v-model="value10"
                            type="date"
                            placeholder="选择开始日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="timestamp">
                        </el-date-picker>
                        <el-date-picker
                            v-model="value9"
                            type="date"
                            placeholder="选择结束日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="timestamp">
                        </el-date-picker>
                </div>
                <el-button type="primary" size="medium" icon="el-icon-search" @click="search">查询</el-button>
            </div>
            <!--<el-collapse-item title="排序选项" class="sortOption">-->
                <!--<div class="sortItem" v-for="item of sortGroup">-->
                    <!--<span>{{ item.display }}</span>-->
                    <!--<el-select v-model="item.value" :name="item.name" ref="sel" size="small">-->
                        <!--<el-option v-for="option in sortOptions" :label="option.label" :value="option.value"-->
                                   <!--:key="option.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                <!--</div>-->
            <!--</el-collapse-item>-->
        </el-collapse>
        <el-table :data="tableData" border fit id="jdlist" style="width: 100%;font-size: 13px;text-align: center">
            <el-table-column header-align="center" prop="companyName" label="公司名称"></el-table-column>
            <el-table-column header-align="center" prop="hrCount" label="HR总数"></el-table-column>
            <el-table-column header-align="center" prop="auditingCount" label="审批中HR数量"></el-table-column>
            <el-table-column header-align="center" prop="enableCount" label="启用状态HR数量 "></el-table-column>
            <el-table-column header-align="center" prop="disableCount" label="停用状态HR数量 "></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                @size-change="sizeChange"
                @current-change="handleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper"
                :current-page.sync="pageNo"
                :page-sizes="[5,10,15,20,25,30]"
                :page-size="pagesize"
                :total="totalElements">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import Sortable from 'sortablejs'
    import { GETHRSTATISTICS,GETALLCOMPANIES } from '../../constants/Constants'
    import axios from 'axios';
    axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
    axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('resultMessage')

    export default {
        name: '',
        data() {
            return {
                options4: [],
                value7:[],
                list: [],
                loading: false,
                state2:'',
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
                tableData: [],
                searchMonth:'',
                allCompanies:[],
                searchCompany:'',
                currentCpmpany:[],
                companiesArr:[]
            }
        },
        created() {
            this.getCompaniesSelect()
            this.setSort();
        },
        computed: {
            data() {

            }
        },
        filters: {

        },
        mounted() {

        },
        updated(){
            this.list = this.companiesArr.map(item => {
                return { name: item };
            });
        },
        methods: {
            getCompaniesSelect(){
                let self = this;
                self.url = GETALLCOMPANIES;
                self.$axios.get(self.url).then((response) => {
                    this.allCompanies=response.data
                    console.log(this.allCompanies)
                    for(let i=0;i<this.allCompanies.length;i++){
                        this.companiesArr.push(this.allCompanies[i].name)
                    }
                    // console.log(this.companiesArr)
                }).catch((error) => {
                    console.log(error)
                })
            },
            remoteMethod(query) {
                if (query !== '') {
                    this.loading = true;
                    // console.log('显示this.list')
                    // console.log(this.list)
                    setTimeout(() => {
                        this.loading = false;
                        this.options4 = this.list.filter(item => {
                            console.log(item.name)
                            return item.name.toLowerCase()
                                .indexOf(query.toLowerCase()) > -1;
                        });
                    }, 100);
                } else {
                    this.options4 = [];
                }
            },
            search() {
                // const self = this
                // var list = document.querySelectorAll('.sortOption .el-input__inner')
                // var el = this.$refs.sel
                // var map = {}
                // self.sortBy = []
                // el.forEach(obj => {
                //     return map[obj.$options.propsData.name] = obj.$options.propsData.value
                // })
                // Array.prototype.map.call(list, obj => {
                //     if (map[obj.name] != '0') {
                //         self.sortBy.push(obj.name + ',' + map[obj.name])
                //     }
                // })

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
                var option = '?companyName='+this.currentCpmpany+'&startTime='+this.value10+'&endTime='+this.value9
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
                self.$axios.get(GETHRSTATISTICS + option)
                    .then(res => {
                        console.log(res)
                        self.pagesize = parseInt(self.size)
                        self.totalElements = parseInt(res.data.length)
                        self.tableData = res.data
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
        /*border-bottom: 1px solid #dfe6ec;*/
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
