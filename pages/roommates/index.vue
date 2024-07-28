<template>
    <div class="roommates">
        <PageHeader title="舍友大厅 | Matching Hall"></PageHeader>
        <el-row type="flex" justify="center">
            <el-col :span="20">
                <div class="default-container">
                    <el-row v-for="group in student_groups_with_score">
                        <el-col v-for=" student in group" :span="8" v-bind:key="student.id">
                            <div class="profile-card-container">
                                <div @click="jump(student)" class="profile-card">
                                    <el-row>
                                        <el-col :span="12">
                                            <el-avatar class="avatar" :src="avatar(student)"></el-avatar>
                                        </el-col>
                                        <el-col :span="12">
                                            <div class="text">
                                                <div class="name">{{ student.name }}
                                                    <label v-if="student.mbti==='INTJ'||student.mbti==='INTP'||student.mbti==='ENTP'||student.mbti==='ENTJ'" class= "mbti-label-NT">{{student.mbti}}</label>
                                                    <label v-if="student.mbti==='INFJ'||student.mbti==='INFP'||student.mbti==='ENFP'||student.mbti==='ENFJ'" class= "mbti-label-NF">{{student.mbti}}</label>
                                                    <label v-if="student.mbti==='ISTJ'||student.mbti==='ISFJ'||student.mbti==='ESTJ'||student.mbti==='ESFJ'" class= "mbti-label-SJ">{{student.mbti}}</label>
                                                    <label v-if="student.mbti==='ISTP'||student.mbti==='ISFP'||student.mbti==='ESTP'||student.mbti==='ESFP'" class= "mbti-label-SP">{{student.mbti}}</label>
                                                </div>
                                                <span class="score">匹配指数： <strong>{{ student.score | numRounding }}</strong></span>
                                                <div style="flex">
                                                    <span v-for="(trait, traitIndex) in getTraits(student.contact)" :key= "traitIndex" class="label">{{trait}}</span>
                                                </div>
                                                <div class="contact">
                                                    <div><strong>QQ: </strong>{{ student.QQ }}</div>
                                                    <div><strong>Wechat: </strong>{{student.Wechat }}</div>
<!--                                                    <div><strong>Phone: </strong>{{ student.Phone }}</div>-->
                                                </div>
                                            </div>
                                        </el-col>
                                    </el-row>
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
                            <div v-if="student.id != $auth.user.id" class="profile-card-container">
                                <div @click="jump(student)" class="profile-card no-score">
                                    <el-row>
                                        <el-col :span="12">
                                            <el-avatar class="avatar" :src="avatar(student)"></el-avatar>
                                        </el-col>
                                        <el-col :span="12">
                                            <div class="text">
                                                <div class="name">{{ student.name }}
                                                    <label v-if="student.mbti==='INTJ'||student.mbti==='INTP'||student.mbti==='ENTP'||student.mbti==='ENTJ'" class= "mbti-label-NT">{{student.mbti}}</label>
                                                    <label v-if="student.mbti==='INFJ'||student.mbti==='INFP'||student.mbti==='ENFP'||student.mbti==='ENFJ'" class= "mbti-label-NF">{{student.mbti}}</label>
                                                    <label v-if="student.mbti==='ISTJ'||student.mbti==='ISFJ'||student.mbti==='ESTJ'||student.mbti==='ESFJ'" class= "mbti-label-SJ">{{student.mbti}}</label>
                                                    <label v-if="student.mbti==='ISTP'||student.mbti==='ISFP'||student.mbti==='ESTP'||student.mbti==='ESFP'" class= "mbti-label-SP">{{student.mbti}}</label>
                                                </div>
                                                <div style="flex">
                                                    <span v-for="(trait, traitIndex) in getTraits(student.contact)" :key= "traitIndex" class="label">{{trait}}</span>
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
        },
        getTraits(contact){
            if(contact !== null && contact.length < 15){
                return contact.split(/[,，;；]/).map(trait => trait.trim());
            }else{
                return null;
            }

        }
    },
    async asyncData({$axios, $auth}) {
        let data = await $axios.$get("/team/recommend_teammates").then(data => {
            if (data.code === 200) {
                let student_groups_with_score = _.chunk(data.data.students_with_score, 3)
                let student_with_no_score = _.filter(data.data.students_with_no_score, function (n) {
                    return $auth.user.id !== n.id
                })
                let student_groups_with_no_score = _.chunk(student_with_no_score, 3)
                return {student_groups_with_score, student_groups_with_no_score}
            }
        })

        return data
    },
    filters: {
        numRounding(num) {
            num = parseFloat(num)
            if (!isNaN(num)) {
                return ((num + '').indexOf('.') == -1) ? num : num.toFixed(2);
            }
        }
    },
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Belanosima&family=Noto+Serif+SC&display=swap');
.profile-card-container {
    padding: 0 20px;
    margin: 20px 0;

    .profile-card {
        border: #e6e6e6 solid 1px;
        border-radius: 2px;
        min-height: 150px;
        cursor: pointer;


        .avatar {
            width: 100px;
            height: 100px;
            margin: 25px 25px;
            display: inline-block;
        }

        .text {
            display: inline-block;
            line-height: 1.5;
            overflow: hidden;
            font-family: 'Belanosima', sans-serif;
            font-family: 'Noto Serif SC', serif;

            .name{
                font-size: 20px;
                font-weight: bold;
            }

            .score{
                font-size: 14px;
                color: #242424;
                font-family: 'Belanosima', sans-serif;
                font-family: 'Noto Serif SC', serif;
            }

            /* Styling the label */
            .mbti-label-NT {
                display: inline-block;
                background-color: #9b5cff;
                color: #ffffff;
                font-size: 12px;
                padding: 3px 3px;
                border-radius: 10px;
                vertical-align: middle;
                font-family: 'Courier New', Courier, monospace;
            }

            .mbti-label-NF{
                display: inline-block;
                background-color: #00642a;
                color: #fff;
                font-size: 12px;
                padding: 3px 3px;
                border-radius: 10px;
                vertical-align: middle;
                font-family: 'Courier New', Courier, monospace;
            }

            .mbti-label-SJ{
                display: inline-block;
                background-color: #007bff;
                color: #fff;
                font-size: 12px;
                padding: 3px 3px;
                border-radius: 10px;
                vertical-align: middle;
                font-family: 'Courier New', Courier, monospace;
            }

            .mbti-label-SP{
                display: inline-block;
                background-color: #a69d83;
                color: #fff;
                font-size: 12px;
                padding: 3px 3px;
                border-radius: 10px;
                vertical-align: middle;
                font-family: 'Courier New', Courier, monospace;
            }

            .contact{
                font-size: 10px;
                color: #999;
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
