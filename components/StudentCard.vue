<template>
    <div class="profile-card-container">
        <div @click="jump(student)" class="profile-card">
            <el-row>
                <el-col :span="9">
                    <el-avatar class="avatar" :src="avatar(student)"></el-avatar>
                    <span v-if="student.team_students_num !== undefined" :class="['team-flag', teamFlagColor(student.team_students_num)]">
                        <template v-if="student.team_students_num === 0">未组队</template>
                        <template v-else-if="student.team_students_num == 4">满员</template>
                        <template v-else>{{ student.team_students_num }}/4</template>
                    </span>
                </el-col>
                <el-col :span="15">
                    <div class="text">
                        <div class="name" v-if="student.province !== null"> 
                            <div class="province">来自{{ student.province }}的</div> 
                            {{ student.name }} 
                            <label v-if="isNT(student.mbti)" class= "mbti-label-NT">{{student.mbti}}</label>
                            <label v-if="isNF(student.mbti)"" class= "mbti-label-NF">{{student.mbti}}</label>
                            <label v-if="isSJ(student.mbti)" class= "mbti-label-SJ">{{student.mbti}}</label>
                            <label v-if="isSP(student.mbti)" class= "mbti-label-SP">{{student.mbti}}</label>
                        </div>
                        <div class="name" v-else> {{ student.name }} 
                            <label v-if="isNT(student.mbti)" class= "mbti-label-NT">{{student.mbti}}</label>
                            <label v-if="isNF(student.mbti)"" class= "mbti-label-NF">{{student.mbti}}</label>
                            <label v-if="isSJ(student.mbti)" class= "mbti-label-SJ">{{student.mbti}}</label>
                            <label v-if="isSP(student.mbti)" class= "mbti-label-SP">{{student.mbti}}</label>
                        </div>
                        <span class="score">匹配指数： <strong>{{ student.score | numRounding }}</strong></span>
                        <div>
                            <span v-for="(trait, traitIndex) in getTraits(student.contact)" :key= "traitIndex" class="label">{{trait}}</span>
                        </div>
                        <div class="contact">
                            <div><strong>QQ: </strong>{{ student.qq }}</div>
                            <div><strong>Wechat: </strong>{{student.wechat }}</div>
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
            if (student.qq && student.qq.length > 0) {
                return "https://q.qlogo.cn/headimg_dl?dst_uin=" + student.qq + "&spec=640";
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
        },
        teamFlagColor(num) {
            if (num === 0) return 'flag-green';
            if (num === 4) return 'flag-red';
            return 'flag-orange';
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
    container-type: inline-size;

    .profile-card {
        border: #e6e6e6 solid 2px;
        border-radius: 12px;
        min-height: 170px;
        cursor: pointer;

        .avatar {
            width: 100px;
            height: 100px;
            margin: 30px 30px;
            display: inline-block;
        }

        .team-flag {
            position: absolute;
            top: 0px;
            right: 0px;
            z-index: 20;
            padding: 2px 12px 2px 12px;
            border-radius: 0 10px 0 12px;
            font-size: 13px;
            font-weight: bold;
            color: #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .flag-green {
            background: #4caf50;
        }
        .flag-red {
            background: #ff5252;
        }
        .flag-orange {
            background: #ff9800;
        }

        .text {
            display: inline-block;
            line-height: 1.5;
            overflow: hidden;
            margin: 30px 40px;
            font-family: 'Belanosima', sans-serif;
            font-family: 'Noto Serif SC', serif;

            .name{
                font-size: 20px;
                font-weight: bold;

                .province{
                    font-size: 10px
                }
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

@container (max-width: 250px) {
  .avatar {
    display: none !important;
  }
}

// 移动端适配
@media (max-width: 768px) {
  .info-flex {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .avatar {
    width: 70px !important;
    height: 70px !important;
    margin: 0 0 10px 0;
    display: block;
  }
  .basic-info {
    width: 100%;
    margin-left: 0;
    font-size: 14px;
    text-align: center;
    word-break: break-all;
  }
}

</style>
