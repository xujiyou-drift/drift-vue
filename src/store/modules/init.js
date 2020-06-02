export default {
    namespaced: true,

    state: {
        active: 0,
        checkedComponents: []
    },

    getters: {

    },

    actions: {
        setSelect (context, dataMap) {
            context.commit("setSelectMutation", dataMap);
        },
    },

    mutations: {
        setSelectMutation(state, dataMap) {
            state.active = dataMap["currentActive"];
            state.checkedComponents = dataMap["checkedComponents"];
        }
    }
};
