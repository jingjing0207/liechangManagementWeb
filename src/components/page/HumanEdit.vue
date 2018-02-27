<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 人才管理</el-breadcrumb-item>
                <el-breadcrumb-item to="/humanlist">人才列表管理</el-breadcrumb-item>
                <el-breadcrumb-item>简历编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <div class="h-button">
                <el-button type="primary" size="medium" @click="saveClick">保存</el-button>
                <el-button type="primary" size="medium" @click="cancelClick">取消</el-button>
            </div>
            <el-card>
                <el-row type="flex" align="middle">
                    <el-col :span="6">
                        <h5>价格(元)：</h5>
                        <el-input-number v-model="info.price" :min="0" :controls="false"
                                         style="vertical-align: middle;" size="medium"
                                         class="smallinput"></el-input-number>
                    </el-col>
                    <el-col :span="6">
                        <h5>简历类型：</h5>
                        <el-select v-model="info.type" size="medium" class="smallinput">
                            <el-option key="1" label="平台" value="PLATFORM"></el-option>
                            <el-option key="2" label="个人" value="PRIVATE"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <h5>简历状态：</h5>
                        <el-select v-model="info.state" size="medium" class="smallinput">
                            <el-option key="1" label="启用" value="Using"></el-option>
                            <el-option key="2" label="禁用" value="Disabled"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-card>
            <el-card class="box-card">
                <div class="block">
                    <img :src="info.avatar" class="headImg">
                    <div class="info">
                        <el-input v-model="info.name" size="medium" placeholder="姓名" style="width: 150px;"></el-input>
                        <el-select v-model="info.gender" size="medium" style="width: 65px;">
                            <el-option key="1" label="男" value="男"></el-option>
                            <el-option key="2" label="女" value="女"></el-option>
                        </el-select>
                        <el-select v-model="info.jobStatus" size="medium" style="width: 80px;">
                            <el-option key="1" label="在职" value="在职"></el-option>
                            <el-option key="2" label="求职" value="找工作"></el-option>
                        </el-select>
                    </div>
                </div>
                <el-row>
                    <div class="postInfo-container">
                        <el-row>
                            <el-col :span="12">
                                <h5>邮箱：</h5>
                                <el-input v-model="info.email" size="medium" class="smallinput"></el-input>
                            </el-col>
                            <el-col :span="12">
                                <h5>地址：</h5>
                                <el-input v-model="info.address" size="medium" class="smallinput"></el-input>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <h5>开始工作：</h5>
                                <el-date-picker class="smallinput" :clearable="false" type="date"
                                                size="medium" value-format="timestamp"
                                                v-model="info.workStartTime" placeholder="选择日期">
                                </el-date-picker>
                            </el-col>
                            <el-col :span="6">
                                <h5>电话：</h5>
                                <el-input v-model="info.cellphone" size="medium" class="smallinput"></el-input>
                            </el-col>
                            <el-col :span="6">
                                <h5>行业：</h5>
                                <el-input v-model="info.profession" size="medium" class="smallinput"></el-input>
                            </el-col>
                            <el-col :span="6">
                                <h5>职位：</h5>
                                <el-input v-model="info.position" size="medium" class="smallinput"></el-input>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <h5>毕业学校：</h5>
                                <el-input v-model="info.graduateSchool" size="medium" class="smallinput"></el-input>
                            </el-col>
                            <el-col :span="6">
                                <h5>学历：</h5>
                                <el-input v-model="info.education" size="medium" class="smallinput"></el-input>
                            </el-col>
                            <el-col :span="6">
                                <h5>专业：</h5>
                                <el-input v-model="info.major" size="medium" class="smallinput"></el-input>
                            </el-col>
                            <el-col :span="6">
                                <h5>所在城市：</h5>
                                <el-input v-model="info.city" size="medium" class="smallinput"></el-input>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <h5>工作性质：</h5>
                                <el-input v-model="info.jobNature" size="medium" class="smallinput"></el-input>
                            </el-col>
                            <el-col :span="6">
                                <h5>婚姻状态：</h5>
                                <el-input v-model="info.maritalStatus" size="medium" class="smallinput"></el-input>
                            </el-col>
                            <el-col :span="6">
                                <h5>生日：</h5>
                                <el-date-picker class="smallinput" :clearable="false" type="date"
                                                size="medium" value-format="timestamp"
                                                v-model="info.birthday" placeholder="选择日期">
                                </el-date-picker>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <h5>到岗时间：</h5>
                                <el-input v-model="info.dutyTime" size="medium" class="smallinput"></el-input>
                            </el-col>
                            <el-col :span="6">
                                <h5>期望月薪：</h5>
                                <el-input v-model="info.expectedSalary" size="medium" class="smallinput"></el-input>
                            </el-col>
                            <el-col :span="12">
                                <h5 style="width: 7em;">目标工作地点：</h5>
                                <el-input v-model="info.targetWorkPlace" size="medium" class="smallinput1"></el-input>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <h5>公司名称：</h5>
                                <el-input v-model="info.company" size="medium" class="smallinput"></el-input>
                            </el-col>
                        </el-row>
                    </div>
                </el-row>
            </el-card>
            <el-collapse v-model="activeNames" class="detailInfo">
                <el-collapse-item title="自我评价" name="0">
                    <div>
                        <el-input v-model="info.selfEvaluation" type="textarea" resize="none" :rows="6"></el-input>
                        <!--<div v-for="res in info.selfEvaluation" class="text item">{{ res }}</div>-->
                    </div>
                </el-collapse-item>
                <el-collapse-item title="技能" name="1">
                    <div>
                        <el-input v-model="info.workSkills" type="textarea" resize="none" :rows="6"></el-input>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="工作经历" name="2">
                    <div>
                        <el-input v-model="info.workExperience" type="textarea" resize="none" :rows="10"></el-input>
                        <!--<div v-for="res in info.workExperience" class="text item">{{ res }}</div>-->
                    </div>
                </el-collapse-item>
                <el-collapse-item title="项目经历" name="3">
                    <div>
                        <el-input v-model="info.projectExperience" type="textarea" resize="none" :rows="10"></el-input>
                        <!--<div v-for="res in info.projectExperience" class="text item">{{ res }}</div>-->
                    </div>
                </el-collapse-item>
                <el-collapse-item title="教育经历" name="4">
                    <div>
                        <el-input v-model="info.educationExperience" type="textarea" resize="none" :rows="6"></el-input>
                        <!--<div v-for="res in info.educationExperience" class="text item">{{ res }}</div>-->
                    </div>
                </el-collapse-item>
                <el-collapse-item title="培训经历" name="5">
                    <div>
                        <el-input v-model="info.trainingExperience" type="textarea" resize="none" :rows="6"></el-input>
                        <!--<div v-for="res in info.trainingExperience" class="text item">{{ res }}</div>-->
                    </div>
                </el-collapse-item>
                <el-collapse-item title="语言" name="6">
                    <div>
                        <el-input v-model="info.languageAbility" type="textarea" resize="none" :rows="6"></el-input>
                        <!--<div v-for="res in info.languageAbility" class="text item">{{ res }}</div>-->
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
        name: "human-edit",
        data() {
            return {
                human_id: this.$route.query.id,
                info: {},
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
            saveClick() {
                let self = this;
                self.$axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
                self.$axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('userName')
                var newinfo = Object.assign({}, this.info)
                newinfo.price = newinfo.price * 100
                this.$axios.post("http://120.78.184.120:9002/api/operatorHuman/modify", newinfo)
                    .then(res => {
                        this.$router.push({path: '/humandetail', query: {id: this.human_id}})
                    })
                    .catch((error) => {
                        this.$message({
                            message: '修改失败',
                            type: 'error'
                        })
                    })
            },
            cancelClick() {
                this.$router.push({path: '/humandetail', query: {id: this.human_id}})
            },
            splitText(text) {
              if(text != null ) {
                  return text.replace(/\n/g, "\\n").split('\\n').join('\n')
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

                        if (self.info.price == null || self.info.price == '') {
                            self.info.price = ''
                        } else {
                            self.info.price = parseFloat(self.info.price) / 100
                        }
                    })
            }
        }
    }
</script>

<style scoped>
    .smallinput {
        width: calc(100% - 80px);
    }

    .smallinput1 {
        width: calc(100% - 106px);
    }

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
        margin: 0 15px 0 5px;
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
        margin-top: 4px;
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
        margin-bottom: 18px;
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
