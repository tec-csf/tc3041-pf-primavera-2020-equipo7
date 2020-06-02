import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import socketClient from 'socket.io-client';
import axios from './util/axios'; //from axios for normas requests
import firebase from './util/firebase';
// own
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Loader from './components/Loader';

//import HomePage from './pages/Home';
import DefaultLayout from './containers/DefaultLayout';

// context
import UserContext from './context/userContext';

// styles
import './App.scss';

const SOCKETPORT = process.env.REACT_APP_SOCKET_PORT;

const App = () => {
	const [ isAuth, setIsAuth ] = useState(false); //false
	const [ isCheckingAuth, setChekingAuth ] = useState(true);
	const [ errorAuth, setErrorAuth ] = useState(false);
	const [ isLoading, setisLoading ] = useState(false);
	const [ totalProjects, setTotalProjects ] = useState(0);
	const [ totalProcess, setTotalProcess ] = useState(0);
	const [ email, setEmail ] = useState();
	const [ uid, setUID ] = useState();
	const [ notification, setNotification ] = useState();

	const [ persistenNotification, setPersistenNotification ] = useState([]);

	useEffect(
		() => {
			if (uid) {
				console.log('creating soket');
				const socket = socketClient(SOCKETPORT);
				socket.on('connect', (_) => {
					socket.emit('join', uid);
				});
				socket.on('status', (data) => {
					const userInfo = JSON.parse(data);
					if (userInfo.user === uid) {
						//console.log('new message', userInfo);
						setNotification(data);
						setPersistenNotification((prev) => {
							if (prev.length >= 6) {
								return [ { time: new Date(), ...userInfo }, ...prev.slice(0, -1) ];
							}
							return [ { time: new Date(), ...userInfo }, ...prev ];
						});
					}
				});
			}
		},
		[ uid, setNotification ]
	);

	const createUser = (email, password) => {
		setisLoading(true);
		setErrorAuth(false);
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then(() => {
				setisLoading(false);
			})
			.catch((err) => {
				//console.log(err);
				setErrorAuth(err.code);
				setisLoading(false);
			});
	};

	const logIn = (email, password) => {
		setisLoading(true);
		setErrorAuth(false);
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then(() => {
				setisLoading(false);
			})
			.catch(() => {
				setErrorAuth(true);
				setisLoading(false);
			});
	};

	const endSessionUser = () => {
		firebase.auth().signOut();
	};

	useEffect(() => {
		firebase.auth().onAuthStateChanged(setIsAuth);
	}, []);

	useEffect(
		() => {
			//console.log('isAut now is',isAuth);
			if (isAuth && isAuth.xa) {
				axios.defaults.headers.common['Authorization'] = `Bearer ${isAuth.xa}`;
				setEmail(isAuth.email);
				setUID(isAuth.uid);
			} else {
				setEmail('');
				setUID('');
			}
			if ((isAuth && isAuth.xa) || isAuth === null) {
				setChekingAuth(false);
			}
		},
		[ isAuth ]
	);

	return (
		<UserContext.Provider
			value={{
				isAuth: isAuth,
				email: email,
				uid: uid,

				errorInAuth: errorAuth,
				clearError: setErrorAuth,

				isLoading: isLoading,

				totalProcess: totalProcess,
				setTotalProcess: setTotalProcess,

				totalProjects: totalProjects,
				setTotalProjects: setTotalProjects,

				notification: notification,
				persistenNotification: persistenNotification,

				logIn: logIn,
				singUp: createUser,
				logOut: endSessionUser
			}}
		>
			{isCheckingAuth ? (
				<div style={{ marginTop: '25%' }}>
					<Loader />
				</div>
			) : (
				<Router>
					<Switch>
						{!isAuth && <Route exact path="/" component={Landing} />}
						{isAuth && <Route path="/" component={DefaultLayout} />}
						{!isAuth && <Route exact path="/login/" component={Login} />}
						{!isAuth && <Route exact path="/register" component={Register} />}
						{!isAuth && <Redirect to="/login" />}
					</Switch>
				</Router>
			)}
		</UserContext.Provider>
	);
};

export default App;
