<template>
    <el-container>
        <el-header>
            <el-button @click="gotoClientLogin()" icon="el-icon-d-arrow-left" style="border: none">客户端登录</el-button>
        </el-header>
        <el-main>
            <div class="loginContainer">
                <el-form ref="loginForm" :rules="rules" :model="loginForm" label-width="80px">
                    <h3 class="loginTitle">管理端登录</h3>
                    <el-form-item label="用户名:" prop="username">
                        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码:" prop="password">
                        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
                    </el-form-item>

                    <el-checkbox v-model="checked" class="loginRemember"></el-checkbox><span> 记住我一周</span>
                    <el-button type="primary" style="width: 100%" @click="submitLogin()"  v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>
                </el-form>
            </div>
        </el-main>
    </el-container>
</template>

<script>
export default {
    name: "AdminLogin",
    data() {
        return {
            loginForm: {
                username: "",
                password: "",
            },
            checked: true,
            rules: {
                username: [{
                    required: true,
                    message: "请输入用户名",
                    trigger: "blur"
                }, ],
                password: [{
                    required: true,
                    message: "请输入密码",
                    trigger: "blur"
                }],
            },
            fullscreenLoading: false,
        };
    },
    methods: {
        submitLogin() {
            if(this.loginForm.username =="admin" && this.loginForm.password == "1234"){
                this.$message.success("登录成功！")
                this.$router.replace("/admin")
            }else{
                this.$message.error("用户名或密码错误！")
            }
        },
        gotoClientLogin() {
            this.$router.replace("/userlogin");
        },

    },
};
</script>

<style scoped>
.loginContainer {
    width: 350px;
    margin: 100px auto;
    border-radius: 15px;
    border: 1px solid #eaeaea;
    /*添加阴影 h-shadow(水平阴影位置)，v-shadow(垂直阴影位置)，blur(阴影大小)，color(颜色)*/
    box-shadow: 10px 10px 35px #cac6c6;
    background: #fff;
    /*background-clip——规定背景的绘制区域*/
    /*border-box：背景被裁剪到边框盒*/
    /*padding-box：背景被裁剪到内边距框*/
    /*content-box：背景被裁剪到内容框*/
    background-clip: padding-box;
    padding: 25px 35px 25px 35px;
}

.loginTitle {
    margin: 10px auto 30px auto;
    text-align: center;
    color: #505458;
}

.loginRemember {
    margin: 5px auto 35px 80px;
}
</style>
