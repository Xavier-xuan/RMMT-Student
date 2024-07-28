<template>
    <div class="roommates">
        <PageHeader title="舍友大厅 | Matching Hall"></PageHeader>
        <el-row type="flex" justify="center">
            <el-col :span="20">
                <div class="default-container">
                    <el-row v-for="group in student_groups_with_score">
                        <el-col v-for=" student in group" :span="8" v-bind:key="student.id">
                            <StudentCard :student="student" />
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
            student_groups_with_no_score: []
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

</style>
