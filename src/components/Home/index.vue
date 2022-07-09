<template>
    <el-container>
        <el-header style="text-align:center;margin-top:20px;">
            <el-button v-if="this.$store.state.currentUser" type="primary" round class="tag" @click="gotologin()">
                欢迎来到花晨雨在线商城！</el-button>
            <el-button v-else type="primary" round class="tag" @click="gotologin()">立即登录</el-button>

            <el-button type="primary" round class="tag" @click="gotorigister()">立即注册</el-button>
            <el-button type="primary" round class="tag" @click="gotomyorder()">我的订单</el-button>
            <el-button type="primary" round class="tag" @click="gotomyshopcart()">我的购物车</el-button>
            <el-button type="warning" round @click="logout()">退出登录</el-button>
        </el-header>
        <el-container>
            <el-aside width="200px" style="background-color: white">
                <el-menu :default-openeds="['1', '2', '3']">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-shopping-cart-full"></i>鲜花</template>
                        <el-menu-item index="1" @click="searchthe('玫瑰')">玫瑰花</el-menu-item>
                        <el-menu-item index="3" @click="searchthe('杜鹃')">杜鹃花</el-menu-item>
                        <el-menu-item index="4" @click="searchthe('月季')">月季花</el-menu-item>
                        <el-menu-item index="5" @click="searchthe('满天星')">满天星</el-menu-item>
                        <el-menu-item index="6" @click="searchthe('兰花')">兰花</el-menu-item>
                        <el-menu-item index="7" @click="searchthe('向日葵')">向日葵</el-menu-item>
                    </el-submenu>

                    <el-submenu index="2">
                        <template slot="title"><i class="el-icon-shopping-bag-1"></i>其他商品</template>

                        <el-menu-item index="8" @click="searchthe('花瓶')">花瓶</el-menu-item>
                        <el-menu-item index="9" @click="searchthe('花盆')">花盆</el-menu-item>
                        <el-menu-item index="10" @click="searchthe('贺卡')">贺卡</el-menu-item>
                        <el-menu-item index="11" @click="searchthe('包装')">包装礼盒</el-menu-item>
                        <el-menu-item index="12" @click="searchthe('肥料')">鲜花肥料</el-menu-item>
                    </el-submenu>

                    <el-submenu index="3">
                        <template slot="title"><i class="el-icon-tickets"></i>热门排行</template>
                        <el-menu-item index="13" @click="searchthe('白玫瑰')">白玫瑰</el-menu-item>
                        <el-menu-item index="14" @click="searchthe('月季')">月季花</el-menu-item>
                        <el-menu-item index="15" @click="searchthe('向日葵')">向日葵</el-menu-item>
                        <el-menu-item index="16" @click="searchthe('满天星')">满天星</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header style="text-align:right">
                    <el-input type="text" v-model="keywords" auto-complete="off" placeholder="请输入搜索内容"
                        style="width: 200px;margin-right: 15px;"></el-input>
                    <el-button type="primary" class="el-icon-search" @click="search">搜索</el-button>
                </el-header>
                <el-main>
                    <div v-for="(item) in this.$store.state.goods" :key="item.id">
                        <div class="outer">
                            <!-- 创建图片容器 -->
                            <div class="img-wrapper">
                                <!-- 设置图片 -->
                                <img :src="`${baseurl}${item.image}`" alt="">
                            </div>
                            <!-- 创建内容区容器 -->
                            <div class="info">
                                <h2 class="title"> {{ item.goodsname }} </h2>
                                <h3 class="category"><i class="el-icon-goods">{{ item.price }}</i></h3>
                                <p class="intro">{{ item.introduce }}</p>
                            </div>
                            <div class="star-wrapper">
                                <el-button type="primary" plain size="small " class="buttonadd"
                                    @click="addtoshopcart(item)">加入购物车</el-button>
                                <el-button type="warning" plain size="small " class="buttonbuy"
                                    @click="addtoOrder(item)">
                                    立即购买</el-button>
                            </div>
                        </div>

                        <!-- 支付窗口 -->
                        <el-dialog title="扫描下方二维码以完成支付（微信/支付宝/云闪付）" :visible.sync="dialogVisible" width="30%"
                            :before-close="handleClose">
                            <div class="qrcode">
                                <img src="../../assets/logo.png" alt="">
                            </div>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="dialogVisible = false" round>取消</el-button>
                                <el-button type="primary" @click="paysuccess(item)" round>支付成功</el-button>
                            </span>
                        </el-dialog>

                    </div>
                </el-main>

            </el-container>
        </el-container>
    </el-container>

</template>

<script>
import request from "@/api/request";
import "../../assets/css/reset.css"

export default {
    name: "Home",
    data() {
        return {
            dialogVisible: false,
            keywords: "",
            baseurl: "http://localhost:8082/upload/image/",
            user: {},
        };
    },
    methods: {

        //登录
        gotologin() {
            if (this.$store.state.currentUser) {
                this.$message.success("您已处于登录状态！")
            } else {
                this.$router.replace("/userlogin")
            }
        },

        // 注册
        gotorigister() {
            this.$router.replace("/userlogin")
            this.$store.state.registerDialog = true
        },

        // 查看我的订单
        gotomyorder() {
            if (this.$store.state.currentUser) {
                this.$router.push("/myorder")
            } else {
                this.$message.warning("请先登录！才能查订单哦！")
                this.$router.replace("/userlogin")
            }
        },

        // 查看购物车
        gotomyshopcart() {
            if (this.$store.state.currentUser) {
                this.$router.push("/myshopcart")
            } else {
                this.$message.warning("请先登录！才能查看购物车！")
                this.$router.push("/userlogin")
            }
        },

        // 添加到购物车
        addtoshopcart(item) {
            if (this.$store.state.currentUser) {
                console.log("你要添加的商品信息如下：", item);
                var Form = {
                    "username": this.$store.state.currentUser,
                    "goodsname": item.goodsname,
                    "price": item.price,
                    "introduce": item.introduce,
                    "image": item.image,
                }
                console.log(Form)
                request.post("/api/user/addToShopCart", Form).then(res => {
                    if (res.code == '0') {
                        this.$notify({
                            title: '添加成功',
                            message: '您已成功添加商品到购物车！',
                            type: 'success'
                        });
                    }
                    else {
                        this.$notify({
                            title: '添加失败',
                            message: '添加出错了！请重试！',
                            type: 'error'
                        });
                    }
                })

            } else {
                this.$message.warning("请先登录！才能添加到购物车！")
                this.$router.replace("/userlogin")
            }
        },

        // 取消支付
        handleClose(done) {
            this.$confirm('确认取消支付？').then(_ => {
                done();
            }).catch(_ => { });
        },

        // 支付成功
        async paysuccess(item) {
            var res = await request.get("/api/user/getUserInfo", { params: { username: this.$store.state.currentUser } })
            console.log(res)
            this.$store.state.address = res.data[0].address
            this.$store.state.phone = res.data[0].phone

            var Form = {
                "address": this.$store.state.address,
                "buy": this.$store.state.currentUser,
                "phone": this.$store.state.phone,
                "goodsname": item.goodsname,
                "image": item.image
            }
            request.post("/api/user/addToOrder", Form).then(res => {
                if (res.code == '0') {
                    this.$notify({
                        title: "支付成功！",
                        message: "平台将马上为您送货！",
                        type: "success"
                    })
                } else {
                    this.$notify({
                        title: "支付失败！",
                        message: "请重试！",
                        type: "success"
                    })
                }
            })
            this.dialogVisible = false
        },

        // 添加到订单
        addtoOrder() {
            if (this.$store.state.currentUser) {
                this.dialogVisible = true
            }else{
                this.$message.warning("请先登录后再购买！")
                this.$router.replace("/userlogin")
            }
        },

        // 加载页面商品数据
        search() {
            request.get("/api/admin/searchGoods", {
                params: {
                    pageNum: 1,
                    pageSize: 1000,
                    search: this.keywords
                }
            }).then(res => {
                if (res.code == "0") {
                    this.$store.state.goods = res.data.records
                }
            })
        },

        // 菜单栏的点击回调
        searchthe(val) {
            request.get("/api/admin/searchGoods", {
                params: {
                    pageNum: 1,
                    pageSize: 1000,
                    search: val
                }
            }).then(res => {
                if (res.code == "0") {
                    this.$store.state.goods = res.data.records
                    this.total = res.data.total
                }
            })
        },

        // 退出登录
        logout() {
            if (this.$store.state.currentUser) {
                window.sessionStorage.removeItem('username')
                this.$message.success("您已成功退出！欢迎下次光临！")
            } else {
                window.sessionStorage.removeItem('username')
                this.$message.warning("您目前尚未登录！")
            }
        },

    },
    mounted() {
        request.get("/api/admin/searchGoods", {
            params: {
                pageNum: 1,
                pageSize: 1000,
                search: this.keywords
            }
        }).then(res => {
            if (res.code == "0") {
                this.$store.state.goods = res.data.records
            }
        })
    }

}

</script>

<style scoped>
.tag {
    margin-right: 10px;
}

.buttonadd {
    float: left;
}

.buttonbuy {
    float: right;
}

/* 设置外层容器 */
.outer {
    width: 220px;
    margin: 10px 10px;
    /* 设置阴影 */
    box-shadow: 0 0 10px rgba(0, 0, 0, .3);
    float: left;
}

/* 设置图片 */
.img-wrapper img {
    width: 218px;
    height: 160px;
    margin: 1px 1px;
    vertical-align: bottom;
}

.info {
    padding: 0 18px;
    color: #acaaaa;
    font-size: 12px;
    text-align: center;
}

/* 设置标题 */
.info .title {
    color: #717171;
    font-size: 14px;
    margin: 13px 0 15px 0;
}


.info .category i {
    margin-left: 4px;
    margin-right: 7px;
    color: rgb(178, 38, 38);
}

/* 设置简介的样式 */
.info .intro {
    margin: 18px 4px;
    line-height: 20px;
}

/* 设置下边的内容 */
.star-wrapper {
    height: 46px;
    border-top: 1px solid #e9e9e9;
    color: #ddd;
    padding: 12px 12px 0px 12px;
}
</style>