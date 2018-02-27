<template id="app">
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> JD管理</el-breadcrumb-item>
                <el-breadcrumb-item to="/jdlist">JD列表</el-breadcrumb-item>
                <el-breadcrumb-item>详细信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="createPost-main-container">
            <div class="block">
                <h2>{{ info.title }}</h2>
                <el-tag color="white" size="small" type="success">{{ info.creatorCompanyName }}</el-tag>
                <el-tag color="white" size="small" type="success">支付方式：{{ info.payType | payTypeFormat}}</el-tag>
                <el-tag color="white" size="small" type="success">状态：{{ info.state | stateFormat}}</el-tag>
            </div>
            <el-card class="box-card">
                <el-row>
                    <div class="postInfo-container">
                        <el-row>
                            <el-col :span="6" class="col">
                                <h5>提交时间：</h5>
                                <span>{{ info.createTime | dateTimeFormat }}</span>
                            </el-col>
                            <el-col :span="6">
                                <h5>发布时间：</h5>
                                <span>{{ info.publishTime | dateTimeFormat }}</span>
                            </el-col>
                            <el-col :span="6">
                                <h5>修改时间：</h5>
                                <span>{{ info.updateTime | dateTimeFormat }}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6" class="col">
                                <h5>行业：</h5>
                                <span>{{ info.profession }}</span>
                            </el-col>
                            <el-col :span="6">
                                <h5>薪资范围：</h5>
                                <span>{{ info.salaryRange }}</span>
                            </el-col>
                            <el-col :span="6">
                                <h5>招聘人数：</h5>
                                <span>{{ info.recruitingNumber }}</span>
                            </el-col>
                            <el-col :span="6">
                                <h5>已招人数：</h5>
                                <span>{{ info.recruitedNumber }}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6" class="col">
                                <h5>职位：</h5>
                                <span>{{ info.position }}</span>
                            </el-col>
                            <el-col :span="6">
                                <h5>发布人：</h5>
                                <span>{{ info.creatorUsername }}</span>
                            </el-col>
                            <el-col :span="6">
                                <h5>职位奖励：</h5>
                                <span>{{ info.price | priceFormat }}</span>
                            </el-col>
                            <el-col :span="6">
                                <h5>学历：</h5>
                                <span>{{ info.education }}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6" class="col">
                                <h5>级别：</h5>
                                <span>{{ info.level }}</span>
                            </el-col>
                            <el-col :span="6">
                                <h5>工作地点：</h5>
                                <span>{{ info.workArea }}</span>
                            </el-col>
                            <el-col :span="6">
                                <h5>工作性质：</h5>
                                <span>{{ info.jobNature }}</span>
                            </el-col>
                            <el-col :span="6">
                                <h5>工作经验：</h5>
                                <span>{{ info.workExperience }}</span>
                            </el-col>
                        </el-row>
                    </div>
                </el-row>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>岗位要求</span>
                </div>
                <div v-for="res in info.requirement" class="text item">
                    {{ res.description }}
                </div>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>工作内容</span>
                </div>
                <div v-for="res in info.responsibilities" class="text item">
                    {{ res.description }}
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'

    export default {
        name: "job-detail",
        data() {
            return {
                jd_id: this.$route.query.id,
                info: {}
            }
        },
        created() {
            this.getData()
        },
        filters: {
            payTypeFormat(val) {
                var v = (val + '').toString().toLowerCase()
                if (v == 'wechatpay') {
                    return '微信'
                } else if (v == 'alipay'){
                    return '支付宝'
                } else if (v == 'alipay'){
                    return '支付宝'
                } else if (v == 'bank'){
                    return '银行卡'
                } else if (v == 'companypay'){
                    return '企业结算'
                } else {
                    return '未知'
                }
            },
            stateFormat(val) {
                var v = (val + '').toString().toLowerCase()
                if (v == 'submit') {
                    return '提交'
                } else if (v == 'wait_audit'){
                    return '待审核'
                } else if (v == 'audit_failed'){
                    return '已驳回'
                } else if (v == 'publish'){
                    return '发布'
                } else if (v == 'completed'){
                    return '已完结'
                } else {
                    return '未知'
                }
            },
            priceFormat(val) {
                if (val == null || val == '') {
                    return ''
                } else {
                    return parseFloat(val) / 100 + '元';
                }
            },
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
                    return year + '-' + rightTwo(month) + '-' + rightTwo(date) + ' ' + rightTwo(hours) + ':' + rightTwo(minutes) /*+ ':' + rightTwo(seconds)*/;
                }
            }
        },
        methods: {
            getData() {
                let self = this;
                self.$axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
                self.$axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('userName')
                self.$axios.get('http://120.78.184.120:9002/api/operator/getJobDetail/' + self.jd_id)
                    .then((res) => {
                        self.info = res.data
                    })
            }
        }
    }
</script>

<style scoped>
    .col {
        margin-bottom: 10px;
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
        color: #606266;
        display: inline-block;
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

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {
        margin-top: 15px;
    }
</style>
