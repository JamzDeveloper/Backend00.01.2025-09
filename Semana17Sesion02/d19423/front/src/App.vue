<template>
    <Checkout msg="Hola"></Checkout>
</template>

<script>
import Checkout from './components/Checkout.vue';

    export default{
        name: "app",
        components:{
            Checkout
        }
    }
</script>

<style>
    h1{
        background-color: black;
        color: azure;
    }
</style>