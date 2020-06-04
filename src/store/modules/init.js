export default {
    namespaced: true,

    state: {
        active: 0,
        checkedComponents: [],
        namespace: ""
    },

    getters: {

    },

    actions: {
        setSelect (context, dataMap) {
            context.commit("setSelectMutation", dataMap);
        },
        setAction (context, dataMap) {
            context.commit("setActionMutation", dataMap);
        },
    },

    mutations: {
        setSelectMutation(state, dataMap) {
            state.active = dataMap["currentActive"];
            state.checkedComponents = dataMap["checkedComponents"];
            state.namespace = dataMap["namespace"];
        },
        setActionMutation(state, dataMap) {
            state.active = dataMap["currentActive"];
        }
    }
};
