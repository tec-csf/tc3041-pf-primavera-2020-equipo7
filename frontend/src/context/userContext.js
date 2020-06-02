import React from 'react';

export default React.createContext({
	isAuth: false,
	email: '',
	uid: '',

	errorInAuth: false, // already exists, no exists, wrong pass
	clearError: () => {},

	isLoading: false, // when authing

	totalProjects: 0,
	setTotalProjects: () => {},

	totalProcess: 0,
	setTotalProcess: () => {},

	notification: '',
	persistenNotification: [],

	logIn: (email, password) => {},
	singUp: (email, password) => {},
	logOut: () => {}
});
