import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    calendarEvents: []
  },
  modules,
  // Enable strict mode in development to get a warning
  // when mutating state outside of a mutation.
  // https://vuex.vuejs.org/guide/strict.html
  strict: process.env.NODE_ENV !== 'production',
  getters: {
    EVENTS: (state) => state.calendarEvents,
  },
  mutations: {
    ADD_EVENT: (state, event) => {
      state.calendarEvents.push(event)
    }
  }
})

export default store

