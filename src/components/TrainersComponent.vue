<template>
    <div class="main">
        <div class="heading d-flex justify-content-between">
            <h3 class="p-2">Trainers</h3>
            <button class="btn btn-primary insertbtn" @click="openInsertPopup" >Insert</button>
        </div>
        <TrainersPopup :isVisible="isPopupVisible" 
           :popupHeading="popupHeading" 
           @update:isVisible="isPopupVisible = $event"
           :formData="formData"
           @form-submitted="clearFormData"
        />
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Date Of Birth</th>
                    <th>Specialization</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(trainer,index) in trainers" :key="trainer.id">
                    <td>{{ index+1 }}</td>
                    <td>{{ trainer.name }}</td>
                    <td>{{ trainer.phone }}</td>
                    <td>{{ trainer.gender }}</td>
                    <td>{{ trainer.dob }}</td>
                    <td>{{ trainer.specialization }}</td>
                    <td>
                        <button class="btn btn-primary me-2 p-2" @click="openEditPopup(trainer.id)">Edit</button>
                        <button class="btn btn-danger p-2" @click="deleteTrainer(trainer.id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { useRoute } from "vue-router";
import axios from 'axios';
import TrainersPopup from '../popup/TrainersPopup.vue';

export default {
    components: {
        TrainersPopup,
    },
    data() {
        return {
            trainers: [],
            token : localStorage.getItem('token'),
            isPopupVisible: false,
            popupHeading: '', 
            formData: {
                id: '',
                name: '',
                phone: '',
                gender: '',
                dob: '',
                specialization: '',  
            },
        };
    },
    methods: {
        clearFormData() {
            this.formData = {};
        },
        async deleteTrainer(id) {
            var confirmation = confirm(`Deleted This Trainer with ID: ${id}`);
            if(confirmation == true){
                try {
                    const response = await axios.delete(this.$apiRoute+`/delete-trainer/${id}`,
                                        {
                                            headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${this.token}`,
                                            }
                                        });
                    this.$emit("form-submitted");
                    this.closePopup();
                    this.trainers = this.trainers.filter((trainer) => trainer.id !== id);
                    alert(`Deleted Trainer with ID: ${id}`);
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
            this.popupHeading = 'Insert Trainer';
        },
        async openEditPopup(id){
            const response = await fetch(this.$apiRoute+`/fetch-trainer/${id}`,{
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${this.token}`,
                                    },
                                });
            var respo = await response.json();
            if (response.ok) {
                if(respo.data.success){
                    const trainerdata = respo.data.trainer
                    this.formData = {
                                id: trainerdata.id,
                                name: trainerdata.name,
                                phone: trainerdata.phone,
                                gender: trainerdata.gender,
                                dob: trainerdata.dob,
                                specialization: trainerdata.specialization,
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
            this.popupHeading = 'Edit Trainer';
        },
        closePopup() {
            this.isPopupVisible = false;
        },
        async fetchData() {
            const response = await fetch(this.$apiRoute+`/get-trainers`,{
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${this.token}`,
                                    },
                                });
            var respo = await response.json();
            if (response.ok) {
                this.trainers = respo.data.Trainers; 
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