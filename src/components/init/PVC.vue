<template>
    <div>
        <div class="pvc">
            <el-row :gutter="20">
                <el-col :span="8" :offset="8">
                    <el-form ref="form" label-width="100px">
                        <div>
                            <h3>为 ZooKeeper 创建 PVC：</h3>
                            <el-form-item label="StorageClass">
                                <el-input v-model="pvc.ZooKeeper.storageClass" placeholder="请输入储存类"/>
                            </el-form-item>
                            <el-form-item label="容量">
                                <el-input v-model="pvc.ZooKeeper.storage" placeholder="请输入储存容量" type="number">
                                    <template slot="append">Gi</template>
                                </el-input>
                            </el-form-item>
                        </div>
                        <div v-if="checkedComponents.indexOf('Kafka') !== -1">
                            <h3>为 Kafka 创建 PVC：</h3>
                            <el-form-item label="StorageClass">
                                <el-input v-model="pvc.Kafka.storageClass" placeholder="请输入储存类"/>
                            </el-form-item>
                            <el-form-item label="容量">
                                <el-input v-model="pvc.Kafka.storage" placeholder="请输入储存容量" type="number">
                                    <template slot="append">Gi</template>
                                </el-input>
                            </el-form-item>
                        </div>
                        <el-form-item>
                            <el-button type="primary" @click="nextStep" :loading="loading" >下一步</el-button>
                            <el-button @click="prevStep">上一步</el-button>
                            <el-button @click="jump">跳过</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import driftInitApi from "../../api/frist/drift_init_api";
    import { mapActions, mapState } from 'vuex'

    export default {
        name: "PVC",

        data () {
            return {
                pvc: {
                    ZooKeeper: {
                        storageClass: "",
                        storage: 10,
                    },
                    Kafka: {
                        storageClass: "",
                        storage: 10,
                    },
                },
                loading: false,
                nextPath: "/init/config",
                prevPath: "/init/select"
            }
        },

        created() {
            if (this.statePvc !== undefined) {
                Object.keys(this.statePvc).forEach((key) => {
                    let newStorage;
                    if (this.statePvc[key].storage.endsWith("Gi")) {
                        newStorage = this.statePvc[key].storage.replace("Gi", "");
                    } else {
                        newStorage = this.statePvc[key].storage;
                    }

                    this.pvc[key] = {
                        storageClass: this.statePvc[key].storageClass,
                        storage: newStorage
                    }
                });
            }
        },

        computed: {
            ...mapState('init', {
                statePvc: 'pvc',
                checkedComponents: 'checkedComponents'
            })
        },

        methods: {
            ...mapActions('init', [
                'setAction',
                'setPvc'
            ]),

            async nextStep() {
                if (this.pvc.ZooKeeper.storageClass === "" || this.pvc.ZooKeeper.storage == 0) {
                    this.$notify.error({
                        title: '创建错误',
                        message: '为 ZooKeeper 创建 PVC 需要输入必要信息'
                    });
                    return
                }
                if (this.checkedComponents.indexOf('Kafka') !== -1) {
                    if (this.pvc.Kafka.storageClass === "" || this.pvc.Kafka.storage == 0) {
                        this.$notify.error({
                            title: '创建错误',
                            message: '为 Kafka 创建 PVC 需要输入必要信息'
                        });
                        return
                    }
                }

                this.loading = true;
                let record = {
                    currentPath: this.nextPath,
                    active: 2,
                    pvc: {
                        ZooKeeper: {
                            storageClass: this.pvc.ZooKeeper.storageClass,
                            storage: this.pvc.ZooKeeper.storage + "Gi",
                        }
                    }
                };
                if (this.checkedComponents.indexOf('Kafka') !== -1) {
                    record.pvc["Kafka"] = {
                        storageClass: this.pvc.Kafka.storageClass,
                        storage: this.pvc.Kafka.storage + "Gi",
                    }
                }

                await this.pushData(record);
                this.loading = false;
            },

            prevStep() {
                this.setAction({
                    currentActive: 0
                });
                this.$router.push(this.prevPath);
            },

            jump() {
                let record = {
                    currentPath: this.nextPath,
                    active: 2,
                };
                this.$confirm('如果不创建PVC，在容器销毁后，数据将会丢失。此处仅用于测试', '跳过PVC创建', {
                    confirmButtonText: '确定跳过',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(async () => {
                    await this.pushData(record);
                }).catch(() => {

                });
            },

            async pushData(record) {
                let result = await driftInitApi.recordPvc(record);
                console.log(result);
                let code = result["code"];
                if (code === 0) {
                    this.setAction({
                        currentActive: 2
                    });
                    this.setPvc({
                        pvc: this.pvc
                    });
                    this.$router.push(this.nextPath);
                } else {
                    this.$notify.error({
                        title: '创建错误',
                        message: '请重试'
                    });
                }
            }
        }
    }
</script>

<style scoped>
    .pvc {
        padding-top: 30px;
        padding-bottom: 100px;
    }
</style>
