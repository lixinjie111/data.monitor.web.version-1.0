// import Vue from 'vue';
// import Vuex from 'vuex';
// Vue.use(Vuex);
import admin from './modules/admin';



const store = new Vuex.Store({
	modules: {
		admin
	}
});

export default store
