<template>
    <div class="out">
        <el-container>
            <el-header style="border-bottom: 1px solid #ecf5ff;">
                <div class="title">花晨雨后台管理中心</div>
                <div class="admin">
                    <el-link :underline="false" @click="logout()">退出登录</el-link>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px"  style="background-color: white;text-align: center;">
                    <el-menu :default-openeds="['1', '2', '3']">
                        <el-menu-item index="1" @click="showUserList()">用户管理</el-menu-item>
                        <el-menu-item index="2" @click="showGoodsList()">商品管理</el-menu-item>
                        <el-menu-item index="3" @click="showOrderList()">订单管理</el-menu-item>
                    </el-menu>
                </el-aside>
                <el-container>
                    <router-view></router-view>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import UserList from "../UserList"
export default {
    name:"AdminPage",
    components:{
        UserList
    },
    methods:{
        showUserList(){
            this.$router.replace("/admin/userlist")
        },
        showOrderList(){
            this.$router.replace("/admin/orderlist")
        },
        showGoodsList(){
            this.$router.replace("/admin/goodslist")
        },
        logout(){
            this.$router.replace("/userlogin")
        }
    }
}
</script>

<style scoped>
.out {
    margin: 20px auto;
    width: 1500px;
    height: 680px;
    border-radius: 15px;
    border: 1px solid #eaeaea;
    box-shadow: 10px 10px 35px #cac6c6;
}


.title {
    float: left;
    color: #409EFF;
    line-height: 60px;
    font-size: 20px;
}

.admin {
    line-height: 60px;
    float: right;
}
</style>