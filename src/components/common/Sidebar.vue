<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon" class="fontFamily sideIcon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import "../.././assets/icon/iconfont.css"
    export default {
        data() {
            return {
                items: [
                    {
                        icon: 'el-icon-yonghuguanli',
                        index: '2',
                        title: '用户管理',
                        subs: [
                            {
                                index: 'basetable',
                                title: 'HR注册'
                            },
                            {
                                index: 'vuetable',
                                title: '猎头注册'
                            },
                            {
                                index: 'sellmange',
                                title: '销售员注册'
                            },
                            {
                                index: 'registermange',
                                title: '管理平台注册'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-qiyeguanli1',
                        index: '3',
                        title: '企业管理',
                        subs: [
                            {
                                index: 'companieslist',
                                title: '企业列表管理'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-suoshuzhiwei',
                        index: '4',
                        title: 'JD管理',
                        subs: [
                            {
                                index: 'jdlist',
                                title: 'JD列表'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-rencaizhongxin',
                        index: '5',
                        title: '人才管理',
                        subs: [
                            {
                                index: 'humanlist',
                                title: '人才列表管理'
                            },
                            {
                                index: 'importresume',
                                title: '简历导入'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-peizhiguanli',
                        index: '6',
                        title: '管理配置',
                        subs: [
                            {
                                index: 'resumeTemplateConfigure',
                                title: '简历模板配置'
                            },
                            {
                                index: 'sendOfferConfigure',
                                title: '电子Offer模板管理配置'
                            }

                        ]
                    },
                    {
                        icon: 'el-icon-news',
                        index: '7',
                        title: '系统消息管理',
                        subs: [
                            {
                                index: 'sendSystemMsage',
                                title: '发送系统消息'
                            },
                            {
                                index: 'SystemMsageManage',
                                title: '系统消息列表管理'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-04',
                        index: '8',
                        title: '报表',
                        subs: [
                            {
                                index: 'companyCountReport',
                                title: '企业统计报表'
                            },
                            {
                                index: 'companyPaymentSettlement',
                                title: '企业结算报表'
                            },
                            {
                                index: 'companyHrCountReport',
                                title: '企业HR统计报表'
                            },
                            {
                                index: 'registerCountReport',
                                title: '注册统计报表'
                            }
                        ]
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
    .sideIcon {
        margin-left: 10px;
        margin-right: 8px;
        vertical-align: text-bottom;
    }
    .el-icon-rencaizhongxin{
        font-size: 22px;
        margin-right:4px!important;
        margin-left:7px!important;
    }
</style>
