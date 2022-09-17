export default {

    state: {

        tableEditProcess: false,
        tableEditMsg: {}
    },

    actions: {

        async updateRow({ state, rootState, commit }, payload) {

            try {

                const fileUpdated = rootState.uploader.file.map( item => item.ordNumber == payload.ordNumber ? item = payload : item )

                commit('setFile', fileUpdated)

                state.tableEditMsg = { success: true, text: "Запись успешно обновлена" }

            } catch(e) {

                state.tableEditMsg = { success: false, text: e }
            }
        }
    },

    mutations: {

        setTableEditProcess:    (state, data) => state.tableEditProcess = data,
        setTableEditMsg:        (state, data) => state.tableEditMsg     = data,
    }
}