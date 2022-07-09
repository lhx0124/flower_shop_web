<template>
    <el-container>
        <el-header>
            <el-button @click="gotoAdminLogin()" icon="el-icon-d-arrow-right" style="float: right;border: none">管理端登录
            </el-button>
        </el-header>
        <!-- 登录 -->
        <el-main>
            <div class="loginContainer">
                <el-form ref="loginForm" :rules="rules" :model="loginForm" label-width="80px">
                    <h3 class="loginTitle">花晨雨</h3>
                    <el-form-item label="用户名:" prop="username">
                        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="密码:" prop="password">
                        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码">
                        </el-input>
                    </el-form-item>
                    <el-checkbox v-model="checked" class="loginRemember"></el-checkbox><span> 记住我一周</span>
                    <div>
                        <el-button @click="showRegistryDialog()" style="width:45% ;margin-right: 15px">注册</el-button>
                        <el-button type="primary" style="width:45% ;" @click="submitLogin('loginForm')"
                            v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>
                    </div>
                </el-form>
            </div>
        </el-main>

        <!-- 注册窗口 -->
        <el-dialog title="开始注册！" :visible.sync="registerDialogVisible" width="40%" center="true"
            :before-close="handleClose">
            <el-form :model="registerForm" status-icon :rules="registerRules" ref="registerForm">
            
                <div style="display:flex">
                    <el-form-item label="用户名" label-width="120px" prop="username">
                        <el-input v-model="registerForm.username" autocomplete="off" style="width:80%"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" label-width="60px" prop="password">
                        <el-input type="password" v-model="registerForm.password" autocomplete="off" style="width:80%">
                        </el-input>
                    </el-form-item>
                </div>
                <div style="display:flex">
                    <el-form-item label="昵称" label-width="120px" prop="nickname">
                        <el-input v-model="registerForm.nickname" autocomplete="off" style="width:80%"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" label-width="60px" prop="sex">
                        <el-radio v-model="registerForm.sex" label="男">男</el-radio>
                        <el-radio v-model="registerForm.sex" label="女">女</el-radio>
                    </el-form-item>
                </div>


                <div style="display:flex">
                    <el-form-item label="年龄" label-width="120px" prop="age">
                        <el-input v-model="registerForm.age" autocomplete="off" style="width:90%"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" label-width="60px" prop="phone">
                        <el-input v-model="registerForm.phone" autocomplete="off" style="width:80%"></el-input>
                    </el-form-item>
                </div>


                <el-form-item label="地址" label-width="120px" prop="address">
                    <el-input v-model="registerForm.address" autocomplete="off" style="width:85%"></el-input>
                </el-form-item>

                <el-form-item label="头像" label-width="120px" prop="image">
                    <el-upload class="avatar-uploader" action="/api/admin/upload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitRegisterForm('registerForm')" style="width: 100%">确认注册
                </el-button>
            </div>
        </el-dialog>

    </el-container>
</template>

<script>
import request from "../../api/request";
export default {
    name: "UserLogin",
    data() {
        return {
            imageUrl: "",
            formLabelWidth: '120px',
            //登录表单
            loginForm: {
                username: '',
                password: '',
            },
            checked: true,
            rules: {
                username: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }],
            },
            fullscreenLoading: false,

            //注册表单相关
            registerDialogVisible: this.$store.state.registerDialog,

            registerForm: {
                username: '',
                password: '',
                nickname: '',
                sex: '',
                age: '',
                phone: '',
                address: '',
                image: '',
            },
            //注册表单的校验规则
            registerRules: {
                username: [
                    { required: true, message: '请输入用户名！', trigger: 'blur' },
                    { min: 6, message: '长度至少为6位！', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码！', trigger: 'blur' },
                    { min: 6, message: '长度至少为6', trigger: 'blur' }
                ],
                nickname: [
                    { required: true, message: '请输入昵称！', trigger: 'blur' },
                    { min: 1, message: '长度至少为1', trigger: 'blur' }
                ],
                age: [
                    { required: true, message: '请输入年龄！', trigger: 'blur', min: 1, max: 3 },
                    { message: '请填写正确年龄！', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '请输入收件地址！', trigger: 'blur', min: 1, max: 100 },
                    { message: '请填写正确地址！', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号码！', trigger: 'blur' },
                    { min: 11, max: 11, message: '请输入11位数字', trigger: 'blur' }
                ],
                sex: [
                    { required: true, message: '请选择性别!', trigger: 'change' }
                ],
            },
        };
    },


    methods: {
        submitLogin(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    request.get("/api/user/login", {
                        params: {
                            username: this.loginForm.username,
                            password: this.loginForm.password
                        }
                    }).then(res => {
                        if (res.code == "0") {
                            window.sessionStorage.setItem("username", this.loginForm.username);
                            this.$store.state.currentUser = this.loginForm.username
                            this.$message.success("登录成功！")
                            this.$router.replace("/");
                        } else {
                            this.$message.error(res.msg)
                        }
                    })
                } else {
                    this.$message.error("请正确填写信息！");
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        // 上传之前
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;

        },
        // 文件上传成功时的钩子
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.Form.image = file.response;
            console.log(this.Form.image)
        },
        gotoAdminLogin() {
            this.$router.replace("/adminlogin");
        },

        // 弹出对话框
        showRegistryDialog() {
            this.registerDialogVisible = true;
        },

        // 关闭对话框
        handleClose(done) {
            this.registerForm = {}
            this.$store.state.registerDialog = false
            done();
        },

        //提交注册操作
        submitRegisterForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    request.post("/api/user/register", this.registerForm).then(res => {
                        if (res.code == "0") {
                            this.$message.success("注册成功！")
                            this.$router.replace("/userlogin");
                        } else {
                            this.$message.error("注册失败！")
                        }
                    })
                } else {
                    this.$message.error("请正确填写信息！");
                    console.log('error submit!!');
                    return false;
                }
            });
            this.$store.state.registerDialog = false
        },
    },

    mounted() {
        window.sessionStorage.clear()
    }


}
</script>

<style scoped>
.disabled .el-upload--picture-card {
    display: none;
}

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

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #1057bc;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
