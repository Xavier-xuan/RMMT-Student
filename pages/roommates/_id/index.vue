<template>
    <div class="student-detail">
        <PageHeader>
            <template #title>
                {{ name }} 的资料卡片 | {{ name }} 's Profile
            </template>
        </PageHeader>
        <el-row type="flex" justify="center">
            <el-col :span="20">
                <div class="default-container detail">
                    <el-avatar class="avatar" shape="square" :src="avatar(id)"></el-avatar>
                    <div class="basic-info">
                        <div class="name">姓名： {{ name }}</div>
                        <div class="team">组队状态：
                            <span class="green" v-if="team === null">
                                未组队
                                                        <el-button v-if="$auth.user.team == null" type="success"
                                                                   size="small"
                                                                   @click="team_up">与他组队</el-button>
                            </span>
                            <span class="red" v-else-if="team.students.length == 4"> 已组队 队已满员 </span>
                            <span class="orange" v-else> 已组队 </span>
                        </div>
                        <div class="score">奇异指数：
                            <span v-if="score!= null">{{ Number(score).toFixed(2) }}</span>
                            <span v-else style="color: #F56C6C">未计算</span>
                        </div>
                        <div class="score">性格特点：
                        <span v-for="(trait, traitIndex) in getTraits(contact)" :key= "traitIndex" class="label" style="flex">{{trait}}</span>
                        </div>
                        <div class="contact">
                            <div><strong>QQ: </strong>{{ QQ }}</div>
                            <div><strong>Wechat: </strong>{{ Wechat }}</div>
                            <div><strong>Phone: </strong>{{ Phone }}</div>
                        </div>
                        <div v-if="team == null">
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>

        <el-row v-if="team!==null" type="flex" justify="center">
            <el-col :span="20">
                <div class="default-container">
                    <el-row>
                        <el-col :span="8">
                            <div class="card-title">
                                Ta 的队伍 | His/Her Team
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col v-for=" student in team.students" v-if="student.id !== id" :span="8"
                                v-bind:key="student.id">
                            <div class="profile-card-container">
                                <div @click="jump(student)" class="profile-card">
                                    <el-row>
                                        <el-col :span="12">
                                            <el-avatar class="avatar" :src="avatar(student.id)"></el-avatar>

                                        </el-col>
                                        <el-col :span="12">
                                            <div class="text">
                                                <div class="name">姓名： {{ student.name }}</div>
                                                <div class="score">奇异指数：
                                                    <span v-if="student.score!== null">{{ Number(student.score).toFixed(2) }}</span>
                                                    <span v-else style="color: #F56C6C">未计算</span>
                                                </div>
                                                <div class="score">性格特点：
                                                    <br/>
                                                    <div style="flex">
                                                        <span v-for="(trait, traitIndex) in getTraits(student.contact)" :key= "traitIndex" class="label">{{trait}}</span>
                                                    </div>
                                                </div>
                                                <div class="contact">
                                                    <div><strong>QQ: </strong>{{ student.QQ }}</div>
                                                    <div><strong>Wechat: </strong>{{student.Wechat }}</div>
                                                    <div><strong>Phone: </strong>{{ student.Phone }}</div>
                                                </div>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="2" :offset="22">
                            <el-button :disabled="team.students.length === 4 || $auth.user.team_id !== null"
                                       @click="join_team(team)" type="primary"
                                       size="large">Join
                            </el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>

        <el-row type="flex" v-if="has_answered_questionnaire" justify="center">
            <el-col :span="20">
                <div class="default-container ">
                    <el-row>
                        <el-col :span="24">
                            <div class="card-title">
                                Ta 的问卷 | His/Her Questionnaire
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="16">
                            <v-form-render v-on:formChange="preventChange" v-on:keyboard="preventChange" v-on:click="preventChange" :form-json="formJson" :form-data="formData" ref="vFormRef">
                            </v-form-render>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import md5 from "md5";

export default {
    name: "index",
    components: {},

    data() {
        return {
            id: null,
            name: null,
            contact: null,
            QQ: null,
            Wechat: null,
            Phone: null,
            team_id: null,
            team: null,
            has_answered_questionnaire: false,
            questionnaire_answers: null,
            formData: null,
            formDataCopy: null,
            score: null,
            inPrevent: false
        }
    },
    methods: {
        avatar(id) {
            let base_url = "https://gravatar.loli.net/avatar/"
            let email = new Date().getFullYear() + "rmmp." + id + "@chacuo.net"
            let hash = md5(email)
            return base_url + hash + "?d=retro"
        },
        jump(student) {
            this.$router.push("/roommates/" + student.id)
        },
        join_team(team) {
            this.$confirm('你确定已经和这个队伍里所有的成员充分沟通过，了解并且能够接受他们所有的生活习惯吗？', '确认操作', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.$axios.$post("/team/request", {
                    "team_id": team.id,
                }).then(data => {
                    if (data.code === 200) {
                        this.$message.success("入队申请已发出")
                    }
                })
            })

        },
        team_up() {
            this.$confirm('你确定已经和这位同学充分沟通过，了解并能接受他所有的生活习惯吗？', '确认操作', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.$axios.$post("/team/invite", {
                    target_student_id: this.id
                }).then(data => {
                    if (data.code === 200) {
                        this.$message.success("组队邀请已发出")
                    }
                })

            })
        },
        preventChange(fieldName, newValue, oldValue, formModel, subFormName, subFormRowIndex) {
            // avoid circular triggering
            if (!this.inPrevent) {
                this.$message.warning("这是别人的问卷，你只能查看不能修改哦~")
                this.inPrevent = true
                this.$refs.vFormRef.setFormData(this.formDataCopy)
                this.inPrevent = false
            }
        },
        getTraits(contact){
            if(contact !== null && contact.length < 15){
                return contact.split(';').map(trait => trait.trim());
            }else{
                return null;
            }
        }
    },
    computed: {
        formJson() {
            return _.cloneDeep(this.$store.state.system_settings.questionnaire_json)
        }
    },
    async asyncData({$axios, params}) {
        let data = await $axios.$get("/student/" + params.id).then(data => {
            if (data.code === 200)
                return data.data
        })

        if (data.team !== null) {
            let students_with_score = await $axios.$get("/team/recommend_teammates").then(data => {
                return data.data.students_with_score;
            })

            for (let student of data.team.students) {
                let student_with_score = _.find(students_with_score, {id: student.id})
                if (student_with_score !== undefined) {
                    student.score = student_with_score.score
                } else {
                    student.score = null
                }
            }
        }

        if (data.has_answered_questionnaire) {
            function convert_data(str) {
                try {
                    let obj = JSON.parse(str);
                    return obj
                } catch (e) {
                    return str
                }
            }

            let formData = {}
            data.questionnaire_answers.forEach(element => {
                formData[element.item_id] = convert_data(element.answer)
            })

            data.formData = formData
            data.formDataCopy = _.cloneDeep(formData)
        }

        return data
    },
    async fetch({store}) {
        if (store.state.system_settings.step_1_start_at === null)
            await store.dispatch("refresh_system_settings")
    },
    created() {
        if (this.has_answered_questionnaire) {
            this.$nextTick(() => {
                // this.$refs.vFormRef.disableForm()
            })
        }

    }
}
</script>

<style lang="scss" scoped>
.orange {
    color: #E6A23C;
}

.green {
    color: #67C23A;
}

.red {
    color: #F56C6C;
}

.label{
    display: inline-block;
    background-color: #ffae00d7;
    color: #fff;
    font-size: 8px;
    padding: 2px 4px;
    border-radius: 4px;
    vertical-align: middle;
    font-family: Arial, Helvetica, sans-serif;
    margin: 2px;
}
.contact{
    font-size: 14px;
    color: #999;
}

</style>
