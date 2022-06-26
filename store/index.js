export const state = () => ({
    system_settings: {
        "step_1_start_at": null,
        "step_1_end_at": null,
        "step_2_start_at": null,
        "step_2_end_at": null,
        "step_3_start_at": null,
        "step_3_end_at": null,
        "team_max_student_count": null,
        "questionnaire_json": {}
    }
})

export const mutations = {
    update_system_settings(state, system_settings) {
        state.system_settings = system_settings
    }
}

export const actions = {
    async refresh_system_settings(context) {
        let system_settings = await this.$axios.$get("/system_setting").then(data => {
            if (data.code === 200) {
                return data.data
            }
        })
        system_settings.questionnaire_json = JSON.parse(system_settings.questionnaire_json)
        context.commit("update_system_settings", system_settings)
    }
}


