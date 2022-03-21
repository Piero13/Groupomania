import axios from 'axios';
import { createStore } from 'vuex'
import router from '../router'

export default createStore({
  state: {
    errorMsg: null,
    userId: localStorage.getItem('user'),
    connectedUser: null,
    publications: [],
    likes: null
  },
  
  getters: {
    showConnectedUser(state) {
      state.connectedUser},
    showPublications(state) {
      state.publications}
  },

  mutations: {
    SET_USER_ID(state, userId) {
      state.userId = userId
    },
    SET_CONNECTED_USER(state, user) {
      state.connectedUser = user
    },
    SET_PUBLICATIONS(state, publications) {
      state.publications = publications
    }
  },

  actions: {
    getUserId({ commit }, userId) {
      commit('SET_USER_ID', userId);
    },

    getOneUser({ commit }) {
      axios.get('/users/' + this.state.userId)
        .then(res => {
          commit('SET_CONNECTED_USER', res.data)
        })
        .catch((error) => {
          console.log(error);
        })
    },

    logout({ commit }) {
      commit('SET_USER_ID', null);
      commit('SET_CONNECTED_USER', null);
      localStorage.clear();      
      router.push("/")
    },

    getPublications({ commit }) {
      axios.get('/publications')
        .then(res => {
          commit("SET_PUBLICATIONS", res.data);
        })
        .catch((error) => {
          console.log(error);
        })
    },
  },

  modules: {

  }
})
