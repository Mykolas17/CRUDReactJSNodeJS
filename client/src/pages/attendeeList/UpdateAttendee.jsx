import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../App';

const UpdateAttendee = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { isLoggedIn } = useContext(AuthContext);
	const [guest, setGuest] = useState([]);
	const [guestData, setGuestData] = useState({
		email: '',
		name: '',
		date: '',
	});

	useEffect(() => {
		const fetchGuests = async () => {
			if (isLoggedIn) {
				try {
					const response = await fetch(
						`${process.env.REACT_APP_SERVER_URI}guests/${id}`,
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem('token')}`,
							},
						}
					);
					const data = await response.json();
					setGuest(data);
				} catch (err) {
					console.log(err);
				}
			}
		};
		fetchGuests();
	}, [id, isLoggedIn]);

	const onFormSubmit = async (event) => {
		event.preventDefault();
		const guests = {
			name: guestData.name,
			email: guestData.email,
			date: guestData.date,
		};
		// if (userData.password) user.password = userData.password;
		try {
			const response = await fetch(
				`${process.env.REACT_APP_SERVER_URI}guests/${id}`,
				{
					method: 'PATCH',
					body: JSON.stringify(guestData),
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			const data = await response.json();
			if (data.err) return alert('User is not updated!');
			navigate('../../events/' + guest.event_id);
		} catch (err) {
			alert(err);
		}
	};

	return (
		<div>
			<Link to='/'>Home</Link>
			<Link to={'/events/' + guest.event_id}>Events</Link>

			{isLoggedIn && (
				<div>
					<h2>Update Attendee</h2>
					<form onSubmit={onFormSubmit}>
						<label>Name and Surname</label>
						<input
							type='text'
							name='name'
							id='name'
							onChange={(event) =>
								setGuestData((prev) => ({ ...prev, name: event.target.value }))
							}
							value={guestData.name}
							required
						/>
						<label>Email</label>
						<input
							type='email'
							name='email'
							id='email'
							onChange={(event) =>
								setGuestData((prev) => ({ ...prev, email: event.target.value }))
							}
							value={guestData.email}
							required
						/>
						<label>Birth date</label>
						<input
							type='date'
							name='date'
							id='date'
							value={guestData.age}
							onChange={(event) =>
								setGuestData((prev) => ({ ...prev, date: event.target.value }))
							}
							required
						/>
						<button type='submit'>Update</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default UpdateAttendee;
