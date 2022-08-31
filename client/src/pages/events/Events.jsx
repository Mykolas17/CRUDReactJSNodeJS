import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';

const Events = () => {
	const navigate = useNavigate();
	const { isLoggedIn } = useContext(AuthContext);
	const [eventData, setEventData] = useState({
		name: '',
		date: '',
	});

	const onFormSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await fetch(
				`${process.env.REACT_APP_SERVER_URI}events`,
				{
					method: 'POST',
					body: JSON.stringify(eventData),
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			const data = await response.json();
			if (data.err) return alert('User is not created!');

			navigate('/');
		} catch (err) {
			alert(err);
		}
	};

	return (
		<div>
			<Link to='/'>Home</Link>

			{isLoggedIn && (
				<div>
					<h2>Attendee Registration</h2>
					<form onSubmit={onFormSubmit}>
						<label>Event Name</label>
						<input
							type='text'
							name='name'
							id='name'
							onChange={(event) =>
								setEventData((prev) => ({ ...prev, name: event.target.value }))
							}
							value={eventData.name}
							required
						/>
						<label>Event date</label>
						<input
							type='date'
							name='date'
							id='date'
							value={eventData.age}
							onChange={(event) =>
								setEventData((prev) => ({ ...prev, date: event.target.value }))
							}
							required
						/>
						<button type='submit'>Register</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default Events;
