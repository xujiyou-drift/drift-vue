//import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        active: 0
    },

    getters: {

    },

    actions: {
        setActive (context, currentActive) {
            console.log("currentActive:" + currentActive);
            context.commit("setActiveMutation", currentActive);
        },
    },

    mutations: {
        setActiveMutation(state, currentActive) {
            state.active = currentActive;
            console.log("this.state.active:" + this.state.active);
        }
    }
};
