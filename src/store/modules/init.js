export default {
    namespaced: true,

    state: {
        active: 0,

        checkedComponents: ["ZooKeeper"],
        namespace: "",

        pvc: {},

        complete: false
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
        setPvc (context, dataMap) {
            context.commit("setPvcMutation", dataMap);
        },
        setComplete (context, dataMap) {
            context.commit("setCompleteMutation", dataMap);
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
        },
        setPvcMutation(state, dataMap) {
            state.pvc = dataMap["pvc"];
        },
        setCompleteMutation(state, dataMap) {
            state.complete = dataMap["complete"];
            window.sessionStorage.setItem("complete", dataMap["complete"])
        },
    }
};
