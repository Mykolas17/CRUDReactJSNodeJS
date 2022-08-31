import React, { createContext, useState } from 'react';
import Home from './pages/home/Home';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import UpdateAttendee from './pages/attendeeList/UpdateAttendee';
import AttendeeList from './pages/attendeeList/AttendeeList';
import Events from './pages/events/Events';

export const AuthContext = createContext();

function App() {
	const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

	return (
		<AuthContext.Provider
			value={{ isLoggedIn: user ? true : false, user, setUser }}
		>
			{console.log('Is user set: ' + user)}
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Login />} />
				<Route path='/create' element={<Register />} />
				<Route path='/update/:id' element={<UpdateAttendee />} />
				<Route path='/events/:id' element={<AttendeeList />} />
				<Route path='/add-event' element={<Events />} />
			</Routes>
		</AuthContext.Provider>
	);
}

export default App;
