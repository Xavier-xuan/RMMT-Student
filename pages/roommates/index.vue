<template>
    <div class="roommates">
        <PageHeader title="舍友大厅 | Matching Hall"></PageHeader>
        <el-row type="flex" justify="center">
            <el-switch
                v-model="onlyShowUnteamed"
                active-text="仅显示未组队/未满员同学"
                inactive-text="显示所有推荐"
            />
        </el-row>
        
        <el-row type="flex" justify="center">
            <el-col :span="20">
                <div class="default-container">
                    <div class="students-grid">
                        <div 
                            v-for="student in filtered_student_with_score" 
                            :key="student.id"
                            class="student-card-wrapper"
                        >
                            <StudentCard :student="student" />
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        
        <el-row type="flex" justify="center">
            <el-col :span="20">
                <div class="default-container">
                    <div class="students-grid">
                        <div 
                            v-for="student in filtered_student_with_no_score" 
                            :key="student.id"
                            class="student-card-wrapper"
                            v-if="student.id != $auth.user.id"
                        >
                            <StudentCard :student="student" />
                        </div>
                    </div>
                </div>
            </el-col>   
        </el-row>
    </div>
</template>

<script>

export default {
    name: "index",
    data() {
        return {
            student_with_score: [],
            student_with_no_score: [],
            onlyShowUnteamed: false
        }
    },
    computed: {
        filtered_student_with_score() {
            if (!this.onlyShowUnteamed) return this.student_with_score
            const unteamed = this.student_with_score
                .filter(student => student.team_students_num < 4)
            return unteamed
        },
        filtered_student_with_no_score() {
            if (!this.onlyShowUnteamed) return this.student_with_no_score
            const unteamed = this.student_with_no_score
                .filter(student => student.team_students_num < 4)
            return unteamed
        }
    },
    async asyncData({$axios, $auth}) {
        let data = await $axios.$get("/team/recommend_teammates").then(data => {
            if (data.code === 200) {
                let student_with_score = data.data.students_with_score
                let student_with_no_score = _.filter(data.data.students_with_no_score, function (n) {
                    return $auth.user.id !== n.id
                })
                return {student_with_score, student_with_no_score}
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
    padding: 20px;
}

.students-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    container-type: inline-size;
}

.student-card-wrapper {
    width: 100%;
}

@container (max-width: 600px) {
    .default-container {
        padding: 8px !important;
    }
    
    .students-grid {
        grid-template-columns: 1fr;
    }
}

@container (min-width: 601px) and (max-width: 900px) {
    .students-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@container (min-width: 901px) and (max-width: 1200px) {
    .students-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@container (min-width: 1201px) {
    .students-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>
