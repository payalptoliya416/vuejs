<template>
    <div class="main">
        <Login></Login>
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component";
    import Login from '@/components/Login.vue';

    @Options({
        components: {
            Login,
        },
    })

    export default class LoginView extends Vue {}
</script>

<style scoped>
    .main{
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(to bottom,
                rgba(96, 108, 136, 1) 0%,
                rgba(63, 76, 107, 1) 100%);
        background-size: cover;
        height: 100vh;
        font-family: sans-serif;
    }

</style>