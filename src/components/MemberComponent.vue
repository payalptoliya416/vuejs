<template>
    <div class="main">
        <div class="heading d-flex justify-content-between">
            <h3 class="p-2">Members</h3>
            <button class="btn btn-primary insertbtn" @click="openInsertPopup" >Insert</button>
        </div>
        <MembersPopup :isVisible="isPopupVisible" 
           :popupHeading="popupHeading" 
           @update:isVisible="isPopupVisible = $event"
           :formData="formData"
           @form-submitted="clearFormData"
        />
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Date Of Birth</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(member,index) in members" :key="member.id">
                    <td>{{ index+1 }}</td>
                    <td>{{ member.member_id }}</td>
                    <td>{{ member.name }}</td>
                    <td>{{ member.email }}</td>
                    <td>{{ member.gender }}</td>
                    <td>{{ member.dob }}</td>
                    <td>
                        <button class="btn btn-primary me-2 p-2" @click="openEditPopup(member.id)">Edit</button>
                        <button class="btn btn-danger p-2" @click="deleteMember(member.id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { useRoute } from "vue-router";
import axios from 'axios';
import MembersPopup from '../popup/MembersPopup.vue';

export default {
    components: {
        MembersPopup,
    },
    data() {
        return {
            members: [],
            token : localStorage.getItem('token'),
            isPopupVisible: false,
            popupHeading: '', 
            formData: {
                id: '',
                name: '',
                phone: '',
                gender: '',
                email: '',
                dob: '',
                profile_pic: '',
                profile_pic_url: '',
                type: '',
            }
        };
    },
    methods: {
        clearFormData() {
            this.formData = {};
        },
        async deleteMember(id) {
            var confirmation = confirm(`Deleted member with ID: ${id}`);
            if(confirmation == true){
                try {
                    const response = await axios.delete(this.$apiRoute+`/delete-member/${id}`,
                                        {
                                            headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${this.token}`,
                                            }
                                        });
                    this.$emit("form-submitted");
                    this.closePopup();
                    this.members = this.members.filter((member) => member.id !== id);
                    alert(`Deleted member with Member ID: ${response.data.member_id}`);
                } catch (error) {
                    console.log(error);
                    if(error.status == 400){
                    }
                    else{
                        alert(error.response.data);
                    }
                } 
            }
            
        },
        openInsertPopup(){
            this.formData = {type:'insert'};
            this.isPopupVisible = true;
            this.popupHeading = 'Insert Member';
        },
        async openEditPopup(id){
            const response = await fetch(this.$apiRoute+`/fetch-member/${id}`,{
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${this.token}`,
                                    },
                                });
            var respo = await response.json();
            if (response.ok) {
                if(respo.data.success){
                    const memberdata = respo.data.member
                    this.formData = {
                                id: memberdata.id,
                                name: memberdata.name,
                                phone: memberdata.phone,
                                gender: memberdata.gender,
                                email: memberdata.email,
                                dob: memberdata.dob,
                                profile_pic: '',
                                profile_pic_url: memberdata.profile_pic,
                                type:'update'
                            };
                }
                else if(respo.missingtoken == true){
                    this.$router.push("/");
                } 
                else{
                    alert(respo.data.message);
                } 
            } else{
                alert(respo.error);
            }
            this.isPopupVisible = true;
            this.popupHeading = 'Edit Member';
        },
        closePopup() {
            this.isPopupVisible = false;
        },
        async fetchData() {
            const response = await fetch(this.$apiRoute+`/get-members`,{
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${this.token}`,
                                    },
                                });
            var respo = await response.json();
            if (response.ok) {
                this.members = respo.data.members; 
            } else if(respo.missingtoken == true){
                this.$router.push("/");
            } else{
                alert(respo.message);
            }
        }
    },
    mounted() {
        this.fetchData(); // Fetch data when the component is mounted
    },

};

</script>

<style scoped>
.main {
    background-color: white;
    border-radius: 20px;
    ;
    height: 100%;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
}

thead {
    background-color: #f4f4f4;
}

.insertbtn{
    padding: 5px 16px;
    margin: 5px 0px;
    font-size: 18px;
}
</style>