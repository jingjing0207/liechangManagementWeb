<template id="app">
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 管理配置</el-breadcrumb-item>
                <el-breadcrumb-item to="/companieslist">企业列表管理</el-breadcrumb-item>
                <el-breadcrumb-item>Offer详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="createPost-main-container">
            <div class="block">
                <h2>{{ companyName }}</h2>
                <el-tag color="white" size="small" type="success">创建时间：{{ info.createTime | dateTimeFormat }}</el-tag>
                <el-tag color="white" size="small" type="success">更新时间：{{ info.updateTime | dateTimeFormat }}</el-tag>
            </div>
            <!--<el-card class="box-card">-->
                <!--<el-row>-->
                    <!--<div class="postInfo-container">-->
                        <!--<el-row>-->
                            <!--&lt;!&ndash;<el-col :span="7" class="col">&ndash;&gt;-->
                                <!--&lt;!&ndash;<h5>公司名称：</h5>&ndash;&gt;-->
                                <!--&lt;!&ndash;<span>{{ companyName}}</span>&ndash;&gt;-->
                            <!--&lt;!&ndash;</el-col>&ndash;&gt;-->
                            <!--<el-col :span="7">-->
                                <!--<h5>创建时间：</h5>-->
                                <!--<span>{{ info.createTime | dateTimeFormat }}</span>-->
                            <!--</el-col>-->
                            <!--<el-col :span="7">-->
                                <!--<h5>更新时间：</h5>-->
                                <!--<span>{{ info.updateTime | dateTimeFormat }}</span>-->
                            <!--</el-col>-->
                        <!--</el-row>-->
                    <!--</div>-->
                <!--</el-row>-->
            <!--</el-card>-->
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="font-weight: 600;font-size: 15px;">报到时请携带以下材料</span>
                </div>
                <ol class="cailiao text item">
                    <li v-for="res in info.descriptions" style="margin-left:30px;line-height: 30px;font-size: 14px;">
                        {{ res.description }}
                    </li>
                </ol>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="font-weight: 600;font-size: 15px;">申明</span>
                </div>
                <ol class="cailiao text item">
                    <li v-for="res in info.preparations" style="margin-left:30px;line-height: 30px;font-size: 14px;">
                        {{ res.description }}
                    </li>
                </ol>
            </el-card>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {GETOFFERCONFIG} from '../../constants/Constants'

    export default {
        name: "job-detail",
        data() {
            return {
                offer_id: this.$route.query.id,
                info: {},
                companyName:sessionStorage.getItem('companyName')
            }
        },
        created() {
            this.getData()
        },
        filters: {
            dateTimeFormat(val) {
                if (val == null || val == '') {
                    return ''
                } else {
                    var time = new Date(+val);
                    var rightTwo = (v) => {
                        v = '0' + v
                        return v.substring(v.length - 2, v.length)
                    }
                    if (time == null) return;
                    var year = time.getFullYear();
                    var month = time.getMonth() + 1;
                    var date = time.getDate();
                    var hours = time.getHours();
                    var minutes = time.getMinutes();
                    var seconds = time.getSeconds();
                    // return year + '-' + rightTwo(month) + '-' + rightTwo(date) + ' ' + rightTwo(hours) + ':' + rightTwo(minutes) /*+ ':' + rightTwo(seconds)*/;
                    return new Date(time).toLocaleString()
                }
            }
        },
        methods: {
            getData() {
                let self = this;
                self.$axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
                self.$axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('userName')
                self.$axios.get(GETOFFERCONFIG+'?company='+self.offer_id)
                    .then((res) => {
                        console.log(res)
                        if(res.data.company==null) {
                            self.$message.error('暂无数据！')
                        }
                        self.info = res.data
                    })
            }
        }
    }
</script>

<style scoped>
    .col {
        /*margin-bottom: 10px;*/
    }

    .s-title {
        margin-bottom: 10px;
    }

    h2 {
        color: #333;
        margin-bottom: 10px;
    }

    h5 {
        width: 5em;
        text-align-last: justify;
        color: #000;
        display: inline-block;
        line-height: 28px;
        font-size: 15px;
        /*font-weight: 100;*/
    }

    h5 + span {
        font-size: 14px;
    }

    .items {
        list-style-position: inside;
        list-style-type: decimal;
        font-size: 14px;
        color: #333;
    }

    ul.items li {
        line-height: 26px;
    }

    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before, .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {
        margin-top: 15px!important;
    }
</style>
