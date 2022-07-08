<template>
    <div class="roommates">
        <PageHeader title="舍友大厅 | Matching Hall"></PageHeader>
        <el-row type="flex" justify="center">
            <el-col :span="20">
                <div class="default-container">
                    <el-row v-for="group in student_groups_with_score" >
                        <el-col v-for=" student in group" :span="8" v-bind:key="student.id">
                            <div v-if="student.id != $auth.user.id" class="profile-card-container">
                                <div @click="jump(student)" class="profile-card">
                                    <el-avatar class="avatar" :src="avatar(student)"></el-avatar>
                                    <div class="text">
                                        <div class="name">姓名： {{ student.name }}</div>
                                        <div class="score">奇异指数： {{ student.score }}</div>
                                        <div class="contact">联系方式：
                                            <br/>
                                            {{ student.contact }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>

        <el-row type="flex" justify="center">
            <el-col :span="20">
                <div class="default-container">
                    <el-row v-for="group in student_groups_with_no_score">
                        <el-col v-for=" student in group" :span="8">
                            <div  v-if="student.id != $auth.user.id" class="profile-card-container">
                                <div @click="jump(student)"  class="profile-card no-score">
                                    <el-avatar class="avatar" :src="avatar(student)"></el-avatar>
                                    <div class="text">
                                        <div class="name">姓名： {{ student.name }}</div>
                                        <div class="contact">联系方式：
                                            <br/>
                                            {{ student.contact }}
                                        </div>
                                    </div>
                                </div>
                            </div>
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
    data() {
        return {
            student_groups_with_score: [],
            student_groups_with_no_score: []
        }
    },
    methods: {
        avatar(student) {
            let base_url = "https://gravatar.loli.net/avatar/"
            let email = new Date().getFullYear() + "rmmp." + student.id + "@chacuo.net"
            let hash = md5(email)
            return base_url + hash + "?d=retro"
        },
        jump(student) {
            this.$router.push("/roommates/" + student.id)
        }
    },
    async asyncData({$axios}) {
        let data = await $axios.$get("/team/recommend_teammates").then(data => {
            if (data.code === 200) {
                let student_groups_with_score = _.chunk(data.data.students_with_score, 3)
                let student_groups_with_no_score = _.chunk(data.data.students_with_no_score, 3)
                return {student_groups_with_score, student_groups_with_no_score}
            }
        })

        return data
    },


}
</script>

<style lang="scss" scoped>
.profile-card-container {
    padding: 0 20px;
    margin: 20px 0;

    .profile-card {
        border: #e6e6e6 solid 1px;
        border-radius: 2px;
        height: 150px;
        position: relative;
        cursor: pointer;


        .avatar {
            width: 100px;
            height: 100px;
            margin: 25px 25px;
            display: inline-block;
        }

        .text {
            display: inline-block;
            position: absolute;
            top: 30px;
            line-height: 1.5;
        }
    }

    .profile-card:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    }

    .profile-card.no-score .text {
        top: 40px;
    }

}


</style>
