import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/basetable',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                // {
                //     path: '/',
                //     component: resolve => require(['../components/page/Readme.vue'], resolve)
                // },
                {
                    path: '/',
                    component: resolve => require(['../components/page/HR.vue'], resolve)
                },
                {
                    path: '/vuetable',
                    component: resolve => require(['../components/page/HeadHunter.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/sellmange',
                    component: resolve => require(['../components/page/Salesperson.vue'], resolve)    // 销售注册
                },
                {
                    path: '/registermange',
                    component: resolve => require(['../components/page/ManagementPlatForm.vue'], resolve)    // 管理平台
                },
                {
                    path: '/companieslist',
                    component: resolve => require(['../components/page/OperatorGetCompanies.vue'], resolve)    // 销售注册
                },
                {
                    path: '/changehrmanager',
                    component: resolve => require(['../components/page/ChangeHrManager.vue'], resolve)    // 管理平台
                },
                {
                    path: '/baseform',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve)
                },
                {
                    path: '/vueeditor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve)    // Vue-Quill-Editor组件
                },
                {
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve)     // Vue-Quill-Editor组件
                },
                {
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve)       // Vue-Core-Image-Upload组件
                },
                {
                    path: '/basecharts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve)   // vue-schart组件
                },
                {
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve)    // 拖拽列表组件
                },
                {
                    path: '/jdlist',
                    component: resolve => require(['../components/page/JobList.vue'], resolve)   //JD列表
                },
                {
                    path: '/job',
                    component: resolve => require(['../components/page/JobDetail.vue'], resolve)   //JD详细信息
                },
                {
                    path: '/humanlist',
                    component: resolve => require(['../components/page/HumanList.vue'], resolve)   //简历列表
                },
                {
                    path: '/humandetail',
                    component: resolve => require(['../components/page/HumanDetail.vue'], resolve)   //简历详情
                },
                {
                    path: '/humanedit',
                    component: resolve => require(['../components/page/HumanEdit.vue'], resolve)   //编辑简历
                },
                {
                    path: '/importresume',
                    component: resolve => require(['../components/page/HumanImport.vue'], resolve)   //编辑简历
                },
                {
                    path: '/sendSystemMsage',
                    component: resolve => require(['../components/page/sendSystemMsage.vue'], resolve)   //简历详情
                },
                {
                    path: '/SystemMsageManage',
                    component: resolve => require(['../components/page/SystemMsageManage.vue'], resolve)   //编辑简历
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
