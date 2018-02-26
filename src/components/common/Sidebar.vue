<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
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
                        icon: 'el-icon-LIECHANG-yonghuguanli1',
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
                        icon: 'el-icon-LIECHANG-qiyeguanli1',
                        index: '3',
                        title: '企业管理',
                        subs: [
                            {
                                index: 'companieslist',
                                title: '企业列表管理'
                            },
                            {
                                index: 'changehrmanager',
                                title: '企业管理员账号密码管理'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-LIECHANG-qiyeguanli1',
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
                        icon: 'el-icon-date',
                        index: '5',
                        title: '人才管理',
                        subs: [
                            {
                                index: 'humanlist',
                                title: '人才列表管理'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-date',
                        index: '6',
                        title: '表单',
                        subs: [
                            {
                                index: 'baseform',
                                title: '基本表单'
                            },
                            {
                                index: 'vueeditor',
                                title: '编辑器'
                            },
                            {
                                index: 'markdown',
                                title: 'markdown'
                            },
                            {
                                index: 'upload',
                                title: '文件上传'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-star-on',
                        index: 'basecharts',
                        title: '图表'
                    },
                    {
                        icon: 'el-icon-upload2',
                        index: 'drag',
                        title: '拖拽'
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
</style>
