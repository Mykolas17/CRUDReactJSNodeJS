import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../App';

const AttendeeList = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { isLoggedIn } = useContext(AuthContext);
	const [guests, setGuests] = useState([]);
	const [guestData, setGuestData] = useState({
		eventId: id,
		email: '',
		name: '',
		date: '',
	});

	useEffect(() => {
		const fetchGuests = async () => {
			if (isLoggedIn) {
				try {
					const response = await fetch(
						`${process.env.REACT_APP_SERVER_URI}guests/events/${id}`,
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem('token')}`,
							},
						}
					);
					const data = await response.json();
					setGuests(data);
				} catch (err) {
					console.log(err);
				}
			}
		};
		fetchGuests();
	}, [id, isLoggedIn]);

	const onDelete = async (id) => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_SERVER_URI}guests/${id}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			const data = await response.json();
			if (data.affectedRows > 0) {
				setGuests((prev) => prev.filter((guest) => guest.id !== id));
			}
		} catch (err) {
			console.log(err);
		}
	};

	const onFormSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await fetch(
				`${process.env.REACT_APP_SERVER_URI}guests`,
				{
					method: 'POST',
					body: JSON.stringify(guestData),
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			const data = await response.json();
			if (data.err) {
				return alert('User is not created!');
			} else {
				setGuests([...guests, data]);
			}
		} catch (err) {
			alert(err);
		}
	};

	return (
		<div>
			<Link to='/'>Home</Link>

			{isLoggedIn && (
				<table>
					<thead>
						<tr>
							<th>Id</th>
							<th>Name</th>
							<th>Email</th>
							<th>BirthDate</th>
						</tr>
					</thead>
					<tbody>
						{guests.map(({ id, name, email, date }) => {
							return (
								<tr key={id}>
									<td>{id}</td>
									<td>{name}</td>
									<td>{email}</td>
									<td>{date ? date.split('T')[0] : date}</td>
									<td>
										<button onClick={() => onDelete(id)}>Delete</button>
									</td>
									<td>
										<button>
											<Link to={`/update/${id}`}>Update</Link>
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			)}
			{isLoggedIn && (
				<div>
					<h2>Attendee Registration</h2>
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
						<button type='submit'>Register</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default AttendeeList;
