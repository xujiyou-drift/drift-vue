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
    import router from "../router";

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
            submitForm() {
                let that = this;
                auth_api.login(this.loginForm).then(res => {
                    sessionStorage.setItem('token', res["token"]);
                    that.$router.push(that.$route.query.url);
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
