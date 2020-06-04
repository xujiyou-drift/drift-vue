<template>
    <div>
        <div class="config">
            <el-row :gutter="20">
                <el-col :span="8" :offset="8">
                    <h3>ZooKeeper：</h3>
                    <el-form ref="form" :model="zookeeper" label-width="100px">
                        <el-form-item label="实例数量">
                            <el-input v-model="zookeeper.size" placeholder="请输入实例数量"/>
                        </el-form-item>
                        <el-form-item label="最小实例数量">
                            <el-input v-model="zookeeper.minSize" placeholder="用于在重启时也能保持服务"/>
                        </el-form-item>
                        <el-form-item label="客户端端口">
                            <el-input v-model="zookeeper.clientPort" placeholder="请输入客户端端口"/>
                        </el-form-item>
                        <el-form-item label="选举端口">
                            <el-input v-model="zookeeper.leaderPort" placeholder="请输入选举端口"/>
                        </el-form-item>
                        <el-form-item label="内部端口">
                            <el-input v-model="zookeeper.insidePort" placeholder="请输入内部端口"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="nextStep" :loading="loading">下一步</el-button>
                            <el-button @click="prevStep">上一步</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'

    export default {
        name: "Config",

        data() {
            return {
                zookeeper: {
                    size: 3,
                    minSize: 1,
                    clientPort: 2181,
                    leaderPort: 3888,
                    insidePort: 2888,
                },
                loading: false,
                nextPath: "/init/complete",
                prevPath: "/init/pvc"
            }
        },

        mounted() {
            console.log(this.checkedComponents);
        },

        computed: {
            ...mapState('init', {
                checkedComponents: 'checkedComponents'
            })
        },

        methods: {
            ...mapActions('init', [
                'setAction'
            ]),

            nextStep() {

            },

            prevStep() {
                this.setAction({
                    currentActive: 1
                });
                this.$router.push(this.prevPath);
            },
        }
    }
</script>

<style scoped>
    .config {
        padding-top: 30px;
        padding-bottom: 100px;
    }
</style>
