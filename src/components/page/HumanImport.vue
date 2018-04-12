<template>
    <div class="content-import">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 人才管理</el-breadcrumb-item>
                <el-breadcrumb-item>简历导入</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="main">
            <uploader :options="options" :autoStart="false" :fileStatusText="fileStatusText"
                      class="uploader-example" ref="up">
                <template slot-scope="props">
                    <uploader-btn class="select-file">选择文件</uploader-btn>
                    <el-button style="margin-left: 10px;" icon="el-icon-delete" size="small" type="primary"
                               @click="clearList">清空列表
                    </el-button>
                    <el-button style="margin-left: 10px;" icon="el-icon-upload" size="small" type="success"
                               @click="startup">开始上传
                    </el-button>
                    <uploader-list></uploader-list>
                </template>
            </uploader>
        </div>
    </div>
</template>

<script>
    import {IMPORT_RESUME} from '../../constants/Constants'
    import axios from 'axios';
    // axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'
    // axios.defaults.headers['X-OperatorToken'] = sessionStorage.getItem('resultMessage')
    export default {
        name: "human-import",
        methods: {
            clearList() {
                var j = 0
                const fileNum = this.$refs.up.uploader.files.length
                for (j = 0; j < fileNum; j++) {
                    this.$refs.up.uploader.files[0].cancel()
                }
            },
            startup() {
                this.$refs.up.uploader.upload()
            }
        },
        data() {
            return {
                options: {
                    target: IMPORT_RESUME,
                    testChunks: false,
                    headers: {
                        'X-OperatorToken': sessionStorage.getItem('resultMessage')
                    }
                },
                fileStatusText: {
                    success: '成功',
                    error: '失败',
                    uploading: '正在上传',
                    paused: '暂停',
                    waiting: '等待上传'
                }
            };
        }
    }
</script>

<style scoped>
    .content-import {
        height: 100%;
    }

    .main {
        height: calc(100% - 25px);
    }
</style>

<style>
    button.select-file {
        width: 80px;
        height: 32px;
        border: none;
        background: #409eff;
        color: white;
        border-radius: 3px;
    }

    button.select-file:hover {
        background: #66b1ff;
    }

    .uploader-example {
        height: 100%;
        min-height: 400px;
        font-size: 12px;
    }

    .uploader-example .uploader-btn {
        margin-right: 4px;
    }

    .uploader-example .uploader-list {
        border: 1px solid #ebeef5;
        margin-top: 15px;
        height: calc(100% - 60px);
        overflow: auto;
        overflow-x: hidden;
        overflow-y: auto;
    }

    i.uploader-file-icon {
        width: 16px;
        height: 16px;
        margin-top: 0;
        margin-rigth: 10px;
        vertical-align: baseline;
    }

    .uploader-example i.uploader-file-icon:before {
        content: "\E614";
        font-size: 16px;
        color: #909399;
        font-family: element-icons !important;
    }

    div.uploader-file-progress {
        background: #67c23a1a;
    }
</style>
