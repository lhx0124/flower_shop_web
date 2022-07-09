<template>
    <div class="first">
        <MyOrder></MyOrder>
    </div>
</template>

<script>
    import MyOrder from "../../components/MyOrder"
    export default {
        name:"OrderPage",
        components:{
            MyOrder
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