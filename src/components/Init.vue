<template>
    <div>
        <div class="step">
            <el-row :gutter="20">
                <el-col :span="8" :offset="8">
                    <el-steps :space="200" :active="0" finish-status="success" align-center>
                        <el-step title="选择组件"></el-step>
                        <el-step title="配置组件"></el-step>
                        <el-step title="完成"></el-step>
                    </el-steps>
                </el-col>
            </el-row>
        </div>
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: "Init",

        mounted() {
            console.log(this.$route.path)
        }
    }
</script>

<style scoped>
    .step {
        text-align: center;
        padding-top: 60px;
        padding-bottom: 24px;
        border-bottom: 1px solid #eee;
    }
</style>
