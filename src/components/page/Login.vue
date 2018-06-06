<template>
    <div class="login-wrap">
        <div class="ms-title">猎场后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:red;" v-show="successorfail">{{failMessag}}</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import { LOGINURL } from '../../constants/Constants'
    import axios from 'axios'
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                headers: {
                    contentType: 'application/json; charset=UTF-8'
                },
                failMessag:'用户名或密码有误，请重新输入！',
                successorfail:false
            }
        },
        methods: {
            loginfailMoudal() {
                this.successorfail = true;
            },
            submitForm() {
                let userForm={
                    password:this.ruleForm.password,
                    username:this.ruleForm.username
                }
                axios.post(LOGINURL,userForm,this.headers)
                    .then((response) => {
                        console.log(response);
                        if (response.status === 200) {
                            sessionStorage.setItem('resultMessage', response.data.token)//存如登录的信息
                            sessionStorage.setItem('userName',this.ruleForm.username)
                            this.$router.push({path: '/basetable'})
                        } else if (response.data.resultCode === 1) {
                            console.log('error submit!!');
                            return false;
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                        this.loginfailMoudal()
                    })
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background: #0857a9!important;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>
