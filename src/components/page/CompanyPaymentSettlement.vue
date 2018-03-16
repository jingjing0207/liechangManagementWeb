<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 报表</el-breadcrumb-item>
                <el-breadcrumb-item>企业结算报表</el-breadcrumb-item>
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
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <!--<div class="selectTime">-->
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
                    <!--</div>-->
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
        <el-table :data="tableData" border fit id="jdlist" style="width: 100%;font-size: 13px;text-align: center">
            <el-table-column header-align="center" prop="serialNumber" label="JD编号 " width="180px">
            </el-table-column>
            <el-table-column header-align="center" prop="title" label="JD名称">
            </el-table-column>
            <el-table-column header-align="center" prop="recruitedNumber" label="已招聘人数">
            </el-table-column>
            <el-table-column header-align="center" prop="recruitingNumber" label="职位招聘人数">
            </el-table-column>
            <el-table-column header-align="center" prop="refundFee" label="赏金退回金额 (元) ">
                <template slot-scope="scope">
                    <template>
                        <span>{{ scope.row.refundFee | priceFormat }}</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column header-align="center" prop="totalFee" label="赏金支出金额 (元) ">
                <template slot-scope="scope">
                    <template>
                        <span>{{ scope.row.totalFee | priceFormat }}</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column header-align="center" prop="platformFee" label="平台收费金额 (元)">
                <template slot-scope="scope">
                    <template>
                        <span>{{ scope.row.platformFee | priceFormat }}</span>
                    </template>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                @size-change="sizeChange"
                @current-change="handleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper"
                :current-page.sync="currentPage"
                :page-sizes="[5,10,15,20,25,30]"
                :page-size="pageSize"
                :total="numberOfElements">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import Sortable from 'sortablejs'
    import { GETJDSTATISTICS,GETALLCOMPANIES } from '../../constants/Constants'
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
                numberOfElements: 0,
                pageSize: 10,
                currentPage:1,
                search_title: '',
                sortBy: [],
                sortGroup: [
                    {value: '0', name: 'title', display: 'JD名称'},
                    {value: '0', name: 'recruitedNumber', display: '已招聘人数'},
                    {value: '0', name: 'recruitingNumber', display: '职位招聘人数'},
                    {value: '0', name: 'refundFee', display: '赏金退回金额'},
                    {value: '0', name: 'totalFee', display: '赏金支出金额'},
                    {value: '0', name: 'serialNumber', display: 'JD编号'},
                    {value: '0', name: 'platformFee', display: '平台收费金额'}
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
                    return x1 + (x2 ? '.' +x2.replace(/(\d{3})(?=[^$])/g,'$1,') : ' ');
                }
                return addCommas(val);
            }
        },
        updated(){
            this.list = this.allCompanies.map(item => {
                return { id:item.id, name:item.name };
            });
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
            remoteMethod(query) {
                if (query !== '') {
                    this.loading = true;
                    // console.log('显示this.list')
                    // console.log(this.list)
                    setTimeout(() => {
                        this.loading = false;
                        this.options4 = this.list.filter(item => {
                            return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
                                item.id.toLowerCase().indexOf(query.toLowerCase()) > -1
                        });
                    }, 100);
                } else {
                    this.options4 = [];
                }
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

                this.getData();
            },
            sizeChange(val) {
                this.search()
                this.pageSize=val
                this.getData();
            },
            handleCurrentChange(val) {
                this.getData();
            },
            getData() {
                let self = this;
                console.log(this.searchMonth)
                var option = '?companyId='+this.currentCpmpany+'&startTime='
                    +this.value10+'&endTime='+this.value9+'&size='+this.pageSize+'&page='+(this.currentPage-1)

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
                self.$axios.get(GETJDSTATISTICS + option)
                    .then(res => {
                        console.log(res)
                        self.pageSizeize = parseInt(self.size)
                        self.numberOfElements = parseInt(res.data.totalElements)
                        self.tableData = res.data.content.map(v => {
                            this.$set(v, 'refundFee', parseFloat(v['refundFee'])/100)
                            this.$set(v, 'totalFee', parseFloat(v['totalFee']) / 100)
                            this.$set(v, 'platformFee', parseFloat(v['platformFee']) / 100)
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
        /*padding: 0 10px;*/
    }

    .jdlist-row {
        cursor: pointer;
    }
    .cell{
        white-space: nowrap;
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
