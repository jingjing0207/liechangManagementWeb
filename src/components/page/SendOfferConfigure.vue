<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 管理配置</el-breadcrumb-item>
                <el-breadcrumb-item>电子Offer模板管理配置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <div class="h-button">
                <el-input size="medium" placeholder="搜索公司名称" style="width:300px;"/>
                <el-button type="primary" size="medium" icon="el-icon-search" @click="search">查询</el-button>
                <div style="float: right">
                    <el-button plain type="primary" size="medium" @click="editClick">修改</el-button>
                    <el-button plain type="primary" size="medium" @click="saveClick">保存</el-button>
                    <el-button plain type="primary" size="medium" @click="cancelClick">取消</el-button>
                </div>
            </div>
            <el-card class="offer-box">
                <div slot="header" class="clearfix">
                    <h3>录用通知书</h3>
                </div>
                <div>
                    <p>请您携带以下材料到人力资源部
                        <el-input style="width:8em;"/>
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
                <el-button size="mini" icon="el-icon-plus" class="add-button" @click="addShenming"/>
            </el-card>
            <el-card class="offer-box">
                <h5>非常欢迎您加入<el-input :style="{width:'calc(' + inp.dbLength() + 'em + 12px)'}" v-model="inp"></el-input>这个大家庭</h5>
                <h5>祝您工作愉快</h5>
                <p class="footer">请扫描二维码</p>
                <p class="footer">中软国际科技服务有限公司</p>
                <p class="footer">人力资源部</p>
                <p class="footer">二零一七年十二月十三日</p>
            </el-card>
        </div>
    </div>
</template>

<script>
    String.prototype.dbLength = function() {
        let str = this, leg = str.length;
        for (let i in str) {
            if (str.hasOwnProperty(i)) {
                const db = str[i].charCodeAt(0).toString(16).length === 4;
                if (db) leg += 1;
            }
        }
        return leg/2;
    };
    export default {
        data() {
            return {
                value1: '',
                name: '',
                cl: ["学历学位证明原件及复印件2份", "身份证原件及复印件6份", "蓝底一寸照片3张", "个人具备资质认证书复印件1份"],
                sm: [
                    '如您向公司提供任何虚假资料，一经发现，公司有权单方面解除此录用通知书，个人不得向公司提出任何补偿条件',
                    '薪酬保密制度是公司管理的重要原则，请不要向别人打探薪酬情况，也不要告诉别人您的薪酬情况，如果违反薪酬保密制度，公司有权单方面解除此录用通知书，个人不得向公司提出任何补偿条件'
                ],
                inp: '中软国际科技服务有限公司',
            }
        },
        methods: {
            search() {

            },
            saveClick() {

            },
            cancelClick() {

            },
            removeItem1(index) {
                this.cl.splice(index,1)
                console.info(this.cl)
            },
            removeItem2(index) {
                this.sm.splice(index,1)
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
        width: 800px;
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
</style>
