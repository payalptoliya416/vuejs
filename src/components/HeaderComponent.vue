<template>
    <header class="header">
        <h2 style="color:#F1F5F9">Members & Trainers</h2>
        <button class="btn btn-danger logoutbtn" @click="logout">Logout</button>
    </header>
</template>

<script>
import axios from 'axios';
export default {
    methods: {
        async logout() {
            try {
                if (confirm("Are you sure you want to log out?")) {
                    let token = localStorage.getItem("token");
                    const response = await axios.post(this.$apiRoute+`/logout`,{
                        token: token
                    });
                    localStorage.removeItem("token");
                    this.$router.push("/");
                    alert(response.data.message);

                }
            } catch (error) {
                this.$router.push("/");
            } finally {
                this.isLoading = false; // Set loading to false
            }
            
        },
    },
};

</script>

<style scoped>
.header {
    display: flex;
    justify-content: center;
    background-color: #34495e;
    color: white;
    padding: 10px;
    text-align: center;
}

.logoutbtn {
    right: 0;
    position: fixed;
    margin-top:9px;
    margin-right: 5px;
}
</style>