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
                            <label for="email">E-Mail:</label>
                            <input type="email" :class="{ invalid: emailError }" id="email" v-model="formData.email" @blur="validateEmail" @keydown="validateEmail" placeholder="Enter your email" required />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="gender">D.O.B:</label>
                            <input type="date" id="dob" v-model="formData.dob" pattern="\d{4}-\d{2}-\d{2}" placeholder="YYYY-MM-DD" required />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="profile_pic">Profile Picture:</label>
                            <input type="file" id="profile_pic" accept="image/png, image/gif, image/jpeg, image/jpg" @change="handleFileChange"  />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <button type="submit">Submit</button>
                        <button type="button" @click="closePopup" class="cancel-button">Cancel</button>
                    </div>
                    <div class="col-md-6">
                        <div v-if="formData.profile_pic_url">
                            <p>Profile Picture:</p>
                            <img :src="base64Image" alt="Profile Picture" />
                        </div>
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
            default: 'Insert Member',
        },
        formData:{
            type: Object,
            default: ({ id:'', name: '', phone: '', gender: '', email: '', dob: '', profile_pic: '', profile_pic_url:'', type: '' }),
        }
    },
    data() {
        return {
            nameError : "",
            phoneError : "",
            genderError : "",
            emailError : "",
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
        validateEmail() {
            this.emailError = this.formData.email === ""  || typeof this.formData.email === "undefined" ? true : false;
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
        convertToBase64(file) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                this.formData.profile_pic = e.target.result; // The Base64 string
                this.base64Image = e.target.result; // The Base64 string
            };
            
            reader.readAsDataURL(file); // Convert the file to Base64
        },
        convertToBase64FromUrl(url){
            const img = new Image();
            img.crossOrigin = "Anonymous"; // To handle CORS issues for external images

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                // Get the Base64 string from canvas
                this.base64Image = canvas.toDataURL();
            };

            img.src = url;
        },

        async handleSubmit() {
            this.validateName();
            this.validatePhone();
            this.validateGender();
            this.validateEmail();
            if(this.formData.type == 'insert'){
                try {
                    const response = await axios.post(this.$apiRoute+`/add-member`,{
                            name:this.formData.name,
                            phone:this.formData.phone,
                            gender:this.formData.gender,
                            email:this.formData.email,
                            dob:this.formData.dob,
                            profile_pic:this.formData.profile_pic,
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
            }else if(this.formData.type == "update"){
                try {
                    const response = await axios.post(this.$apiRoute+`/edit-member`,{
                            id:this.formData.id,
                            name:this.formData.name,
                            phone:this.formData.phone,
                            gender:this.formData.gender,
                            email:this.formData.email,
                            dob:this.formData.dob,
                            profile_pic:this.formData.profile_pic,
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
            this.emailError = "";
            if (this.formData.profile_pic_url && this.formData.profile_pic_url != null) {
                this.convertToBase64FromUrl(this.formData.profile_pic_url);
            }
        },
        file(newFile) {
            if (newFile) {
                this.convertToBase64(newFile);
            }
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