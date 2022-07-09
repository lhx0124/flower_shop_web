<template>
    <el-container>
        <el-header style="text-align:right;margin-top: 10px;">
            <el-input type="text" v-model="keywords" auto-complete="off" placeholder="请输入商品名称"
                style="width: 200px;margin-right: 15px;" clearable></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button type="primary" @click="add()">添加</el-button>
        </el-header>
        <el-container>
            <div style="height: 480px;width: 100%;">
                <el-main>
                    <el-table :data="tableData" border style="width: 100%;text-align: center;" height="470px">

                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <div style="width: 100%; float: left">
                                    <el-descriptions :column="2" :size="descriptionsSize" style="margin-left: 47px"
                                        border>
                                        <el-descriptions-item>
                                            <template slot="label"><i class="el-icon-files"></i>商品ID</template>
                                            <span>{{ props.row.id }}</span>
                                        </el-descriptions-item>
                                        <el-descriptions-item>
                                            <template slot="label"><i class="el-icon-goods"></i>商品名称</template>
                                            <span>{{ props.row.goodsname }}</span>
                                        </el-descriptions-item>
                                        <el-descriptions-item>
                                            <template slot="label"> <i class="el-icon-aim"></i>商品分类</template>
                                            <span>{{ props.row.category }}</span>
                                        </el-descriptions-item>
                                        <el-descriptions-item>
                                            <template slot="label"><i class="el-icon-paperclip"></i>商品价格</template>
                                            <span>{{ props.row.price }}</span>
                                        </el-descriptions-item>
                                        <el-descriptions-item>
                                            <template slot="label"> <i class="el-icon-chat-line-square"></i>商品介绍</template>
                                            <span>{{ props.row.introduce }}</span>
                                        </el-descriptions-item>
                                    </el-descriptions>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column prop="image" label="商品图片">
                            <template slot-scope="scope">
                                <el-avatar shape="square" :size="56"
                                    :src="getImage(scope)">
                                </el-avatar>
                            </template>
                        </el-table-column>
                        
                        <el-table-column prop="id" label="商品ID"></el-table-column>
                        <el-table-column prop="goodsname" label="商品名称"></el-table-column>
                        <el-table-column prop="category" label="商品分类"></el-table-column>


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

        <el-footer style="border-top: 1px solid #ecf5ff">
            <el-pagination style="margin-top:20px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="currentPage" :page-sizes="[5, 10, 20]" :page-size="pageSize"
                layout="total,sizes, prev, pager, next,jumper" :total="total">
            </el-pagination>
        </el-footer>


        <el-dialog title="请输入商品数据" :visible.sync="DialogVisible" width="40%">
            <el-form :model="Form" status-icon :rules="Rules" ref="Form">
                <el-form-item label="商品名称" :label-width="formLabelWidth" prop="goodsname">
                    <el-input v-model="Form.goodsname" autocomplete="off" style="width:90%"></el-input>
                </el-form-item>
                <el-form-item label="商品分类" :label-width="formLabelWidth" prop="category">
                    <el-input v-model="Form.category" autocomplete="off" style="width:90%"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" :label-width="formLabelWidth" prop="price">
                    <el-input v-model="Form.price" autocomplete="off" style="width:90%"></el-input>
                </el-form-item>
                <el-form-item label="商品介绍" :label-width="formLabelWidth" prop="introduce">
                    <el-input v-model="Form.introduce" autocomplete="off" style="width:90%"></el-input>
                </el-form-item>

                <el-form-item label="商品图片" :label-width="formLabelWidth" prop="image">
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
    name: "GoodsList",
    data() {
        return {
            tableData: [],
            keywords: '',
            fullscreenLoading: false,
            DialogVisible: false,
            formLabelWidth: '120px',
            imageUrl:'',
            Form: {
                goodsname: '',
                category: '',
                price: '',
                introduce: '',
                image: ''
            },
            Rules: {
                goodsname: [
                    { required: true, message: '请输入商品名称!', trigger: 'blur' },
                ],
                category: [
                    { required: true, message: '请输入商品类别!', trigger: 'blur' },
                ],
                price: [
                    { required: true, message: '请输入商品价格！', trigger: 'blur' },
                ],
                introduce: [
                    { required: true, message: '请输入商品简介！', trigger: 'blur' },
                ],
                
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
            request.get("/api/admin/searchGoods", {
                params: {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    search: this.keywords
                }
            }).then(res => {
                if (res.code == "0") {
                    this.$message.success("查询成功！")
                    this.tableData = res.data.records
                    this.total = res.data.total
                }
            })
        },
        add() {
            this.DialogVisible = true
            this.Form = {}
        },
        save() {
            if (this.Form.id) {
                request.put("/api/admin/upDateGoods", this.Form).then(res => {
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
                        request.post("/api/admin/addGoods", this.Form).then(res => {
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
        handleSizeChange(pageSize) {
            this.pageSize = pageSize
            this.search()
        },
        handleCurrentChange(pageNum) {
            this.currentPage = pageNum
            this.search()
        },

        getImage(scope){
            const url = "http://localhost:8082/upload/image/"+scope.row.image
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
            request.delete("/api/admin/deleteGoods/" + id).then(res => {
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