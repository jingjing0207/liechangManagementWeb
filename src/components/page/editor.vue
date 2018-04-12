<template>
    <div class="components-container">
        <button @click="getUEContent()">获取内容</button>
        <button @click="getUEContentTxt()">获取无文本内容</button>
        <div class="editor-container">
            <UE :defaultMsg=defaultMsg :config=config :id=ue1 ref="ue"></UE>
            <UE :defaultMsg=defaultMsg :config=config :id=ue2 ref="ue2"></UE>
        </div>
    </div>
</template>
<style>
    .info{
        border-radius: 10px;
        line-height: 20px;
        padding: 10px;
        margin: 10px;
        background-color: #ffffff;
    }
</style>
<script>
    import UE from '.././common/ue/ue';
    export default {
        components: {UE},
        data() {
            return {
                defaultMsg: '<ul><li>身份证原件及复印件1份</li></ul>',
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 350
                },
                ue1: "ue1", // 不同编辑器必须不同的id
                ue2: "ue2"
            }
        },
        methods: {
            getUEContent() {
                let content = this.$refs.ue.getUEContent(); // 调用子组件方法
                this.$notify({
                    title: '获取成功，可在控制台查看！',
                    message: content,
                    type: 'success'
                });
                console.log(content)
            },
            getUEContentTxt() {
                let content = this.$refs.ue.getUEContentTxt(); // 调用子组件方法
                this.$notify({
                    title: '获取成功，可在控制台查看！',
                    message: content,
                    type: 'success'
                });
                console.log(content)
            }
        }
    };
</script>



