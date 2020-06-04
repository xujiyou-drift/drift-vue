<template>
    <div>
        <div class="pvc">
            <el-row :gutter="20">
                <el-col :span="8" :offset="8">
                    <h3>为 ZooKeeper 创建 PVC：</h3>
                    <el-form ref="form" :model="pvc.ZooKeeper" label-width="100px">
                        <el-form-item label="StorageClass">
                            <el-input v-model="pvc.ZooKeeper.storageClass" placeholder="请输入储存类"/>
                        </el-form-item>
                        <el-form-item label="VolumeMode">
                            <el-select v-model="pvc.ZooKeeper.volumeMode" placeholder="请选择卷模式">
                                <el-option
                                        v-for="item in pvc.ZooKeeper.volumeModeOptions"
                                        :key="item.value"
                                        :label="item.value"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="容量">
                            <el-input v-model="pvc.ZooKeeper.storage" placeholder="请输入储存容量" type="number">
                                <template slot="append">Gi</template>
                            </el-input>
                        </el-form-item>
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
    import driftInitApi from "../../api/drift_init_api";
    import { mapActions } from 'vuex'

    export default {
        name: "PVC",

        data () {
            return {
                pvc: {
                    ZooKeeper: {
                        storageClass: "",
                        volumeMode: "Block",
                        storage: 10,
                        volumeModeOptions: [
                            {
                                value: 'Block',
                            }, {
                                value: 'Filesystem',
                            }
                        ]
                    }
                },
                loading: false,
                nextPath: "/init/config",
                prevPath: "/init/select"
            }
        },

        methods: {
            ...mapActions('init', [
                'setAction'
            ]),

            async nextStep() {
                this.loading = true;
                let record = {
                    currentPath: this.nextPath,
                    active: 2,
                    pvc: {
                        ZooKeeper: {
                            storageClass: this.pvc.ZooKeeper.storageClass,
                            volumeMode: this.pvc.ZooKeeper.volumeMode,
                            storage: this.pvc.ZooKeeper.storage + "Gi",
                        }
                    }
                };
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
