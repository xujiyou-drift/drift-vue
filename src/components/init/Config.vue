<template>
    <div>
        <div class="config">
            <el-row :gutter="20">
                <el-col :span="8" :offset="8">
                    <el-form ref="form" :model="zookeeper" label-width="100px">
                        <div>
                            <h3>ZooKeeper：</h3>
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
                        </div>
                        <div v-if="checkedComponents.indexOf('Kafka') !== -1">
                            <h3>Kafka：</h3>
                            <el-form-item label="外部访问地址">
                                <el-input v-model="kafka.externalAddress" placeholder="可以是某个宿主机的主机名"/>
                            </el-form-item>
                            <el-form-item label="实例数量">
                                <el-input v-model="kafka.size" placeholder="请输入实例数量"/>
                            </el-form-item>
                            <el-form-item label="最小实例数量">
                                <el-input v-model="kafka.minSize" placeholder="用于在重启时也能保持服务"/>
                            </el-form-item>
                            <el-form-item label="客户端端口">
                                <el-input v-model="kafka.clientPort" placeholder="请输入客户端端口"/>
                            </el-form-item>
                            <el-form-item label="数据目录">
                                <el-input v-model="kafka.dataDir" placeholder="请输入数据目录"/>
                            </el-form-item>
                        </div>
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
    import kafkaApi from "../../api/frist/kafka_api";
    import driftInitApi from "../../api/frist/drift_init_api";
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
                kafka: {
                    externalAddress: "",
                    size: 3,
                    minSize: 1,
                    clientPort: 9092,
                    dataDir: "/var/lib/kafka",
                    zookeeperAddress: ""
                },
                loading: false,
                nextPath: "/init/complete",
                prevPath: "/init/pvc"
            }
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
                let zkCode = await this.createZooKeeper();
                if (zkCode !== 0) {
                    return;
                }

                if (this.checkedComponents.indexOf('Kafka') !== -1) {
                    let kafkaCode = await this.createKafka();
                    if (kafkaCode !== 0) {
                        return;
                    }
                }

                let result = await driftInitApi.completeConfig();
                console.log(result);
                let code = result["code"];
                if (code === 0) {
                    this.setAction({
                        currentActive: 4
                    });
                    this.$router.push(this.nextPath);
                } else {
                    this.$notify.error({
                        title: '错误',
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

            async createZooKeeper() {
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
                if (code !== 0) {
                    this.$notify.error({
                        title: '错误',
                        message: '创建 ZooKeeper 错误，请重试'
                    });
                }
                return code;
            },

            async createKafka() {
                if (this.pvc.Kafka !== undefined) {
                    this.kafka.storageClass = this.pvc.Kafka.storageClass;
                    if ((this.pvc.Kafka.storage + "").endsWith("Gi")) {
                        this.kafka.storage = this.pvc.Kafka.storage;
                    } else {
                        this.kafka.storage = this.pvc.Kafka.storage + "Gi";
                    }
                }
                this.kafka.namespace = this.namespace;

                for (let i = 0; i < this.zookeeper.size; i++) {
                    let host = "zookeeper-cluster-" + i + ".zookeeper-cluster-headless-service"
                    this.kafka.zookeeperAddress += host + ","
                }
                this.kafka.zookeeperAddress = this.kafka.zookeeperAddress.substring(0, this.kafka.zookeeperAddress.lastIndexOf(','));
                this.kafka.zookeeperAddress += "/kafka";

                let result = await kafkaApi.createKafka(this.kafka);
                console.log(result);
                let code = result["code"];
                if (code !== 0) {
                    this.$notify.error({
                        title: '错误',
                        message: '创建 ZooKeeper 错误，请重试'
                    });
                }
                return code;
            }
        }
    }
</script>

<style scoped>
    .config {
        padding-top: 30px;
        padding-bottom: 100px;
    }
</style>
