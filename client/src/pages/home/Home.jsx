import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../App';

const Home = () => {
	const { isLoggedIn, setUser } = useContext(AuthContext);
	const [events, setEvents] = useState([]);

	useEffect(() => {
		const fetchEvents = async () => {
			if (isLoggedIn) {
				try {
					const response = await fetch(
						`${process.env.REACT_APP_SERVER_URI}events`,
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem('token')}`,
							},
						}
					);
					const data = await response.json();
					setEvents(data);
				} catch (err) {
					console.log(err);
				}
			}
		};
		fetchEvents();
	}, [isLoggedIn]);

	const onUserLogout = () => {
		setUser(null);
		localStorage.clear();
	};

	return (
		<div>
			{isLoggedIn && <Link to='/add-event'>Add Event</Link>}

			{!isLoggedIn && <Link to='/login'>Login</Link>}
			{!isLoggedIn && <Link to='/create'>Create</Link>}

			{isLoggedIn && <button onClick={onUserLogout}>Logout</button>}

			{!isLoggedIn && <h1>Please Login to manage events!</h1>}

			{isLoggedIn && (
				<table>
					<thead>
						<tr>
							<th>Id</th>
							<th>Name</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						{events.map(({ id, name, date }) => {
							return (
								<tr key={id}>
									<td>{id}</td>
									<td>{name}</td>
									<td>{date ? date.split('T')[0] : date}</td>
									<td>
										<Link to={'/events/' + id}>View attendies</Link>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default Home;
