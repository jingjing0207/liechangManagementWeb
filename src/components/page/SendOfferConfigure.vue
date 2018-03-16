<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 管理配置</el-breadcrumb-item>
                <el-breadcrumb-item>电子Offer模板管理配置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <div class="h-button" >
                <el-select
                    clearable
                    v-model="currentCompany"
                    style="width:178px;"
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
                <el-button type="primary" size="medium" icon="el-icon-search" @click="search">查询</el-button>
                <el-button type="primary" plain  style="float: right;" size="medium" @click="modifyClick">编辑</el-button>
            </div>
            <el-card class="offer-box">
                <div slot="header" class="clearfix">
                    <h3>录用通知书</h3>
                </div>
                <div>
                    <p>请您携带以下材料到
                        <el-input style="width:10em;"/>
                        部
                        <el-input style="width:10em;"/>
                        处报到，并请于报到前两个工作日邮件通知公司
                    </p>
                    <p>如有任何问题可与
                        <el-input style="width:8em;"/>
                        电话或邮件联系
                    </p>
                    <p>电话：
                        <el-input style="width:20em;"/>
                    </p>
                    <p>邮箱地址：
                        <el-input style="width:18em;"/>
                    </p>
                </div>
            </el-card>
            <el-card class="offer-box">
                <div slot="header" class="clearfix">
                    <h4>报到时请携带以下材料</h4>
                </div>
                <ul class="cailiao">
                    <li v-for="(item, index) in cl">
                        <i class="el-icon-error remove-button" @click="removeItem1(index)"></i>
                        <el-input v-model="cl[index]"/>
                    </li>
                </ul>
                <div v-show="isShow" style="width:100%;height:100%;background:rgba(220,222,226,.1);position: absolute;left:0;top:0;cursor: not-allowed;z-index:999;"></div>
                <el-button size="mini" icon="el-icon-plus" class="add-button" @click="addCailiao"/>
                <div class="wubi">请务必在报到前整理齐全所有资料，以免影响入职手续办理</div>
            </el-card>
            <el-card class="offer-box">
                <div slot="header" class="clearfix">
                    <h4>申明</h4>
                </div>
                <ul class="shenming">
                    <li v-for="(item, index) in sm">
                        <i class="el-icon-error remove-button" @click="removeItem2(index)"></i>
                        <el-input autosize type="textarea" style="width:100%;" resize="none" v-model="sm[index]"/>
                    </li>
                </ul>
                <div v-show="isShow" style="width:100%;height:100%;background:rgba(220,222,226,.1);position: absolute;left:0;top:0;cursor: not-allowed;z-index:999;"></div>
                <el-button size="mini" icon="el-icon-plus" class="add-button" @click="addShenming"/>
            </el-card>
            <el-card class="offer-box">
                <h5>非常欢迎您加入
                    <el-input :style="{width:'calc(' + inp.dbLength() + 'em + 12px)'}" v-model="inp"></el-input>
                    这个大家庭
                </h5>
                <h5>祝您工作愉快!</h5>
                <!--<p class="footer">请扫描二维码</p>-->
                <p class="footer"><el-input :style="{width:'calc(' + inp.dbLength() + 'em + 12px)'}" v-model="inp"></el-input></p>
                <p class="footer"><el-input :style="{width:'calc(' + relativeCompany.dbLength() + 'em + 12px)'}" v-model="relativeCompany"></el-input></p>
                <p class="footer"><el-input :style="{width:'calc(' + TimeData.dbLength() + 'em + 12px)'}" v-model="TimeData"></el-input></p>
            </el-card>
        </div>
        <div style="float: right;margin-top:15px;">
            <el-button type="primary" size="medium" @click="saveClick">创建</el-button>
            <el-button type="primary" size="medium" @click="editClick">更新</el-button>
            <el-button type="primary" size="medium" @click="cancelClick">取消</el-button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
    axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('userName')
    import { GETALLCOMPANIES,GETOFFERCONFIGS,CREATEOFFERCONFIG,UPDATEOFFERCONFIG } from '../../constants/Constants'
    String.prototype.dbLength = function () {
        let str = this, leg = str.length;
        for (let i in str) {
            if (str.hasOwnProperty(i)) {
                const db = str[i].charCodeAt(0).toString(16).length === 4;
                if (db) leg += 1;
            }
        }
        return leg / 2;
    };
    export default {
        data() {
            return {
                isShow:false,
                disable:true,
                description:'',
                preparation:'',
                allCompanies:[],
                currentCompany:'',
                options4: [],
                value7:[],
                list: [],
                loading: false,
                value1: '',
                name: '',
                cl: [],
                sm: [],
                inp: '',
                relativeCompany:'',
                TimeData:'',
            }
        },
        created() {
            this.getCompaniesSelect();
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
                    console.log(this.list)
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
                let self = this;
                this.cl=[]
                this.sm=[]
                let option='?company='+this.currentCompany
                self.url = GETOFFERCONFIGS;
                if(this.currentCompany!=''){
                    self.$axios.get(self.url+option).then((response) => {
                        if(response.data.content!=''){
                            console.log(response)
                            this.isShow=true
                            let desc=response.data.content[0].descriptions
                            for(let i=0;i<desc.length;i++){
                                this.cl.push(desc[i].description)
                            }
                            console.log(this.cl)
                            let pre=response.data.content[0].preparations
                            for(let i=0;i<pre.length;i++){
                                this.sm.push(pre[i].description)
                            }
                            console.log(this.sm)
                            sessionStorage.setItem('offerId',response.data.content[0].id)
                        }else{
                            this.cl=[]
                            this.sm=[]
                            self.$message.error('暂无数据！')
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                }else{
                    this.cl=[]
                    this.sm=[]
                }

            },
            saveClick() {
                let saveData={
                    company: this.currentCompany,
                    descriptionList: this.cl,
                    preparationList: this.sm
                }
                console.log(saveData)
                let self = this;
                self.url = CREATEOFFERCONFIG;
                self.$axios.post(self.url,saveData).then((response) => {
                    console.log(response)
                    if(response.status==200){
                        this.$message({
                            type: 'success',
                            message: '创建成功！'
                        })
                        this.isShow=true
                    }

                }).catch((error) => {
                    console.log(error)
                })
            },
            cancelClick() {
                this.search()
            },
            modifyClick(){
                this.isShow=false
            },
            editClick(){
                let editData={
                    company: this.currentCompany,
                    descriptionList: this.cl,
                    id:sessionStorage.getItem('offerId'),
                    preparationList: this.sm
                }
                console.log(editData)
                let self = this;
                self.url = UPDATEOFFERCONFIG;
                self.$axios.post(self.url,editData).then((response) => {
                    console.log(response)
                    if(response.status==200){
                        this.isShow=true
                        this.$message({
                            type: 'success',
                            message: '更新成功！'
                        })
                    }

                }).catch((error) => {
                    console.log(error)
                })
            },
            removeItem1(index) {
                this.cl.splice(index, 1)
                console.info(this.cl)
            },
            removeItem2(index) {
                this.sm.splice(index, 1)
                console.info(this.sm)
            },
            addCailiao() {
                this.cl.push('')
            },
            addShenming() {
                this.sm.push('')
            }
        }
    }
</script>

<style scoped>
    .remove-button[data-v-3457857d] {
        color: #409EFF!important;
    }
    body{
        margin:0;
    }
    .offer-box {
        box-shadow: unset;
        border-radius: unset;
    }

    .el-card__header {
        color: #333;
    }

    .h-button {
        margin-bottom: 15px;
    }

    h3, h5 {
        text-align: center;
    }

    .el-card__body p.name {
        text-indent: unset;
    }

    p {
        font-size: 14px;
        line-height: 2em;
    }

    .wubi {
        text-align: center;
        margin-top: 15px;
    }

    .el-card__body p, li {
        text-indent: 2em;
    }

    ul {
        list-style-type: decimal;
        font-size: 14px;
        line-height: 2em;
        margin-left: 4em;
    }

    ul li {
        position: relative;
        text-indent: unset;
    }

    .el-card__body .footer {
        text-indent: 0em;
        text-align: center;
    }

    .el-textarea {
        vertical-align: text-top;
    }

    .el-input {
        text-indent: 0em;
    }

    .add-button {
        font-size: 14px;
        margin: 10px 0 0 4em;
    }

    .remove-button {
        cursor: pointer;
        color: #f56c6c;
        padding: 0;
        margin: unset;
        position: absolute;
        left: -3.5em;
        top: 7px;
    }
</style>
<style>
    .offer-box .el-input .el-input__inner, .cailiao .el-input .el-input__inner {
        height: 20px;
        padding: 0 5px;
        border-top: none;
        border-left: none;
        border-right: none;
        border-radius: unset;
    }
    .el-card{
        margin-top:0!important;
    }
    .el-textarea__inner {
        color: #000;
        font-size: 14px!important;
        line-height: 1.5em!important;
        font-family: "Helvetica Neue",Helvetica, "microsoft yahei", arial, STHeiTi, sans-serif!important;
    }
    .el-card__body {
        position: relative;
    }
</style>




