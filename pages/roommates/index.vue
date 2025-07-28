<template>
    <div class="roommates">
        <PageHeader title="舍友大厅 | Matching Hall"></PageHeader>
        <el-row type="flex" justify="center" class="mb-4">
            <el-switch
                v-model="onlyShowUnteamed"
                active-text="仅显示未组队/未满员同学"
                inactive-text="显示所有推荐"
            />
        </el-row>
        <el-row type="flex" justify="center">
            <el-col :span="20">
                <div class="default-container">
                    <el-row v-for="group in filtered_student_groups_with_score" :key="group[0].id">
                        <el-col
                            v-for="student in group"
                            :key="student.id"
                            :span="8"
                            :xs="24"
                            :sm="12"
                            :md="8"
                        >
                            <StudentCard :student="student" />
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>

        <el-row type="flex" justify="center">
            <el-col :span="20">
                <div class="default-container">
                    <el-row v-for="group in filtered_student_groups_with_no_score" :key="group[0].id">
                        <el-col
                            v-for="student in group"
                            :key="student.id"
                            :span="8"
                            :xs="24"
                            :sm="12"
                            :md="8"
                        >
                            <StudentCard :student="student" v-if="student.id != $auth.user.id" />
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
            student_groups_with_no_score: [],
            onlyShowUnteamed: false
        }
    },
    computed: {
        filtered_student_groups_with_score() {
            if (!this.onlyShowUnteamed) return this.student_groups_with_score
            const unteamed = this.student_groups_with_score
            .flat()
            .filter(student => student.team_students_num < 4)
            return _.chunk(unteamed, 3)
        },
        filtered_student_groups_with_no_score() {
            if (!this.onlyShowUnteamed) return this.student_groups_with_no_score
            const unteamed = this.student_groups_with_no_score
            .flat()
            .filter(student => student.team_students_num < 4)
            return _.chunk(unteamed, 3)
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
.roommates {
  padding: 8px;
}
.default-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 8px 0;
}
@media (max-width: 768px) {
  .default-container {
    padding: 0 4px;
  }
  .roommates {
    padding: 4px;
  }
}
</style>
