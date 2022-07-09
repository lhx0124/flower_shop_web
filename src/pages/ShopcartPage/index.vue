<template>
    <div class="first">
        <MyShopCart></MyShopCart>
    </div>
</template>

<script>
    import MyShopCart from "../../components/MyShopCart"
    export default {
        name:"ShopcartPage",
        components:{
            MyShopCart
        }
    }
</script>

<style scoped>
.first{
    margin: 20px auto;
    width: 1220px;
    height: 680px;
    border-radius: 15px;
    border: 1px solid #eaeaea;
    box-shadow: 10px 10px 35px #cac6c6;
}
</style>