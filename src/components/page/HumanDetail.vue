<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 人才管理</el-breadcrumb-item>
                <el-breadcrumb-item to="/humanlist">人才列表管理</el-breadcrumb-item>
                <el-breadcrumb-item>详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <div class="h-button">
                <el-button type="primary" size="medium" @click="editClick">编辑</el-button>
            </div>
            <el-card>
                <el-row>
                    <el-col :span="6">
                        <h5>创建时间：</h5>
                        <span>{{ info.createTime | dateTimeFormat }}</span>
                    </el-col>
                    <el-col :span="6">
                        <h5>简历价格：</h5>
                        <span>{{ info.price | priceFormat }}</span>
                    </el-col>
                    <el-col :span="6">
                        <h5>简历类型：</h5>
                        <span>{{ info.type | typeFormat }}</span>
                    </el-col>
                    <el-col :span="6">
                        <h5>简历状态：</h5>
                        <span>{{ info.state | stateFormat }}</span>
                    </el-col>
                </el-row>
            </el-card>
            <el-card class="box-card">
                <div class="block">
                    <img :src="info.avatar" class="headImg">
                    <div class="info">
                        <icon_female v-if="info.gender == '女'" class="icon"></icon_female>
                        <icon_male v-if="info.gender == '男'" class="icon"></icon_male>
                        <span class="name">{{ info.name }}</span>
                        <el-tag type="primary" size="small">{{ info.jobStatus }}</el-tag>
                        <div class="tag">
                            <el-tag type="success" size="small">{{ info.graduateSchool }}</el-tag>
                            <el-tag type="success" size="small">{{ info.education + " | " + info.major }}</el-tag>
                            <el-tag type="success" size="small">{{ info.city }}</el-tag>
                        </div>
                        <div class="tag mainInfo">
                            <icon_mail></icon_mail>
                            <span>{{ info.email }}</span>
                            <icon_tel></icon_tel>
                            <span>{{ info.cellphone }}</span>
                            <!--<icon_address></icon_address>-->
                            <!--<span>{{ info.address }}</span>-->
                        </div>
                    </div>
                </div>
                <el-row>
                    <div class="postInfo-container">
                        <el-row>
                            <el-col :span="24">
                                <h5>地址：</h5>
                                <span>{{ info.address }}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <h5>开始工作：</h5>
                                <span>{{ info.workStartTime | dateTimeFormat }}</span>
                            </el-col>
                            <el-col :span="6">
                                <h5>工作年限：</h5>
                                <span>{{ info.workYears }}年</span>
                            </el-col>
                            <el-col :span="6">
                                <h5>行业：</h5>
                                <span>{{ info.profession }}</span>
                            </el-col>
                            <el-col :span="6">
                                <h5>职位：</h5>
                                <span>{{ info.position }}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <h5>工作性质：</h5>
                                <span>{{ info.jobNature }}</span>
                            </el-col>
                            <el-col :span="6">
                                <h5>婚姻状态：</h5>
                                <span>{{ info.maritalStatus }}</span>
                            </el-col>
                            <el-col :span="6">
                                <h5>生日：</h5>
                                <span>{{ info.birthday | dateTimeFormat }}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <h5>到岗时间：</h5>
                                <span>{{ info.dutyTime }}</span>
                            </el-col>
                            <el-col :span="6">
                                <h5>期望月薪：</h5>
                                <span>{{ info.expectedSalary }}</span>
                            </el-col>
                            <el-col :span="12">
                                <h5 style="width: 7em;">目标工作地点：</h5>
                                <span>{{ info.targetWorkPlace }}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <h5>公司名称：</h5>
                                <span>{{ info.company }}</span>
                            </el-col>
                        </el-row>
                    </div>
                </el-row>
            </el-card>
            <el-collapse v-model="activeNames" class="detailInfo">
                <el-collapse-item title="自我评价" name="0">
                    <div style="white-space: pre-wrap;">
                        <div v-for="res in info.selfEvaluation" class="text item">{{ res }}</div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="技能" name="1">
                    <div style="white-space: pre-wrap;">
                        <div v-for="res in info.workSkills" class="text item">{{ res }}</div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="工作经历" name="2">
                    <div style="white-space: pre-wrap;">
                        <div v-for="res in info.workExperience" class="text item">{{ res }}</div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="项目经历" name="3">
                    <div style="white-space: pre-wrap;">
                        <div v-for="res in info.projectExperience" class="text item">{{ res }}</div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="教育经历" name="4">
                    <div style="white-space: pre-wrap;">
                        <div v-for="res in info.educationExperience" class="text item">{{ res }}</div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="培训经历" name="5">
                    <div style="white-space: pre-wrap;">
                        <div v-for="res in info.trainingExperience" class="text item">{{ res }}</div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="语言" name="6">
                    <div style="white-space: pre-wrap;">
                        <div v-for="res in info.languageAbility" class="text item">{{ res }}</div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    import icon_female from './iconfemale'
    import icon_male from './iconmale'
    import icon_mail from './iconmail'
    import icon_tel from './icontel'
    import icon_address from './iconaddress'

    export default {
        name: "human-detail",
        data() {
            return {
                human_id: this.$route.query.id,
                info: {},
                original: {},
                activeNames: ['0', '1', '2', '3', '4', '5', '6']
            }
        },
        components: {
            icon_female: icon_female,
            icon_male: icon_male,
            icon_mail: icon_mail,
            icon_tel: icon_tel,
            icon_address: icon_address
        },
        created() {
            this.getData()
        },
        methods: {
            editClick() {
                this.$router.push({path: '/humanedit', query: {id: this.human_id}})
            },
            splitText(text) {
                if(text != null ) {
                    return text.replace(/\n/g, "\\n").split('\\n')
                } else {
                    return ''
                }
            },
            getData() {
                let self = this;
                self.$axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
                self.$axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('userName')
                self.$axios.get('http://120.78.184.120:9002/api/operatorHuman/resume/' + self.human_id)
                    .then((res) => {
                        self.info = res.data
                        self.info.selfEvaluation = self.splitText(self.info.selfEvaluation)
                        self.info.workSkills = self.splitText(self.info.workSkills)
                        self.info.workExperience = self.splitText(res.data.workExperience)
                        self.info.projectExperience = self.splitText(self.info.projectExperience)
                        self.info.educationExperience = self.splitText(self.info.educationExperience)
                        self.info.trainingExperience = self.splitText(self.info.trainingExperience)
                        self.info.languageAbility = self.splitText(self.info.languageAbility)

                        self.original = Object.assign({}, self.info)
                    })
            }
        },
        filters: {
            priceFormat(val) {
                if (val == null || val == '') {
                    return ''
                } else {
                    return parseFloat(val) / 100 + '元';
                }
            },
            typeFormat(val) {
                var v = (val + '').toString().toLowerCase()
                if (v == 'platform') {
                    return '平台'
                } else if (v == 'private'){
                    return '个人'
                } else {
                    return '未知'
                }
            },
            stateFormat(val) {
                var v = (val + '').toString().toLowerCase()
                if (v == 'using') {
                    return '在用'
                } else if (v == 'disabled'){
                    return '删除'
                } else {
                    return '未知'
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
                    return year + '-' + rightTwo(month) + '-' + rightTwo(date);
                }
            }
        },
    }
</script>

<style scoped>
    .h-button {
        margin-bottom: 15px;
    }

    .block {
        margin-bottom: 25px;
    }

    .headImg {
        width: 90px;
        height: 90px;
        border-radius: 45px;
        vertical-align: bottom;
    }

    .info {
        margin-left: 18px;
        display: inline-block;
        vertical-align: middle;
    }

    .mainInfo svg, .mainInfo span {
        vertical-align: middle;
    }

    .mainInfo span {
        margin-right: 15px;
        font-size: 14px;
        color: #444;
    }

    .icon {
        width: 18px;
        fill: currentColor;
        overflow: hidden;
        vertical-align: bottom;
    }

    .tag {
        margin-top: 10px;
    }

    h5 {
        width: 5em;
        text-align-last: justify;
        color: #606266;
        display: inline-block;
    }

    .box-card {
        margin-top: 15px;
        border-bottom: none;
        border-color: #dfe6ec;
        border-radius: unset;
        box-shadow: unset;
    }

    h5 + span {
        font-size: 14px;
    }

    .name {
        color: #444;
        display: inline-block;
        font-weight: bolder;
        font-size: 20px;
        line-height: 20px;
        vertical-align: middle;
    }

    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 0.5em;
    }
</style>

<style>
    .postInfo-container .el-row {
        margin-bottom: 10px;
    }

    .detailInfo {
        border: 1px solid #dfe6ec;
    }

    .detailInfo .el-collapse-item__arrow {
        float: left;
        font-size: 14px;
        font-weight: bold;
        line-height: 14px;
        margin-top: 17px;
    }

    .detailInfo .el-collapse-item__header {
        color: #333;
        font-weight: bold;
    }

    .detailInfo .el-collapse-item__wrap {
        background-color: #fbfdff;
    }

    .detailInfo .el-collapse-item__header {
        padding: 0 15px;
        border-bottom: 1px solid #dfe6ec;
    }

    .detailInfo .el-collapse-item__content {
        padding: 10px 15px;
    }
</style>
