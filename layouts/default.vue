<template>

    <div>
        <el-container>
            <el-header>

                <el-row class="header" align="middle" type="flex">
                    <el-col class="site-name" :span="6">
                        <a href="/">Roommate Matcher</a>
                    </el-col>

                    <el-col class="menu" :span="18" :offset="4" style="overflow: hidden">
                        <el-menu ref="navigation_bar" mode="horizontal" :default-active="navUrl"
                                 :router="true">
                            <el-menu-item index="/guide">向导 Guide</el-menu-item>

                            <el-menu-item index="/questionnaire">问卷 Questionnaire</el-menu-item>

                            <el-menu-item index="/roommates">舍友大厅 Matching Hall</el-menu-item>


                            <el-menu-item v-if="$auth.user.team == null" index="/team/requests"> 组队请求 | Team Requests
                            </el-menu-item>

                            <el-menu-item v-else index="/team/my"> 我的组队 | My Team</el-menu-item>

                            <el-submenu index="account">
                                <template slot="title">Hello，{{ this.$auth.user.name }}</template>
                                <el-menu-item @click="show_update_contact_panel = true">更新联系方式 Update Contact Info
                                </el-menu-item>
                                <el-menu-item @click="show_change_password_panel = true">修改密码 Change Password
                                </el-menu-item>
                                <el-menu-item @click="logout">退出登录 Logout</el-menu-item>
                            </el-submenu>
                        </el-menu>
                    </el-col>
                </el-row>

            </el-header>

            <el-main>
                <Nuxt/>
            </el-main>
        </el-container>

        <el-dialog :visible.sync="show_change_password_panel" title="修改密码" width="600px">
            <el-form ref="change_password_panel" :rules="rules" :model="change_password" label-width="100px">
                <el-form-item label="当前密码" prop="current_password">
                    <el-input type="password" v-model="change_password.current_password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="new_password">
                    <el-input type="password" v-model="change_password.new_password" autocomplete="off"
                              placeholder="新密码不能少于八位"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirm_password">
                    <el-input type="password" v-model="change_password.confirm_password" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="show_change_password_panel = false">取消</el-button>
                <el-button type="primary" @click="do_change_password">确认</el-button>
            </div>
        </el-dialog>

        <el-dialog title="更新联系方式 | Update Contact Information" :visible.sync="show_update_contact_panel">
            <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="你想让别人通过什么方式联系上你？
QQ: xxxxxxxx
Wechat: xxxxxxxx"
                v-model="contact">
            </el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="show_update_contact_panel = false">取 消</el-button>
                <el-button type="primary" @click="do_update_contact">确 定</el-button>
            </div>
        </el-dialog>
    </div>


</template>

<script>
export default {
    name: "default",
    data() {
        let confirm_password = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.change_password.new_password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            navUrl: null,
            show_change_password_panel: false,
            change_password: {
                current_password: null,
                new_password: null,
                confirm_password: null
            },
            rules: {
                current_password: [{
                    type: 'string',
                    pattern: /^[^\s]*$/,
                    message: "密码必须大于八位",
                    required: true,
                    min: 8,
                    trigger: 'blur'

                }],
                new_password: [{
                    type: 'string',
                    pattern: /^[^\s]*$/,
                    message: "新密码必须大于八位",
                    required: true,
                    min: 8,
                    trigger: 'blur'

                }],
                confirm_password: [
                    {validator: confirm_password, trigger: 'blur'}
                ],
            },
            show_update_contact_panel: this.$auth.user.contact == null,
            contact: _.cloneDeep(this.$auth.user.contact)
        }
    },
    methods: {
        logout() {
            this.$auth.logout()
        },
        do_change_password() {
            this.$refs['change_password_panel'].validate(valid => {
                if (!valid) return;
                this.$axios.$post('/change_password', {
                    'current_password': this.change_password.current_password,
                    'new_password': this.change_password.new_password
                }).then(data => {
                    if (data.code === 200) {
                        this.show_change_password_panel = false
                        this.$refs['change_password_panel'].resetFields()
                        this.$message.success("修改密码成功！")
                    }
                })
            })
        },
        do_update_contact() {
            this.$axios.$post("/update_contact", {
                contact: this.contact
            }).then(data => {
                if (data.code === 200) {
                    this.$message.success("你的联系方式已更新")
                    this.show_update_contact_panel = false
                }
            })
        }
    },
    created() {
        this.navUrl = this.$route.path

        // 五分钟发送一次心跳包 刷新token
        setInterval(async () => {
            await this.$auth.fetchUser()
        }, 5 * 60 * 1000)
    }
}
</script>

<style scoped>
.header {
    height: 100%;
    border-bottom: solid 1px #e6e6e6;

}

.site-name {
    text-align: center;
}

a {
    font-family: Consolas, sans-serif;
    text-decoration: none;
    color: rgba(0, 0, 0, .87);
    font-size: 2rem;
}

.el-header {
    background: #ffffff;
}
</style>
