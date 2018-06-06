<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> JD管理</el-breadcrumb-item>
                <el-breadcrumb-item>JD列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-collapse class="handle-box">
            <div class="search">
                <el-input clearable v-model="search_title" size="medium" placeholder="输入标题" class="handle-title"/>
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
        <el-card class="confirm">
            <div style="height: 24px;line-height: 24px;">
                <span>赏金确认天数：</span>
                <span v-if="!setConfirm">{{ confirmDateCount }}天
                    <el-button size="mini" type="text" class="setConfirm" @click="setConfirm = true">
                        <i class="el-icon-edit"></i>修改
                    </el-button>
                </span>
                <span v-else>
                    <el-input-number size="mini" :controls="false" :min="0" class="inputCount"
                                     v-model="confirmDateCount"/>天
                    <el-button size="mini" type="primary" plain class="setConfirm" @click="confirmSet">确定</el-button>
                    <el-button size="mini" type="primary" plain class="setConfirm" @click="cancelSet">取消</el-button>
                </span>
            </div>
        </el-card>
        <el-table :data="data" border fit id="jdlist" style="width: 100%;font-size: 13px;text-align: center"
                  row-class-name="jdlist-row" @row-click="openDetails">
            <el-table-column header-align="center" prop="createTime" label="创建时间" width="160px"
                             :formatter="dateTimeFormat"/>
            <el-table-column header-align="center" prop="title" show-overflow-tooltip label="标题"/>
            <el-table-column header-align="center" prop="creatorCompanyName" show-overflow-tooltip label="所属公司"/>
            <el-table-column header-align="center" prop="creatorUsername" show-overflow-tooltip label="发布人"/>
            <el-table-column header-align="center" prop="education" label="学历" width="110px"/>
            <el-table-column header-align="center" prop="level" label="级别"/>
            <el-table-column header-align="center" prop="position" label="职位" width="130px"/>
            <el-table-column header-align="center" prop="price" label="职位奖励" :formatter="priceFormat"/>
            <el-table-column header-align="center" prop="recruitingNumber" label="招聘人数"/>
            <el-table-column header-align="center" prop="state" label="状态" :formatter="stateFormat"/>
        </el-table>
        <div class="pagination">
            <el-pagination @size-change="sizeChange" @current-change="handleCurrentChange"
                           layout="total, sizes, prev, pager, next, jumper" :current-page.sync="pageNo"
                           :page-sizes="[5,10,15,20,25,30]" :page-size="pagesize" :total="totalElements">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import Sortable from 'sortablejs'
    import axios from 'axios'
    import {GET_JOB_LIST, GET_COMMISSION_COMFIRM, SET_COMMISSION_COMFIRM} from '../../constants/Constants'

    axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8';
    axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('resultMessage');

    export default {
        name: 'job-list',
        data() {
            return {
                totalElements: 0,
                pageNo: 1,
                pagesize: 10,
                size: 10,
                search_title: '',
                sortBy: [],
                confirmID: 1,
                confirmDateCount: 0,
                originalConfirmDateCount: 0,
                setConfirm: false,
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
                tableData: []
            }
        },
        created() {
        },
        mounted(){
            this.getConfirm();
            this.getData();
            this.setSort()
        },
        computed: {
            data() {
                return this.tableData
            }
        },
        methods: {
            search() {
                const list = document.querySelectorAll('.sortOption .el-input__inner');
                const map = {};
                this.sortBy = [];
                this.$refs.sel.forEach(obj => map[obj.name] = obj.value);
                Array.prototype.map.call(list, obj => {
                    if (map[obj.name] != '0') {
                        this.sortBy.push(obj.name + ',' + map[obj.name])
                    }
                });
                this.pageNo = 1;
                this.getData();
            },
            confirmSet() {
                let userForm = {
                    id: this.confirmID,
                    confirmDateCount: this.confirmDateCount
                };
                axios.post(SET_COMMISSION_COMFIRM, userForm)
                    .then(res => this.setConfirm = false)
                    .catch((error) => {
                        this.$message({
                            message: '修改失败',
                            type: 'error'
                        })
                    })
            },
            cancelSet() {
                this.confirmDateCount = this.originalConfirmDateCount
                this.setConfirm = false
            },
            sizeChange(val) {
                this.size = val;
                this.search()
            },
            handleCurrentChange(val) {
                this.getData()
            },
            priceFormat(row, column) {
                return parseFloat(row.price) / 100 + '元';
            },
            stateFormat(row, column) {
                var v = (row.state + '').toString().toLowerCase()
                if (v == 'submit') {
                    return '提交'
                } else if (v == 'wait_audit') {
                    return '待审核'
                } else if (v == 'audit_failed') {
                    return '已驳回'
                } else if (v == 'publish') {
                    return '发布'
                } else if (v == 'completed') {
                    return '已完结'
                } else {
                    return '未知'
                }
            },
            dateTimeFormat(row, column) {
                let time = new Date(+row.createTime);
                let rightTwo = (v) => {
                    v = '0' + v;
                    return v.substring(v.length - 2, v.length)
                };
                if (time == null) return;
                return new Date(time).toLocaleString()
            },
            openDetails(row) {
                this.$router.push({path: '/job', query: {id: row.id}})
            },
            getConfirm() {
                axios.get(GET_COMMISSION_COMFIRM)
                    .then(res => {
                        this.confirmID = res.data.id;
                        this.confirmDateCount = res.data.confirmDateCount;
                        this.originalConfirmDateCount = this.confirmDateCount
                    })
            },
            getData() {
                let option = '?page=' + (this.pageNo - 1) + '&size=' + this.size;
                let sortStr = '';
                if (this.search_title.length != 0) {
                    option = option + '&title=' + this.search_title
                }
                if (this.sortBy.length != 0) {
                    for (var s in this.sortBy) {
                        sortStr = sortStr + '&sort=' + this.sortBy[s]
                    }
                    option = option + sortStr
                }
                axios.get(GET_JOB_LIST + option)
                    .then(res => {
                        this.pagesize = parseInt(this.size);
                        this.totalElements = parseInt(res.data.totalElements);
                        this.tableData = res.data.content
                    })
            },
            setSort() {
                this.$nextTick(() => {
                    const el = document.querySelectorAll('.sortOption .el-collapse-item__content')[0];
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

    .confirm {
        font-size: 14px;
        box-shadow: unset;
        border-radius: unset;
    }

    div + .setConfirm {
        margin-left: 15px;
    }

    .setConfirm {
        padding: 2px 5px;
        font-size: 14px;
    }

    .inputCount {
        width: 50px;
        margin-right: 5px;
    }
</style>
<style>
    .inputCount.el-input-number.is-without-controls input.el-input__inner {
        height: 24px;
        font-size: 14px;
        padding-left: 5px;
        padding-right: 5px;
    }

    .el-card.confirm div.el-card__body {
        padding: 15px;
    }

    .el-button.setConfirm span {
        margin-left: unset;
    }

    #jdlist.el-table .cell, #jdlist.el-table th div {
        color: #333;
        padding: 0 5px;
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
