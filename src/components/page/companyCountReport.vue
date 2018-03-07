<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 报表</el-breadcrumb-item>
                <el-breadcrumb-item>企业统计报表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-collapse class="handle-box">
            <div class="search">
                <div class="handle-title">
                    <el-date-picker
                        v-model="value4"
                        type="month"
                        placeholder="选择月份">
                    </el-date-picker>
                </div>
                <el-button type="primary" size="medium" icon="el-icon-search" @click="search">查询</el-button>
                <!--<el-button type="text" style="float: right">导出</el-button>-->
                <!--<el-button type="success" style="float: right" size="medium">导出</el-button>-->
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
        <el-table :data="tableData" border fit id="jdlist" style="width: 100%;font-size: 13px;text-align: center">
            <el-table-column header-align="center" prop="companyName" label="公司名称"></el-table-column>
            <el-table-column header-align="center" prop="income" label="进款">
                <template slot-scope="scope">
                    <template>
                        <span>{{ scope.row.income | priceFormat }}</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column header-align="center" prop="month" label="月份" :formatter="dateTimeFormat"></el-table-column>
            <el-table-column header-align="center" prop="outlay" label="经费">
                <template slot-scope="scope">
                    <template>
                        <span>{{ scope.row.outlay | priceFormat }}</span>
                    </template>
                </template>
            </el-table-column>
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
    import { GETCOMPANYMONTHSTATISTICS } from '../../constants/Constants'
    import axios from 'axios';
    axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
    axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('resultMessage')

    export default {
        name: '',
        data() {
            return {
                value4:'',
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
                searchMonth:''
            }
        },
        created() {
            this.setSort();
        },
        computed: {
            data() {

            }
        },
        filters: {
            priceFormat(val) {
                function addCommas(nStr){
                    nStr += '';
                    let  x = nStr.split('.');
                    let x1 = x[0];
                    let x2 = x[1];
                    var rgx = /(\d+)(\d{3})/;
                    while (rgx.test(x1)) {
                        x1 = x1.replace(rgx, '$1,$2');
                    }
                    return x1 + ' ' + (x2 ? x2.replace(/(\d{3})(?=[^$])/g,'$1,') : '');
                }

                return (addCommas(val)) + '元';
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

                this.getData();
            },
            sizeChange(val) {
                this.size = val
                this.search()
            },
            handleCurrentChange(val) {
                this.getData();
            },
            dateTimeFormat(row, column) {
                var time = new Date(+row.month);
                var rightTwo = (v) => {
                    v = '0' + v
                    return v.substring(v.length - 2, v.length)
                }
                if (time == null) return;
                return time.getFullYear() + ' 年 ' + (time.getMonth() + 1)+' 月'
            },
            getData() {
                let self = this;
                let d=new Date(this.value4)
                this.searchMonth=d.getFullYear() + '-' + (d.getMonth() + 1)
                console.log(this.searchMonth)
                var option = '?month=' +this.searchMonth
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
                self.$axios.get(GETCOMPANYMONTHSTATISTICS + option)
                    .then(res => {
                        console.log(res)
                        self.pagesize = parseInt(self.size)
                        self.totalElements = parseInt(res.data.length)
                        self.tableData = res.data.map(v => {
                            this.$set(v, 'income', parseFloat(v['income']) / 100)
                            this.$set(v, 'outlay', parseFloat(v['outlay']) / 100)
                            return v
                        })
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
        max-width: 242px;
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
