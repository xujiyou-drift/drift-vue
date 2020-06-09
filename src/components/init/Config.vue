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
                        <el-form-item label="监控端口">
                            <el-input v-model="zookeeper.metricsPort" placeholder="请输入监控端口"/>
                        </el-form-item>
                        <el-form-item label="内部端口">
                            <el-input v-model="zookeeper.serverPort" placeholder="请输入内部端口"/>
                        </el-form-item>
                        <el-form-item label="选举端口">
                            <el-input v-model="zookeeper.leaderPort" placeholder="请输入选举端口"/>
                        </el-form-item>
                        <el-form-item label="数据目录">
                            <el-input v-model="zookeeper.dataDir" placeholder="请输入数据目录"/>
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
    import zookeeperApi from "../../api/frist/zookeeper_api";
    import { mapState, mapActions } from 'vuex'

    export default {
        name: "Config",

        data() {
            return {
                zookeeper: {
                    namespace: "",
                    size: 3,
                    minSize: 1,
                    clientPort: 2181,
                    metricsPort: 7000,
                    serverPort: 2888,
                    leaderPort: 3888,
                    pvcName: "",
                    dataDir: "/var/lib/zookeeper",
                    storageClass: "",
                    storage: "",
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
                namespace: 'namespace',
                checkedComponents: 'checkedComponents',
                pvc: 'pvc'
            })
        },

        methods: {
            ...mapActions('init', [
                'setAction'
            ]),

            async nextStep() {
                this.loading = true;
                if (this.pvc.ZooKeeper !== undefined) {
                    this.zookeeper.storageClass = this.pvc.ZooKeeper.storageClass;
                    if ((this.pvc.ZooKeeper.storage + "").endsWith("Gi")) {
                        this.zookeeper.storage = this.pvc.ZooKeeper.storage;
                    } else {
                        this.zookeeper.storage = this.pvc.ZooKeeper.storage + "Gi";
                    }
                }
                this.zookeeper.namespace = this.namespace;
                let result = await zookeeperApi.createZookeeper(this.zookeeper);
                console.log(result);
                let code = result["code"];
                if (code === 0) {
                    this.setAction({
                        currentActive: 4
                    });
                    this.$router.push(this.nextPath);
                } else {
                    this.$notify.error({
                        title: '创建错误',
                        message: '请重试'
                    });
                }
                this.loading = false;
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
