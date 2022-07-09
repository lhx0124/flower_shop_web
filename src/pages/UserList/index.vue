<template>
    <el-container>
        <el-header style="text-align:right;margin-top: 10px;">
            <el-input type="text" v-model="keywords" auto-complete="off" placeholder="请输入用户昵称"
                style="width: 200px;margin-right: 15px;" clearable></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button type="primary" @click="add()">添加</el-button>
        </el-header>
        <el-container>
            <div style="height: 480px;width: 100%;">
                <el-main>
                    <el-table :data="tableData" border style="width: 100%;text-align: center;" height="470px">
                        <!-- 扩展列表 -->
                        <el-table-column type="expand">
                            <template slot-scope="props">

                                <div style="width: 100%; float: left">
                                    <el-descriptions :column="2" :size="descriptionsSize" style="margin-left: 47px"
                                        border>
                                        <el-descriptions-item>
                                            <template slot="label"><i class="el-icon-user-solid"></i>用户名</template>
                                            <span>{{ props.row.username }}</span>
                                        </el-descriptions-item>
                                        <el-descriptions-item>
                                            <template slot="label"><i class="el-icon-key"></i>密码</template>
                                            <span>{{ props.row.password }}</span>
                                        </el-descriptions-item>
                                        <el-descriptions-item>
                                            <template slot="label"> <i class="el-icon-user"></i>昵称</template>
                                            <span>{{ props.row.nickname }}</span>
                                        </el-descriptions-item>
                                        <el-descriptions-item>
                                            <template slot="label"><i class="el-icon-female"></i>性别</template>
                                            <span>{{ props.row.sex }}</span>
                                        </el-descriptions-item>
                                        <el-descriptions-item>
                                            <template slot="label"> <i class="el-icon-alarm-clock"></i>年龄</template>
                                            <span>{{ props.row.age }}</span>
                                        </el-descriptions-item>
                                        <el-descriptions-item>
                                            <template slot="label"><i class="el-icon-stopwatch"></i>地址</template>
                                            <span>{{ props.row.address }}</span>
                                        </el-descriptions-item>
                                        <el-descriptions-item>
                                            <template slot="label"><i class="el-icon-mobile-phone"></i>电话</template>
                                            <span>{{ props.row.phone }}</span>
                                        </el-descriptions-item>
                                    </el-descriptions>
                                </div>

                            </template>
                        </el-table-column>
                        <!-- 表头 -->
                        <el-table-column prop="image" label="用户头像">
                            <template slot-scope="scope">
                                <el-avatar shape="square" :size="56" :src="getImage(scope)">
                                </el-avatar>
                            </template>
                        </el-table-column>
                        <el-table-column prop="id" label="用户ID"></el-table-column>
                        <el-table-column prop="username" label="用户名"></el-table-column>
                        <el-table-column prop="nickname" label="昵称"></el-table-column>

                        <el-table-column label="操作" width="120">
                            <template v-slot="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"
                                    style="margin-right:10px">
                                </el-button>
                                <template>
                                    <el-popconfirm confirm-button-text='是的' cancel-button-text='不了' icon="el-icon-info"
                                        icon-color="red" title="确认删除该条数据？" @confirm="handleDelete(scope.row.id)">
                                        <el-button slot="reference" icon="el-icon-delete" size="mini" type="danger">
                                        </el-button>
                                    </el-popconfirm>
                                </template>
                            </template>
                        </el-table-column>


                    </el-table>
                </el-main>
            </div>
        </el-container>
        <!-- 分页器 -->
        <el-footer style="border-top: 1px solid #ecf5ff;">
            <el-pagination style="margin-top:20px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="currentPage" :page-sizes="[5, 10, 20]" :page-size="pageSize"
                layout="total,sizes, prev, pager, next,jumper" :total="total">
            </el-pagination>
        </el-footer>

        <!-- 弹出框 -->
        <el-dialog title="请输入用户数据" :visible.sync="DialogVisible" width="40%" center="true">
            <el-form :model="Form" status-icon :rules="Rules" ref="Form">

                <div style="display:flex">
                    <el-form-item label="用户名" label-width="120px" prop="username">
                        <el-input v-model="Form.username" autocomplete="off" style="width:80%"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" label-width="60px" prop="password">
                        <el-input type="password" v-model="Form.password" autocomplete="off" style="width:80%">
                        </el-input>
                    </el-form-item>
                </div>

                <div style="display:flex">
                    <el-form-item label="昵称" label-width="120px" prop="nickname">
                        <el-input v-model="Form.nickname" autocomplete="off" style="width:80%"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" label-width="60px" prop="sex">
                        <el-radio v-model="Form.sex" label="男">男</el-radio>
                        <el-radio v-model="Form.sex" label="女">女</el-radio>
                    </el-form-item>
                </div>

                <div style="display:flex">
                    <el-form-item label="年龄" label-width="120px" prop="age">
                        <el-input v-model="Form.age" autocomplete="off" style="width:90%"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" label-width="60px" prop="phone">
                        <el-input v-model="Form.phone" autocomplete="off" style="width:80%"></el-input>
                    </el-form-item>
                </div>

                    <el-form-item label="地址" label-width="120px" prop="address">
                        <el-input v-model="Form.address" autocomplete="off" style="width:85%"></el-input>
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
                <el-button type="primary" @click="save()" style="width: 100%">确定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
import request from '@/api/request';
export default {
    name: "UserList",
    data() {
        return {
            tableData: [],
            keywords: '',
            fullscreenLoading: false,
            DialogVisible: false,
            formLabelWidth: '120px',
            imageUrl: '',
            Form: {
                username: '',
                password: '',
                nickname: '',
                sex: '',
                age: '',
                address: '',
                phone: '',
                image: '',
            },
            Rules: {
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
                image: [
                    { required: false, message: '请输入头像地址！', trigger: 'blur' },
                ]

            },
            total: 0,
            currentPage: 1,
            pageSize: 10
        };
    },
    created() {
        this.search()
    },

    methods: {
        search() {
            request.get("/api/admin/searchUser", {
                params: {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    search: this.keywords
                }
            }).then(res => {
                console.log(res)
                this.tableData = res.data.records
                this.total = res.data.total
            })
        },
        add() {
            this.DialogVisible = true
            this.Form = {}
            this.imageUrl = ""
        },
        save() {
            console.log(this.Form.username)
            if (this.Form.id) {
                request.put("/api/admin/upDateUser", this.Form).then(res => {
                    if (res.code == "0") {
                        this.$message.success("修改成功！")
                        this.DialogVisible = false
                        this.search()
                    } else {
                        this.$message.error("修改失败！")
                    }
                })
            } else {
                this.$refs['Form'].validate((valid) => {
                    if (valid) {
                        request.post("/api/admin/addUser", this.Form).then(res => {
                            if (res.code == '0') {
                                this.$message.success("添加成功！")
                                this.DialogVisible = false
                                this.search()
                            }
                            else {
                                this.$message.error("添加失败！")
                            }
                        })
                    } else {
                        this.$message.error("请正确填写信息！");
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        },

        getImage(scope) {
            const url = "http://localhost:8082/upload/image/" + scope.row.image
            return url
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


        edit(row) {
            this.Form = JSON.parse(JSON.stringify(row))
            this.DialogVisible = true
        },
        handleDelete(id) {
            request.delete("/api/admin/deleteUser/" + id).then(res => {
                if (res.code == "0") {
                    this.$message.success("删除成功！")
                    this.search()
                } else {
                    this.$message.error("删除失败！")
                }
            })

        }
    }
}
</script>

<style scoped>
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
    color: #8c939d;
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