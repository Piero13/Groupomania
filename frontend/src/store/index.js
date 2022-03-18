import axios from 'axios';
import { createStore } from 'vuex'
import router from '../router'

export default createStore({
  state: {
    errorMsg: null,
    userId: localStorage.getItem('user'),
    connectedUser: null
  },
  
  getters: {
    showConnectedUser: (state) => state.connectedUser
  },

  mutations: {
    setUserId: (state, userId) => (state.userId = userId),
    setConnectedUser: (state, user) => (state.connectedUser = user)
  },

  actions: {
    getUserId({ commit }, userId) {
      commit('setUserId', userId);
    },

    getOneUser({ commit }) {
      axios.post('user', { id: this.state.userId })
        .then(res => {
          commit('setConnectedUser', res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    logout({ commit}) {
      commit('setUserId', null);
      commit('setConnectedUser', null);
      localStorage.clear();      
      router.push("/")
    }
  },

  modules: {

  }
})
