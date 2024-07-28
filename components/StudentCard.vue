<template>
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
                        <div>
                            <span v-for="(trait, traitIndex) in getTraits(student.contact)" :key= "traitIndex" class="label">{{trait}}</span>
                        </div>
                        <div class="contact">
                            <div><strong>QQ: </strong>{{ student.QQ }}</div>
                            <div><strong>Wechat: </strong>{{student.Wechat }}</div>
                            <div v-if="student.Phone"><strong>Phone: </strong>{{ student.Phone }}</div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import md5 from "md5";

export default {
    name: "StudentCard",
    props: {
        student: {
            type: Object,
            required: true
        }
    },
    methods: {
        avatar(student) {
            if (student.QQ && student.QQ.length > 0) {
                return "https://q.qlogo.cn/headimg_dl?dst_uin=" + student.QQ + "&spec=640&img_type=jpg";
            } else {
                const base_url = "https://gravatar.loli.net/avatar/";
                const email = new Date().getFullYear() + "rmmp." + student.id + "@chacuo.net";
                const hash = md5(email);
                return base_url + hash + "?d=retro";
            }
        },
        jump(student) {
            this.$router.push("/roommates/" + student.id);
        },
        getTraits(contact) {
            if (contact && contact.length < 15) {
                return contact.split(/[,，;；]/).map(trait => trait.trim());
            } else {
                return null;
            }
        },
        isNT(mbti) {
            return ['INTJ', 'INTP', 'ENTP', 'ENTJ'].includes(mbti);
        },
        isNF(mbti) {
            return ['INFJ', 'INFP', 'ENFP', 'ENFJ'].includes(mbti);
        },
        isSJ(mbti) {
            return ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'].includes(mbti);
        },
        isSP(mbti) {
            return ['ISTP', 'ISFP', 'ESTP', 'ESFP'].includes(mbti);
        }
    },
    filters: {
        numRounding(num) {
            num = parseFloat(num);
            return isNaN(num) ? num : num.toFixed(2);
        }
    }
};
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
