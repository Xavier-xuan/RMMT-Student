<template>
    <div class="login-box">
        <div class="login-card">
            <ZhixinLogo class="zhixin-logo"></ZhixinLogo>
            <div class="logo">
                RMMT Student
            </div>
            <div class="login-form">
                <el-form ref="login_form" :model="login_form" :rules="rules" label-position="top">
                    <el-form-item label="ID" prop="id">
                        <el-input v-model.number="login_form.id"></el-input>
                    </el-form-item>

                    <el-form-item label="Password" prop="password">
                        <el-input type="password" v-model="login_form.password"></el-input>
                    </el-form-item>

                    <el-button type="primary" @click="login" style="width:100%;">Login</el-button>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "login",
    auth: 'guest',
    layout: "auth",
    data() {
        return {
            login_form: {
                id: null,
                password: ""
            },
            rules: {
                id: {
                    type: 'number',
                    required: true,
                    trigger: 'blur'
                },
                password: {
                    type: 'string',
                    pattern: /^[^\s]*$/,
                    message: "The password must be a string of at least 8 characters",
                    required: true,
                    min: 8,
                    trigger: 'blur'

                }
            }
        }
    },
    methods: {
        login: _.throttle(async function () {
            this.$refs['login_form'].validate(async (valid) => {
                if (valid) {
                    try {
                        let response = await this.$auth.login({
                            data: this.login_form
                        })

                        if (response.data.code === 200) {
                            this.$message.success("Welcome " + this.$auth.user.name + "!")
                        }

                    } catch (e) {
                        console.error(e)
                    }

                    return true
                } else {
                    return false
                }
            })
        }, 3000)
    }
}

</script>

<style scoped>
.login-box {
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background: #f5f6fa;
    background-image: url('/login-background.jpg'); 
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.login-form {
    padding: 32px 16px;
}

.login-card {
    width: 350px;
    max-width: 95vw;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 16px 0 24px 0;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.logo {
    margin-top: 20px;
    text-align: center;
    font-family: Consolas, fantasy;
    font-size: 2rem;
}

.zhixin-logo {
    text-align: center;
}

@media (max-width: 600px) {
    .login-box {
        background-image: none;
        background-color: #f5f6fa;
    }
    .login-card {
        width: 100%;
        min-width: unset;
        box-shadow: none;
        border-radius: 0;
        padding: 8px 0 16px 0;
    }
    .login-form {
        padding: 24px 4vw;
    }
    .logo {
        font-size: 1.5rem;
    }
}
</style>
