<!-- pages/cas_handler.vue -->
<template>
    <div class="cas-handler">
        <div class="loading-container">
            <el-icon class="loading-icon" :class="status">
                <component :is="statusIcon" />
            </el-icon>
            <div class="loading-text">{{ statusText }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "cas_handler",
    auth: false,
    layout: "auth",
    data() {
        return {
            status: "loading", // loading, success, error
            statusText: "正在处理CAS认证..."
        }
    },
    computed: {
        statusIcon() {
            return {
                loading: "el-icon-loading",
                success: "el-icon-success",
                error: "el-icon-error"
            }[this.status]
        }
    },
    async mounted() {
        const { token, error } = this.$route.query
        
        try {
            if (token) {
                // 成功获取token
                await this.$auth.setUserToken(token)
                await this.$auth.fetchUser()
                
                this.status = "success"
                this.statusText = "登录成功，正在跳转..."
                
                // 显示欢迎消息
                this.$notify({
                    title: "登录成功",
                    message: `欢迎 ${this.$auth.user.name}`,
                    type: "success"
                })
                
                // 跳转到首页
                setTimeout(() => {
                    this.$router.push("/")
                }, 1500)
            } else if (error) {
                // 处理错误情况
                this.status = "error"
                this.statusText = this.getErrorMessage(error)
                
                // 显示错误通知
                this.$notify.error({
                    title: "CAS登录失败",
                    message: this.getErrorMessage(error)
                })
                
                // 5秒后返回登录页
                setTimeout(() => {
                    this.$router.push("/login")
                }, 5000)
            } else {
                // 无效的访问
                this.status = "error"
                this.statusText = "无效的访问参数"
                setTimeout(() => {
                    this.$router.push("/login")
                }, 3000)
            }
        } catch (err) {
            console.error("CAS处理错误:", err)
            this.status = "error"
            this.statusText = "处理认证时发生错误"
            this.$notify.error({
                title: "系统错误",
                message: err.message
            })
            setTimeout(() => {
                this.$router.push("/login")
            }, 5000)
        }
    },
    methods: {
        getErrorMessage(error) {
            const messages = {
                "invalid_ticket": "无效的认证票据，请重试",
                "user_not_found": "您的账号未注册，请联系管理员",
                "server_error": "服务器处理认证时出错",
                "timeout": "认证超时，请重新登录",
                "default": "认证过程中发生错误"
            }
            return messages[error] || messages.default
        }
    }
}
</script>

<style scoped>
.cas-handler {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f7fa;
}

.loading-container {
    text-align: center;
    padding: 40px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.loading-icon {
    font-size: 64px;
    margin-bottom: 24px;
}

.loading-icon.loading {
    color: #409eff;
    animation: rotating 2s linear infinite;
}

.loading-icon.success {
    color: #67c23a;
}

.loading-icon.error {
    color: #f56c6c;
}

.loading-text {
    font-size: 18px;
    color: #606266;
    margin-top: 16px;
}

@keyframes rotating {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 768px) {
    .loading-container {
        width: 80%;
        padding: 30px 20px;
    }
    
    .loading-icon {
        font-size: 48px;
    }
    
    .loading-text {
        font-size: 16px;
    }
}
</style>