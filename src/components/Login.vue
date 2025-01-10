<template>
    <div id="app">
        <div class="loginBox">
            <div class="inner">
                <div class="signIn">
                    <div class="top">
                        <div class="title">LOGIN</div>
                    </div>
                    <form @submit.prevent="handleSubmit">
                        <div class="form">
                            <input required aria-required="true" aria-invalid="false" aria-label="E-mail" type="email"
                                class="w100" :class="{ invalid: email.error }" ref="email" placeholder="Email" autofocus
                                @blur="validateEmail" @keydown="validateEmail" v-model="email.value" />

                            <input required aria-required="true" type="password" class="w100"
                                :class="{ invalid: password.error }" placeholder="Password" v-model="password.value"
                                @blur="validatePassword" @keydown="validatePassword" />
                        </div>
                        <input type="submit" value="Submit" class="action"
                            :class="{ 'action-disabled': !loginValid || isLoading }"
                            :disabled="!loginValid || isLoading" />
                        <span v-if="isLoading">Loading...</span>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {

    data() {
        return {
            emailRegex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

            password: {
                value: "",
                error: false,
            },

            email: {
                value: "",
                error: false,
            },

            submittedData: null,
            isLoading: false,
        };
    },

    methods: {
        validateEmail() {
            this.email.error = this.email.value === "" || !this.emailRegex.test(this.email.value);
        },

        validatePassword() {
            this.password.error = this.password.value === "";
        },

        async handleSubmit() {
            this.validateEmail();
            this.validatePassword();

            if (this.loginValid) {
                this.isLoading = true;
                try {
                    const response = await axios.post(this.$apiRoute+`/login`, {
                        email: this.email.value,
                        password: this.password.value,
                    });

                    localStorage.setItem('token', response.data.token);

                    this.$router.push('/home');

                } catch (error) {
                    alert(error.message);
                } finally {
                    this.isLoading = false; // Set loading to false
                }
            } else {
                console.log("Validation failed.");
            }
        },

    },
    computed: {
        emailValid() {
            return this.emailRegex.test(this.email.value);
        },

        passwordValid() {
            return this.password.value.length > 0;
        },

        loginValid() {
            return this.emailValid && this.passwordValid;
        },

    }
};
</script>

<!-- Use preprocessors via the lang attribute! e.g. <style lang="scss"> -->
<style lang="scss">
    @mixin box {
        box-shadow: 1px 1px 2px 1px #ccc;
    }

    @mixin field {
        border: 1px solid #aaa;
        height: 40px;
        padding: 10px;
        margin-top: 20px;
        border-radius: 5px;
        box-sizing: border-box;
    }

    input[type="text"] {
        @include field;
    }

    input[type="email"] {
        @include field;
    }

    input[type="password"] {
        @include field;
    }

    .invalid {
        border: 2px solid red !important;

        &::placeholder {
            color: red;
        }
    }

    .errorMessage {
        color: red;
        margin: 10px;
        top: 5px;
    }

    .w100 {
        width: 100%;
    }

    #app {
        align-content: center;
    }

    .logo {
        width: 300px;
        margin-bottom: 10px;
    }

    .action {
        height: 40px;
        text-transform: uppercase;
        border-radius: 25px;
        width: 100%;
        border: none;
        cursor: pointer;
        background: green;
        margin-top: 20px;
        color: #fff;
        font-size: 1.2rem;
        @include box;
    }

    .action-disabled {
        color: #eee;
        background: #aaa;
        cursor: auto;
    }

    .top {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-bottom: 10px;
    }

    .title {
        width: 100%;
        font-size: 1.8rem;
        margin-bottom: 10px;
        text-align: center;
    }

    .subtitle {
        .subtitle-action {
            color: green;
            font-weight: bold;
            cursor: pointer;
        }
    }

    .loginBox {
        background: #fff;
        border-radius: 15px;
        max-width: 100%;
        padding: 25px 55px;
        animation: slideInTop 1s;
    }

    @keyframes slideInTop {
        from {
            opacity: 0;
            transform: translateY(-30%);
        }

        to {
            opacity: 100;
            transform: translateY(0%);
        }
    }

    @media screen and (min-width: 440px) {
        .loginBox {
            @include box;
        }
    }

    @media screen and (max-width: 440px) {
        html {
            background: #fff;
            align-items: start;
            justify-content: start;
        }

        .loginBox {
            padding: 25px 25px;
            max-width: 100%;
        }
    }
</style>
