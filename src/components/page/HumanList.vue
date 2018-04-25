<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 人才管理</el-breadcrumb-item>
                <el-breadcrumb-item>人才列表管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-collapse class="handle-box">
            <div class="search">
                <el-input clearable v-model="search_name" size="medium" placeholder="搜索姓名" class="handle-title"></el-input>
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
        <el-table :data="data"
                  border id="hlist"
                  style="width: 100%;font-size: 13px;text-align: center"
                  row-class-name="hlist-row">
            <el-table-column header-align="center" prop="avatar" label="人员" width="210px" align="center"
                             :resizable="false" show-overflow-tooltip>
                <template slot-scope="scope" prop="avatar">
                    <div class="human">
                        <img :src="scope.row.avatar" class="headImg">
                        <div class="info">
                            <icon_female v-if="scope.row.gender == '女'" class="icon"></icon_female>
                            <icon_male v-if="scope.row.gender == '男'" class="icon"></icon_male>
                            <span class="name">{{ scope.row.name }}</span>
                            <div>
                                <el-tag type="success" size="small">{{ scope.row.education + " | " + scope.row.city }}
                                </el-tag>
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column header-align="center" prop="cellphone" label="电话" :resizable="false" width="110px"
                             show-overflow-tooltip></el-table-column>
            <el-table-column header-align="center" prop="company" label="公司名称" min-width="200px"
                             show-overflow-tooltip></el-table-column>
            <el-table-column header-align="center" prop="position" label="公司职位"></el-table-column>
            <el-table-column header-align="center" prop="price" align="center" label="简历价格">
                <template slot-scope="scope">
                    <template v-if="scope.row.edit">
                        <el-input size="mini" v-model="scope.row.price" ref="rowPrice"></el-input>
                        <div class="editPrice">
                            <el-button type="text" icon="el-icon-check" @click="editOK(scope.row)"></el-button>
                            <el-button type="text" icon="el-icon-close" @click="editCancel(scope.row)"></el-button>
                        </div>
                    </template>
                    <template v-else>
                        <span>{{ scope.row.price | priceFormat }}</span>
                        <el-button v-if="scope.row.state != 'Disabled'" type="text" icon="el-icon-edit"
                                   @click="editClick(scope.row)"></el-button>
                    </template>
                </template>
            </el-table-column>
            <el-table-column header-align="center" prop="state" :resizable="false" label="简历状态" width="75px"
                             align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.state | stateFormat }}</span>
                </template>
            </el-table-column>
            <el-table-column header-align="center" label="操作" :resizable="false" width="70px">
                <template slot-scope="scope">
                    <div id="option_button">
                        <el-button type="text" size="mini" style="width: 100%;" @click="view(scope.row)">查看</el-button>
                        <el-button v-if="scope.row.state != 'Disabled'" type="text" size="mini"
                                   style="width: 100%;" @click="del(scope.row)">禁用
                        </el-button>
                    </div>
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
    import {GET_RESUME_LIST, SET_PRICE, DELETE_RESUME} from '../../constants/Constants'
    import axios from 'axios';
    axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
    axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('resultMessage')
    import icon_female from './iconfemale'
    import icon_male from './iconmale'
    import human_import from './HumanImport'

    export default {
        name: "human-list",
        data() {
            return {
                totalElements: 0,
                pageNo: 1,
                pagesize: 10,
                size: 10,
                search_name: '',
                sortBy: [],
                sortGroup: [
                    {value: '0', name: 'name', display: '姓名'},
                    {value: '0', name: 'gender', display: '性别'},
                    {value: '0', name: 'cellphone', display: '电话'},
                    {value: '0', name: 'education', display: '学历'},
                    {value: '0', name: 'city', display: '所在城市'},
                    {value: '0', name: 'company', display: '公司名称'},
                    {value: '0', name: 'position', display: '公司职位'},
                    {value: '0', name: 'price', display: '简历价格'},
                    {value: '0', name: 'state', display: '简历状态'}
                ],
                sortOptions: [{value: '0', label: '默认'},
                    {value: 'asc', label: '升序'},
                    {value: 'desc', label: '降序'}],
                tableData: []
            }
        },
        computed: {
            data() {
                const self = this;
                return self.tableData
            }
        },
        components: {
            icon_female: icon_female,
            icon_male: icon_male,
            human_import: human_import
        },
        created() {
            this.setSort();
        },
        mounted(){
            this.getData();
        },
        filters: {
            priceFormat(val) {
                return val + '元';
            },
            stateFormat(val) {
                let v = (val + '').toString().toLowerCase()
                if (v == 'using') {
                    return '启用'
                } else if (v == 'disabled') {
                    return '禁用'
                } else {
                    return '未知'
                }
            },
        },
        methods: {
            editClick(row) {
                row.edit = true;
                console.info(row.edit)
            },
            editOK(row) {
                row.originalPrice = row.price;
                let userForm = {
                    id: row.id,
                    price: Math.ceil(row.price * 1000 / 10)
                };
                this.$axios.post(SET_PRICE, userForm).then(res => {
                    console.log(res)
                    row.edit = false
                })
                .catch((error) => {
                    this.$message({
                        message: '修改失败',
                        type: 'error'
                    })
                })
            },
            editCancel(row) {
                row.price = row.originalPrice;
                row.edit = false
            },
            view(row) {
                this.$router.push({path: '/humandetail', query: {id: row.id}})
            },
            del(row) {
                this.$axios.delete(DELETE_RESUME + row.id)
                    .then(res => {
                        this.getData()
                    })
                    .catch((error) => {
                        this.$message({
                            message: '删除失败',
                            type: 'error'
                        })
                    })
            },
            sizeChange(val) {
                this.size = val;
                this.search()
            },
            search() {
                const self = this;
                let list = document.querySelectorAll('.sortOption .el-input__inner');
                let el = this.$refs.sel;
                let map = {};
                self.sortBy = [];
                el.forEach(obj => {
                    return map[obj.$options.propsData.name] = obj.$options.propsData.value
                })
                Array.prototype.map.call(list, obj => {
                    if (map[obj.name] != '0') {
                        self.sortBy.push(obj.name + ',' + map[obj.name])
                    }
                });
                this.pageNo = 1;
                this.getData()
            },
            handleCurrentChange(val) {
                this.getData();
            },
            openDetails(row) {
                this.$router.push({path: '/job', query: {id: row.id}})
            },
            getData() {
                let self = this;
                let option = '?page=' + (self.pageNo - 1) + '&size=' + self.size;
                let sortStr = '';
                if (self.sortBy.length != 0) {
                    for (var s in self.sortBy) {
                        sortStr = sortStr + '&sort=' + self.sortBy[s]
                    }
                }
                if (self.search_name.length != 0) {
                    option = option + '&name=' + self.search_name
                }
                if (sortStr.length != 0) {
                    option = option + sortStr
                }
                self.$axios.get(GET_RESUME_LIST + option)
                    .then(res => {
                        console.log(res)
                        self.pagesize = parseInt(self.size);
                        self.totalElements = parseInt(res.data.totalElements);
                        self.tableData = res.data.content.map(v => {
                            this.$set(v, 'price', parseFloat(v['price']) / 100);
                            this.$set(v, 'edit', false);
                            this.$set(v, 'originalPrice', v['price']);
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
    .human {
        padding-left: 8px;
        text-align: left;
        margin: 8px 0;
    }

    .headImg {
        width: 60px;
        height: 60px;
        border-radius: 30px;
        vertical-align: top;
    }

    .name {
        color: #444;
        display: inline-block;
        font-weight: bolder;
        font-size: 20px;
    }

    .info {
        margin-top: 8px;
        margin-left: 8px;
        display: inline-block;
    }

    .icon {
        width: 18px;
        vertical-align: middle;
        fill: currentColor;
        overflow: hidden;
        vertical-align: text-bottom;
    }

    .sortable-ghost {
        opacity: .7;
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
    #hlist.el-table .cell, #jdlist.el-table th div {
        color: #333;
        padding: 0 10px;
    }

    .hlist-row td {
        padding: 0;
    }

    #hlist th {
        background-color: #eef1f6;
    }

    .handle-size .el-input {
        display: inline-table;
    }

    .sortItem input {
        color: #42b983;
        border: none;
        width: 75px;
    }

    #option_button .el-button + .el-button {
        margin-left: 0;
    }

    .sortOption .el-collapse-item__arrow {
        float: left;
        font-size: 14px;
        line-height: 14px;
        margin-top: 17px;
    }

    .sortOption .el-collapse-item__header {
        padding: 0 15px;
        border-bottom: 1px solid #dfe6ec;
    }

    .sortOption .el-collapse-item__content {
        padding: 10px 15px;
    }

    .editPrice .el-button {
        font-size: 18px;
        padding: 0;
    }

    .sortOption .el-table th {
        text-align: center;
    }

    .sortOption .el-table th {
        text-align: center;
    }
</style>
