<template>
    <div>
        <div class="select">
            <el-row :gutter="20">
                <el-col :span="8" :offset="8">
                    <el-form ref="form" :model="driftInit" label-width="80px">
                        <el-form-item label="命名空间">
                            <el-input v-model="driftInit.namespace" placeholder="请输入命名空间"/>
                        </el-form-item>
                        <el-form-item label="选择组件">
                            <el-checkbox-group v-model="driftInit.checkedComponents">
                                <el-checkbox v-for="(component, i) in driftInit.components" :label="component" :key="i" :disabled="component !== 'ZooKeeper'">
                                    {{component}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="nextStep" :loading="loading" >下一步</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import driftInitApi from "../../api/drift_init_api";
    import { mapActions } from 'vuex'

    export default {
        name: "Select",

        data() {
            return {
                driftInit: {
                    namespace: "",
                    checkedComponents: [],
                    components: ["ZooKeeper", "Yarn", "HDFS", "HBase", "Hive", "Kafka", "Spark", "Flink"]
                },
                loading: false
            }
        },

        methods: {
            ...mapActions('init', [
                'setSelect'
            ]),

            async nextStep() {
                this.loading = true;
                if (this.driftInit.namespace !== "" && this.driftInit.checkedComponents.length !== 0) {
                    console.log(this.driftInit);
                    let result = await driftInitApi.createDriftInit({
                        namespace: this.driftInit.namespace,
                        components: this.driftInit.checkedComponents
                    });
                    console.log(result);
                    let code = result["code"];
                    if (code === 0) {
                        this.setSelect({
                            currentActive: 1,
                            checkedComponents: this.driftInit.checkedComponents
                        });
                        this.$router.push("/init/config");
                    } else {
                        this.$notify.error({
                            title: '创建错误',
                            message: '请重试'
                        });
                    }
                }
                this.loading = false;
            }
        }
    }
</script>

<style scoped>
    .select {
        padding-top: 30px;
        padding-bottom: 100px;
    }
</style>
