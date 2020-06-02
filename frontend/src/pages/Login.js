import React, { useContext, useEffect } from 'react';
import { NavLink} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Loader from '../components/Loader';
import {
	Button,
	Card,
	CardBody,
	CardGroup,
	Col,
	Container,
	Form,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Row,
	Alert
} from 'reactstrap';

import userContext from '../context/userContext';
import logo from '../assets/img/brand/logo.svg';

const Login = () => {
	const{ logIn, errorInAuth, isLoading, clearError }= useContext(userContext);
	const { handleSubmit, register, errors } = useForm();

	const onSubmitHandler = (data) => {
		//console.log('Login', data);
		logIn(data.email, data.password);
	};

	useEffect(() => {
		//clean when enter in this page
		clearError(false);
	}, [clearError]);

	return (
		<div className="app flex-row align-items-center">
			<Container>
				<Row className="justify-content-center">
					<img src={logo} alt="emotionfy" />
				</Row>
				{errorInAuth && (
					<Row className="justify-content-center">
						<Alert color="danger">
							Something went wrong singin in. Please try again.
							<ul>
								<li>Email or Password are incorrect</li>
								<li>
									Are you&nbsp;
									<NavLink className="alert-link" to="/register" exact>
										Registered
									</NavLink>?
								</li>
							</ul>
						</Alert>
					</Row>
				)}
				{isLoading ? (
					<Loader />
				) : (
					<Row className="justify-content-center">
						<Col md="8">
							<CardGroup>
								<Card className="p-4">
									<CardBody>
										<Form onSubmit={handleSubmit(onSubmitHandler)}>
											<h1>Login</h1>
											<p className="text-muted">Sign In to your account</p>
											<InputGroup className="mb-3">
												<InputGroupAddon addonType="prepend">
													<InputGroupText>@</InputGroupText>
												</InputGroupAddon>
												<input
													className={
														errors.email ? 'is-invalid form-control' : 'form-control'
													}
													type="text"
													placeholder="Email"
													autoComplete="email"
													name="email"
													ref={register({
														required: 'Write your mail',
														pattern: {
															value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
															message: 'Invalid email address'
														}
													})}
												/>
												{errors.email && (
													<div className="invalid-feedback">{errors.email.message}</div>
												)}
											</InputGroup>
											<InputGroup className="mb-4">
												<InputGroupAddon addonType="prepend">
													<InputGroupText>
														<i className="icon-lock" />
													</InputGroupText>
												</InputGroupAddon>
												<input
													type="password"
													placeholder="Password"
													name="password"
													autoComplete="password"
													className={
														errors.password ? 'is-invalid form-control' : 'form-control'
													}
													ref={register({
														required: 'Type a secure password',
														minLength: {
															value: 6,
															message: 'Password must be at least 6 characters long'
														}
													})}
												/>
												{errors.password && (
													<div className="invalid-feedback">{errors.password.message}</div>
												)}
											</InputGroup>
											<Row>
												{/* <Col xs="6">
												<NavLink to="/" exact className="px-4 btn btn-primary">
													Login
												</NavLink>
											</Col> */}
												<Col xs="6">
													<Button color="primary" className="px-4" type="submit">
														Login
													</Button>
												</Col>
												{/* <Col xs="6" className="text-right">
												<Button color="link" className="px-0">
													Forgot password?
												</Button>
											</Col> */}
											</Row>
											<NavLink to="/register" exact className="text-muted">Sing up instead?</NavLink>
										</Form>
									</CardBody>
								</Card>
								<Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
									<CardBody className="text-center">
										<div>
											<h2>Sign up</h2>
											<p>
												If you want to use Emotionfy, first sing up
												<br />
												<i className="icon-arrow-down-circle" />
											</p>
											<NavLink to="/register" exact>
												<Button color="primary" className="mt-3" active tabIndex={-1}>
													Register Now!
												</Button>
											</NavLink>
										</div>
									</CardBody>
								</Card>
							</CardGroup>
						</Col>
					</Row>
				)}
			</Container>
		</div>
	);
};

export default Login;
