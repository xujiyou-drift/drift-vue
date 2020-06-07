<template>
    <div>
        <div class="login-div">
            <el-row :gutter="20">
                <el-col :span="8" :offset="8">
                    <div class="login-form">
                        <div>
                            <h2 style="text-align: center">大数据部署与管理</h2>
                        </div>
                        <br/>
                        <el-form :model="loginForm" status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm">
                            <el-form-item label="用户名" prop="username">
                                <el-input type="text" v-model="loginForm.username" autocomplete="off"/>
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input type="password" v-model="loginForm.password" autocomplete="off"/>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm()">登录</el-button>
                                <el-button @click="resetForm()">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import auth_api from "../api/auth_api";
    import drift_init_api from "../api/drift_init_api";
    import { mapActions } from 'vuex'

    export default {
        name: "Login",

        data () {
            return {
                loginForm: {
                    username: "",
                    password: ""
                }
            }
        },

        mounted() {
            console.info("Login");
        },

        methods: {
            ...mapActions('init', [
                'setSelect',
                'setPvc'
            ]),

            async submitForm() {
                let loginResult = await auth_api.login(this.loginForm);
                if (loginResult === undefined) {
                    this.loginErr("登录错误，请检查服务端是否启动并能够访问");
                    return
                }
                let token = loginResult["token"];
                if (token !== undefined) {
                    sessionStorage.setItem('token', token);
                    sessionStorage.setItem('tokenStart', new Date().getTime());

                    let driftInitData = await drift_init_api.findDriftInitData();
                    let code = driftInitData["code"];
                    if (code === undefined) {
                        //服务端没返回正常的数据
                        this.loginErr("登录错误，请重试");
                    } else if (code === 1) {
                        //还没有初始化过，进入初始化界面
                        this.$router.push("/init/select");
                    } else if (code === 2) {
                        //获取初始化数据失败
                        this.loginErr(driftInitData["errMsg"]);
                    } else if (code === 0) {
                        //存在初始化数据了
                        let data = driftInitData["data"];
                        console.log(data);
                        if (data["spec"]["complete"] === true) {
                            //已初始化完成，前往想要前往的地址
                            if (this.$route.query.url === undefined) {
                                this.$router.push("/home");
                            } else if (this.$route.query.url.indexOf("init") !== -1) {
                                //已完成初始化了，不允许再进入初始化相关的界面
                                this.$router.push("/home");
                            } else {
                                //不想去初始化界面就随意了
                                this.$router.push(this.$route.query.url);
                            }
                        } else {
                            // 如果没完成初始化
                            this.setSelect({
                                currentActive: data["spec"]["active"],
                                checkedComponents: data["spec"]["components"],
                                namespace: data["spec"]["namespace"],
                            });
                            this.setPvc({
                                pvc: data["spec"]["pvc"]
                            });
                            this.$router.push(data["spec"]["currentPath"]);
                        }
                    }
                }
            },

            loginErr(msg) {
                this.$notify.error({
                    title: '登录错误',
                    message: msg
                });
            },

            resetForm() {
                this.loginForm.username = "";
                this.loginForm.password = "";
            }
        },
    }
</script>

<style scoped>
    .login-div {
        padding-top: 200px;
    }

    .login-form {
        padding: 32px 20px 20px 20px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        border-radius: 4px;
    }
</style>
