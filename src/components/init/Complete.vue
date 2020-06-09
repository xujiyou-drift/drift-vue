<template>
    <div class="complete">
        <h1>完成！！！</h1>
        <br/> <br/> <br/>
        <el-button type="primary" @click="complete" :loading="loading">确定</el-button>
    </div>
</template>

<script>
    import driftInitApi from "../../api/drift_init_api";
    import { mapActions } from 'vuex'

    export default {
        name: "Complete",

        data () {
            return {
                loading: false
            }
        },

        methods: {
            ...mapActions('init', [
                'setComplete'
            ]),

            async complete() {
                this.loading = true;
                let result = await driftInitApi.complete();
                console.log(result);
                let code = result["code"];
                if (code === 0) {
                    this.setComplete({
                        "complete": true
                    });
                    this.$router.push("/home");
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: '请重试'
                    });
                }
                this.loading = false;
            }
        }
    }
</script>

<style scoped>
    .complete {
        text-align: center;
    }
</style>
