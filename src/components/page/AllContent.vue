<template>
    <div class="allContent" v-show="showData">
        <el-card class="offer-box">
            <h3>录用通知书</h3>
        </el-card>
        <el-card class="offer-box">
            <offer-config-frist v-show="isShowCurrentPart"></offer-config-frist>
            <div class="data">
                <span>请您携带以下材料到</span>
                <!--<input class='el-input__inner' type="text"/>-->
                <el-input v-model="currentDepartment" :style="{width:`calc(` + currentDepartment.dbLength() + `em + 12px)`}"/>
                <span>部</span>
                <el-input style="width:10em;" v-model="currentPerson" :style="{width:`calc(` + currentPerson.dbLength() + `em + 12px)`}"/>
                <span>处报到，并请于报到前两个工作日邮件通知公司</span><br/>

                <span>如有任何问题可与</span>
                <el-input style="width:8em;" v-model="currentPerson" :style="{width:`calc(` + currentPerson.dbLength() + `em + 12px)`}"/>
                <span>电话或邮件联系</span><br/>
                <span>联系电话：</span>
                <el-input style="min-width: 117px;" v-model="currentPhone" :style="{width:`calc(` + currentPhone.dbLength() + `em + 12px)`}"/>
                <span>邮箱地址：</span>
                <el-input style="min-width: 180px;" v-model="currentMail" :style="{width:`calc(` + currentMail.dbLength() + `em + 12px)`}"/>
                <div class="top-div" style="display: none;width:100%;height:100%;background:rgba(220,222,226,.1);position: absolute;left:0;top:0;cursor: not-allowed;z-index:999;"></div>
            </div>
        </el-card>
        <el-card class="offer-box">
            <div slot="header" class="clearfix">
                <h4>报到时请携带以下材料</h4>
            </div>
            <ul class="cailiao">
                <li v-for="(item, index) in cl">
                    <i class="el-icon-error remove-button" @click="removeItem1(index)"></i>
                    <el-input class="currentClass" v-model="cl[index]"/>
                </li>
            </ul>
            <div class="top-div" style="display: none;width:100%;height:100%;background:rgba(220,222,226,.1);position: absolute;left:0;top:0;cursor: not-allowed;z-index:999;"></div>
            <el-button size="mini" icon="el-icon-plus" id="addcailiaoButton" class="add-button "/>
            <div class="wubi">请务必在报到前整理齐全所有资料，以免影响入职手续办理</div>
        </el-card>
        <el-card class="offer-box">
            <div slot="header" class="clearfix">
                <h4>申明</h4>
            </div>
            <ul class="shenming">
                <li v-for="(item, index) in sm">
                    <i class="el-icon-error remove-button" @click="removeItem2(index)"></i>
                    <el-input autosize  style="width:100%;" resize="none" v-model="sm[index]"/>
                </li>
            </ul>
            <div class="top-div" style="display: none;width:100%;height:100%;background:rgba(220,222,226,.1);position: absolute;left:0;top:0;cursor: not-allowed;z-index:999;"></div>
            <el-button size="mini" icon="el-icon-plus" id="addShenmingButton" class="add-button  "/>
        </el-card>
        <el-card class="offer-box footer-box">
            <h5>非常欢迎您加入
                <el-input :style="{width:'calc(' + inp.dbLength() + 'em + 12px)'}" v-model="inp"></el-input>
                这个大家庭
            </h5>
            <h5>祝您工作愉快!</h5>
            <!--<p class="footer">请扫描二维码</p>-->
            <el-input :style="{width:'calc(' + inp.dbLength() + 'em + 12px)'}" v-model="inp"></el-input><br/>
            <el-input :style="{width:'calc(' + relativeCompany.dbLength() + 'em + 12px)'}" v-model="relativeCompany"></el-input><br/>
            <el-input :style="{width:'calc(' + TimeData.dbLength() + 'em + 12px)'}" v-model="TimeData"></el-input>
        </el-card>
    </div>
</template>

<script>
    import axios from 'axios';
    import OfferConfigFrist from './OfferConfigFrist'
    axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
    axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('resultMessage')
    import { CREATEOFFERCONFIG,UPDATEOFFERCONFIG } from '../../constants/Constants'
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
        components: {OfferConfigFrist},
        data() {
            return {
                showData:true,
                isShowCurrentPart:false,
                currentPerson:'',
                currentPhone:'',
                currentDepartment:'',
                currentMail:'',
                isShowWriteText:false,
                textarea3: '',
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
                cailiaoContent:'',
                shengmingContent:'',
                allContent:'',
                currentData:'',
                initText:''
            }
        },
        created() {
        },
        mounted(){
            this.addShenming()
            this.addCailiao()
        },
        updated(){
            this.list = this.allCompanies.map(item => {
                return { id:item.id, name:item.name }
            })
        },
        methods: {
            saveClick() {
                let input1 = $('.el-input__inner')
                console.log(input1)
                for(let i=0;i<input1.length;i++){
                    $(input1[i]).attr("value", input1[i].value);
                }
                let input2 = $('.el-textarea__inner')
                console.log(input2)
                for(let i=0;i<input2.length;i++){
                    $(input2[i]).attr("value", input2[i].value);
                }
                this.allContent=$(".sendContent").html()
                console.log(this.allContent);
                let str = encodeURI(this.allContent)
                let saveData={
                    company: this.currentCompany,
                    content: str
                }
                console.log(saveData)
                let self = this;
                self.url = CREATEOFFERCONFIG;
                self.$axios.post(self.url,saveData).then((response) => {
                    console.log(response)
                    if(response.status==200){
                        self.$message({
                            type: 'success',
                            message: '创建成功！'
                        })
                        self.isShow=true
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            cancelClick() {
                this.search()
            },
            modifyClick(){
                this.addCailiao2()
                // this.addShenming()
                // this.showData=true
                // this.isShow=false
            },
            addCailiao2(){
                $('#addcailiaoButton').click(function(){
                    $('.cailiao').appendChild('<li>\n' +
                        '                                <i class="el-icon-error remove-button" @click="removeItem1(index)"></i>\n' +
                        '                                <el-input class="currentClass" v-model="cl[index]"/>\n' +
                        '                            </li>')
                })
            },
            editClick(){
                let input1 = $('.el-input__inner')
                console.log(input1)
                for(let i=0;i<input1.length;i++){
                    $(input1[i]).attr("value", input1[i].value);
                }
                let input2 = $('.el-textarea__inner')
                console.log(input2)
                for(let i=0;i<input2.length;i++){
                    $(input2[i]).attr("value", input2[i].value);
                }
                this.allContent=$(".sendContent").html()
                console.log(this.allContent);
                let str = encodeURI(this.allContent)
                let editData={
                    company: this.currentCompany,
                    content: str,
                    id: sessionStorage.getItem('offerId')
                }
                console.log(editData)
                console.log(str)
                let self = this;
                self.url = UPDATEOFFERCONFIG;
                self.$axios.post(self.url,editData).then((response) => {
                    console.log(response)
                    if(response.status==200){
                        self.isShow=true
                        self.$message({
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
                let self = this;
                $('#addcailiaoButton').click(function(){
                    self.cl.push('')
                })
            },
            addShenming() {
                let self = this;
                $('#addShenmingButton').click(function () {
                    self.sm.push('')
                })
            }
        }
    }
</script>

<style scoped>
    .info{
        border-radius: 10px;
        line-height: 20px;
        padding: 10px;
        margin: 10px;
        background-color: #ffffff;
    }
    .allContent{
        width:100%;
        height:auto;
    }
    .remove-button{
        color: #409EFF!important;
    }
    body{
        margin:0;
    }
    .offer-box {
        box-shadow: unset;
        border-radius: unset;
    }

    .footer-box{
        text-align: center;
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

    .data{
        font-size: 14px;
        line-height: 2em;
        padding:0 5px;
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
    .el-input__inner {
        /*font-weight: 600;*/
        color: #000000;
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




