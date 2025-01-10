<template>
    <div v-if="isVisible" class="popup-overlay" @click.self="closePopup">
        <div class="popup-content">
            <!-- Dynamically displaying the passed heading -->
            <h3 class="mb-4">{{ popupHeading }}</h3>

            <!-- Form -->
            <form @submit.prevent="handleSubmit">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="name">Name:</label>
                            <input type="text" :class="{ invalid: nameError }" id="name" v-model="formData.name" @blur="validateName" @keydown="validateName" placeholder="Enter your name" required />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="phone">Phone:</label>
                            <input type="text" :class="{ invalid: phoneError }" id="phone" v-model="formData.phone" @blur="validatePhone" @keydown="validatePhone" placeholder="Enter your Phone Number" required />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="gender">Gender:</label>
                            <input type="text" :class="{ invalid: genderError }" id="gender" v-model="formData.gender" @blur="validateGender" @keydown="validateGender" placeholder="Enter your gender" required />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="gender">D.O.B:</label>
                            <input type="date" id="dob" v-model="formData.dob" pattern="\d{4}-\d{2}-\d{2}" placeholder="YYYY-MM-DD" required />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="gender">Specialization</label>
                            <input type="text" id="specialization" :class="{ invalid: specializationError }" v-model="formData.specialization" placeholder="Specialization" required />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <button type="submit">Submit</button>
                        <button type="button" @click="closePopup" class="cancel-button">Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    props: {
        isVisible: {
            type: Boolean,
            default: false,
        },
        popupHeading: {
            type: String,
            default: 'Insert Trainer',
        },
        formData:{
            type: Object,
            default: ({ id:'', name: '', phone: '', gender: '', dob: '', specialization: '', type: '' }),
        }
    },
    data() {
        return {
            nameError : "",
            phoneError : "",
            genderError : "",
            specializationError : "",
            token : localStorage.getItem('token'),
            file: null,
            base64Image: null, 
        };
    },
    methods: {
        validateName() {
            this.nameError = this.formData.name === "" || typeof this.formData.name === "undefined" ? true : false;
        },
        validatePhone() {
            this.phoneError = this.formData.phone === "" || typeof this.formData.phone === "undefined" ? true : false;
        },
        validateGender() {
            this.genderError = this.formData.gender === "" || typeof this.formData.gender === "undefined" ? true : false;
        },
        validateSpecialization() {
            this.specializationError = this.formData.specialization === ""  || typeof this.formData.specialization === "undefined" ? true : false;
        },

        closePopup() {
            this.$emit('update:isVisible', false);
        },
        handleFileChange(event) {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                this.file = selectedFile; // Update the file property
            }
        },
        async handleSubmit() {
            this.validateName();
            this.validatePhone();
            this.validateGender();
            this.validateSpecialization();
            if(this.formData.type == 'insert'){
                try {
                    const response = await axios.post(this.$apiRoute+`/add-trainer`,{
                            name:this.formData.name,
                            phone:this.formData.phone,
                            gender:this.formData.gender,
                            dob:this.formData.dob,
                            specialization:this.formData.specialization,
                        },
                        {
                            headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${this.token}`,
                            }
                        });
                    alert(response.data.message);
                    this.$emit("form-submitted");
                    this.closePopup();
                    window.location.reload();
                } catch (error) {
                    if(error.status == 400){
                        if(error.response.data.errors.name){
                            alert(error.response.data.errors.name);
                        }
                        if(error.response.data.errors.phone){
                            alert(error.response.data.errors.phone);
                        }
                        if(error.response.data.errors.gender){
                            alert(error.response.data.errors.gender);
                        }
                        if(error.response.data.errors.dob){
                            alert(error.response.data.errors.dob);
                        }
                        if(error.response.data.errors.specialization){
                            alert(error.response.data.errors.specialization);
                        }
                    }
                    else{
                        alert(error.response.data);
                    }
                } 
            }else if(this.formData.type == "update"){
                try {
                    const response = await axios.post(this.$apiRoute+`/edit-trainer`,{
                            id:this.formData.id,
                            name:this.formData.name,
                            phone:this.formData.phone,
                            gender:this.formData.gender,
                            dob:this.formData.dob,
                            specialization:this.formData.specialization,
                        },
                        {
                            headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${this.token}`,
                            }
                        });
                    this.$emit("form-submitted");
                    this.closePopup();
                    window.location.reload();
                    alert(response.data.message);

                } catch (error) {
                    if(error.status == 400){
                        if(error.response.data.errors.name){
                            alert(error.response.data.errors.name);
                        }
                        if(error.response.data.errors.phone){
                            alert(error.response.data.errors.phone);
                        }
                        if(error.response.data.errors.gender){
                            alert(error.response.data.errors.gender);
                        }
                        if(error.response.data.errors.email){
                            alert(error.response.data.errors.email);
                        }
                        if(error.response.data.errors.dob){
                            alert(error.response.data.errors.dob);
                        }
                        if(error.response.data.errors.profile_pic){
                            alert(error.response.data.errors.profile_pic);
                        }
                    }
                    else{
                        alert(error.response.data);
                    }
                } 
            }
            
        },  
    },  

    watch: {
        isVisible(newValue, oldValue) {
            this.nameError = "";
            this.phoneError = "";
            this.genderError = "";
            this.specializationError = "";
        },
    },
};
</script>

<style scoped>
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 55%;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

button {
    padding: 10px;
    background-color: green;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    margin-right: 10px;
}

button[type="button"].cancel-button {
    background-color: red;
}

button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
}
input {
    margin-top:8px;
}
</style>