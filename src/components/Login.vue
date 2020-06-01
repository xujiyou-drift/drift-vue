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
            async submitForm() {
                let loginResult = await auth_api.login(this.loginForm);
                let token = loginResult["token"];
                if (token !== undefined) {
                    sessionStorage.setItem('token', token);
                    sessionStorage.setItem('tokenStart', new Date().getTime());

                    let driftInitData = await drift_init_api.findDriftInitData();
                    let code = driftInitData["code"];
                    if (code === undefined) {
                        this.loginErr();
                    } else if (code === 1) {
                        this.$router.push("/init/select");
                    } else if (code === 2) {
                        this.loginErr();
                    } else {
                        this.$router.push(this.$route.query.url);
                    }
                }
            },

            loginErr() {
                this.$notify.error({
                    title: '登录错误',
                    message: '请重新登录'
                });
            },

            resetForm() {
                this.loginForm.username = "";
                this.loginForm.password = "";
            }
        }
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
