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
            <div class="sendContent">
                <div class="allContent" v-show="showData">
                    <el-card class="offer-box header-top">
                        <h3>录用通知书</h3>
                    </el-card>
                    <el-card class="offer-box content-one">
                        <offer-config-frist v-show="isShowCurrentPart"></offer-config-frist>
                        <div class="data">
                            <span>请您携带以下材料到</span>
                            <input class="curent-input top-input " v-model="currentDepartment" :style="{width:`calc(` + currentDepartment.dbLength() + `em + 12px)`}"/>
                            <span>部</span>
                            <input class="curent-input top-input" style="width:10em;" v-model="currentPerson" :style="{width:`calc(` + currentPerson.dbLength() + `em + 12px)`}"/>
                            <span>处报到，并请于报到前两个工作日邮件通知公司</span>

                            <span>如有任何问题可与</span>
                            <input class="curent-input top-input"  style="width:8em;" v-model="currentPerson" :style="{width:`calc(` + currentPerson.dbLength() + `em + 12px)`}"/>
                            <span>电话或邮件联系。</span><br/>
                            <span>联系电话：</span>
                            <input class="curent-input top-input" v-model="currentPhone" :style="{width:`calc(` + currentPhone.dbLength() + `em + 12px)`}"/>
                            <br/>
                            <span>邮箱地址：</span>
                            <input class="curent-input top-input" v-model="currentMail" :style="{width:`calc(` + currentMail.dbLength() + `em + 12px)`}"/>
                            <div class="top-div" style="display: none;width:100%;height:100%;background:rgba(220,222,226,.1);position: absolute;left:0;top:0;cursor: not-allowed;z-index:999;"></div>
                        </div>
                    </el-card>
                    <el-card class="offer-box content-two">
                        <div slot="header" class="clearfix">
                            <h4>报到时请携带以下材料</h4>
                        </div>
                        <ul class="cailiao">
                            <li v-for="(item, index) in cl">
                                <i class="el-icon-error remove-button" @click="removeItem1(index)"></i>
                                <input  class="currentClass curent-input" v-model="cl[index]"/>
                            </li>
                        </ul>
                        <div class="top-div" style="display: none;width:100%;height:100%;background:rgba(220,222,226,.1);position: absolute;left:0;top:0;cursor: not-allowed;z-index:999;"></div>
                        <el-button size="mini" icon="el-icon-plus" id="addcailiaoButton" class="add-button "/>
                        <div class="wubi">请务必在报到前整理齐全所有资料，以免影响入职手续办理</div>
                    </el-card>
                    <el-card class="offer-box content-two">
                        <div slot="header" class="clearfix">
                            <h4>申明</h4>
                        </div>
                        <ul class="shenming shenming-input">
                            <li v-for="(item, index) in sm">
                                <i class="el-icon-error remove-button" @click="removeItem2(index)"></i>
                                <textarea name="NewsIntro" contenteditable="true" class=" curent-input shenmingTexteara" v-model="sm[index]"></textarea>
                            </li>
                        </ul>
                        <div class="top-div" style="display: none;width:100%;height:100%;background:rgba(220,222,226,.1);position: absolute;left:0;top:0;cursor: not-allowed;z-index:999;"></div>
                        <el-button size="mini" icon="el-icon-plus" id="addShenmingButton" class="add-button  "/>
                    </el-card>
                    <el-card class="offer-box footer-box content-two">
                        <h5>非常欢迎您加入
                            <input class="curent-input" :style="{width:'calc(' + inp.dbLength() + 'em + 12px)'}" v-model="inp">
                            这个大家庭
                        </h5>
                        <h5>祝您工作愉快!</h5>
                        <div class="codeDiv">
                            <h5 class="codeMa">请扫描二维码</h5>
                            <div id="QR"></div>
                        </div>
                        <h5><input class="curent-input" :style="{width:'calc(' + inp.dbLength() + 'em + 12px)'}" v-model="inp"></h5>
                        <h5><input class="curent-input" :style="{width:'calc(' + relativeCompany.dbLength() + 'em + 12px)'}" v-model="relativeCompany"></h5>
                        <h5><input class="curent-input" :style="{width:'calc(' + TimeData.dbLength() + 'em + 12px)'}" v-model="TimeData"></h5>
                    </el-card>
                </div>
            </div>
        </div>
        <div style="float: right;margin-top:15px;">
            <el-button type="primary" size="medium" v-show="isShowSave" @click="saveClick">创建</el-button>
            <el-button type="primary" size="medium" v-show="isShowEdit" @click="editClick">更新</el-button>
            <el-button type="primary" size="medium" v-show="isShowCancel" @click="cancelClick">取消</el-button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import OfferConfigFrist from './offerConfigFrist'
    axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
    axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('resultMessage')
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
        components: {
            OfferConfigFrist
        },
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
                initText:'',
                isShowSave:false,
                isShowEdit:false,
                isShowCancel:false
            }
        },
        created() {
            this.getCompaniesSelect();
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
                            return item.name.toLowerCase()
                                .indexOf(query.toLowerCase()) > -1
                        })
                    }, 100)
                } else {
                    this.options4 = []
                }
            },
            search() {
                let self = this;
                this.cl=[]
                this.sm=[]
                let option='?company='+this.currentCompany
                console.log(this.currentCompany)
                self.url = GETOFFERCONFIGS;
                if(this.currentCompany!=''){
                    self.$axios.get(self.url+option).then((response) => {
                        console.log(response)
                        if(response.data.totalElements!=='0' && response.data.content[0].content!=null){
                            console.log(response)
                            sessionStorage.setItem('offerId',response.data.content[0].id)
                            let getCompanyData=response.data.content[0].content
                            this.currentData=decodeURI(getCompanyData)
                            console.log(this.currentData)
                            $('.sendContent').empty()
                            $('.sendContent').html(this.currentData)
                            this.isShowEdit=true
                            this.isShowCancel=true
                            $('.top-div').css('display','block')
                            var areaLength=$('.shenming-input li textarea')
                            for(let i=0;i<areaLength.length;i++){
                                console.log(areaLength)
                                areaLength[i].innerHTML=areaLength[i].attributes[4].value
                            }
                            changeContent()
                            deletcurrentInput()
                            getInputLength()
                            $("#addcailiaoButton").live("click", function(){
                                $('.cailiao').append('<li style="position: relative;text-indent: unset;">\n' +
                                    '                                <i style="cursor: pointer;color: #409EFF;padding: 0;margin: unset;position: absolute;left: -3.5em;top: 7px;" class="el-icon-error remove-button"></i>\n' +
                                    '                                <input  style="border:1px solid transparent;border-bottom-color: #c0c4cc;outline: none;padding:0.1rem 0.2rem;width:98%;" class="currentClass curent-input"/>\n' +
                                    '                            </li>');
                                changeContent();
                            });

                            $("#addShenmingButton").live("click", function(){
                                $('.shenming').append('<li style="position: relative;text-indent: unset;">\n' +
                                    '                                <i style="cursor: pointer;color: #409EFF;padding: 0;margin: unset;position: absolute;left: -3.5em;top: 7px;" class="el-icon-error remove-button" @click="removeItem2(index)"></i>\n' +
                                    '                                <textarea style="width:100%;border-color: #c0c4cc;outline: none;padding:0.1rem 0.2rem;font-size: 14px;" name="NewsIntro" contenteditable="true" class=" curent-input shenmingTexteara" ></textarea>\n' +
                                    '                            </li>');
                                changeContent();
                            });
                            function deletcurrentInput() {
                                $('.remove-button').live("click",function () {
                                    $(this).parent('li').remove()
                                });
                            }
                            function changeContent() {
                                $('.curent-input').on('blur',function(){
                                    $(this).attr('value',$(this).val())
                                })
                            }
                            function getInputLength() {
                                let brr=$('.top-input')
                                var testLength
                                brr.each(function(){
                                    testLength=$(this).attr('value').length
                                    $(this).css('width', testLength*14 + 'px')
                                });
                            }
                            $('.shemnming li textarea').addClass('curent-input')
                        }else{
                            console.log("没有数据！")
                            this.cl=[]
                            this.sm=[]
                            $('.curent-input').val('')
                            $('.top-div').css('display','none')
                            this.$message({
                                showClose: true,
                                message: '暂无数据,可创建！',
                                type: 'warning'
                            });
                            this.isShowSave=true;
                            this.isShowCancel=true;
                            this.isShowEdit=false
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                }else{
                    this.cl=[]
                    this.sm=[]
                }
            },
            changeValue(value,id){
                console.log(value,id)
                $(id).attr('value',value)
            },
            saveClick() {
                let input1 = $('.curent-input')
                console.log(input1)
                for(let i=0;i<input1.length;i++){
                    $(input1[i]).attr("value", input1[i].value);
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
                        $('.top-div').css('display','block')
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            cancelClick() {
                this.search()
            },
            modifyClick(){
                $('.top-div').css('display','none')
            },
            editClick(){
                this.allContent=''
                let input1 = $('.curent-input')
                console.log(input1)
                for(let i=0;i<input1.length;i++){
                    $(input1[i]).attr("value", input1[i]._value);
                }
                this.allContent=$(".sendContent").html()
                console.log(this.allContent);
                let str = encodeURI(this.allContent)
                let editData={
                    company: this.currentCompany,
                    content: str,
                    id: sessionStorage.getItem('offerId')
                }
                console.log('htmljjj')
                console.log($('textarea').html)
                console.log(editData)
                let self = this;
                self.url = UPDATEOFFERCONFIG;
                self.$axios.post(self.url,editData).then((response) => {
                    console.log(response)
                    if(response.status==200){
                        $('.top-div').css('display','block')
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
                console.log(self.cl)
                $("#addcailiaoButton").live("click", function(){
                    console.log(self.cl)
                    self.cl.push('')
                });
            },
            addShenming() {
                let self = this;
                this.sm=[];
                console.log($('.shenming li'))
                $("#addShenmingButton").live("click", function(){
                    $('textarea').addClass('curent-input')
                    this.sm=$('.shenming li')
                    console.log(self.sm)
                    self.sm.push('')
                })
            }
        }
    }
</script>

<style scoped>
    #QR{
        width:auto;
        height: auto;
        margin:0.2rem auto;
    }
    input{
        border:1px solid transparent;
        border-bottom-color: #c0c4cc;
        outline: none;
        padding:0.1rem 0.2rem;
        min-width: 0.56rem;
    }
    .cailiao input{
        width: 98%;
    }
    textarea{
      border-color: #c0c4cc;
      outline: none;
      padding:0.1rem 0.2rem;
      min-width: 0.56rem;
      }
    .shenming-input ul li input{
        max-width: 100%;
        flex-wrap: wrap;
    }
    .shenmingTexteara{
        width:100%;
        vertical-align: center;
        font-family: "微软雅黑";
        font-size: 14px;
    }
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
        /*color: #f56c6c;*/
        padding: 0;
        margin: unset;
        position: absolute;
        left: -3.5em;
        top: 7px;
    }
    .codeDiv{
        width:auto;
        height: auto;
        font-size: 0.83rem;
    }
    .top-div{
        width:100%;
        height:100%;
        background: pink;
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
    textarea{
        font-family: "微软雅黑";
        resize:none;
    }
</style>




