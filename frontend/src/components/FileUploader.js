import React, { useState, useRef, useEffect } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import PropTypes from 'prop-types';
import {
	Card,
	CardBody,
	CardHeader,
	Col,
	Row,
	Label,
	CustomInput,
	CardFooter,
	Button,
	Nav,
	NavItem,
	Badge,
	NavLink,
	Alert,
	Progress
} from 'reactstrap';
import CheckoutForm from './Payment/CheckoutForm';

//own

import axios from '../util/axios';

// Import FilePond styles
import 'filepond/dist/filepond.min.css'; //https://pqina.nl/filepond/docs/patterns/frameworks/react/
registerPlugin(FilePondPluginFileValidateType);

/**
 * Este es el drag and drop
*/

const FileUploader = (props) => {
	const [ files, setFiles ] = useState([]);

	// for budget
	const [ duration, setDuration ] = useState(
		Object.keys(props.pending).length > 0 ? props.pending.metadata.duration : -1
	);
	const [ seconds, setSeconds ] = useState(1);
	const [ budget, setBudget ] = useState('$0');

	const [ isError, setError ] = useState(false);
	const [ isLoadingPay, setLoadingPay ] = useState(false);

	const [ status, setStatus ] = useState(Object.keys(props.pending).length > 0 ? 1 : 0); //0
	const [ idVideoTemp, setIdVideoTemp ] = useState(Object.keys(props.pending).length > 0 ? props.pending._id : '');

	useEffect(
		() => {
			setBudget((Math.floor(duration / seconds) * process.env.REACT_APP_BASE_PRICE).toFixed(2));
			// setBudget(
			// 	formatPrice({
			// 		amount: process.env.REACT_APP_BASE_PRICE,
			// 		currency: process.env.REACT_APP_CURRENCY,
			// 		quantity: Math.floor(duration / seconds)
			// 	})
			// );
		},
		[ seconds, duration ]
	);

	const pond = useRef();

	const processFile = (fieldName, file, metadata, load, error, progress, abort) => {
		// FormData is a Web API that creates a HTML <form> element.
		const formData = new FormData();

		formData.append('video', file, file.name.replace(/\s/g, ''));

		// the request itself
		//return;
		setError(false);
		axios({
			//headers: getCsrfHeader().headers,
			method: 'post',
			url: '/videos',
			data: formData,
			onUploadProgress: (e) => {
				// updating progress indicator
				progress(e.lengthComputable, e.loaded, e.total);
			}
		})
			.then((response) => {
				console.log(response);
				setIdVideoTemp(response.data.video_id);
				setDuration(response.data.duration);
				setStatus(1);
				setSeconds(1);
			})
			.catch((err) => {
				console.log('Error uploading', err);
				setError(true);
			});

		// Should expose an abort method so the request can be cancelled
		return {
			// this function is called if the user has tapped the cancel button.
			abort: () => {
				console.log('aborting');
				//source.cancel('Operation cancelled by the user.');
				//abort();
			}
		};
	};

	const acceptVideo = () => {
		//console.log('Accepting for free');
		//setStatus(2);
		props.setTotalProcess(prev => prev + 1);
		setStatus(0);
		setDuration(-1);
		setFiles([]);
		axios
			.post('/videos/' + idVideoTemp, { seconds: seconds })
			.then((res) => {
				//console.log(res);
				//props.refresh();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const cancelVideo = () => {
		axios
			.delete('/videos/' + idVideoTemp)
			.then(() => {
				//console.log(res);
			})
			.catch(console.log);
		setDuration(-1);
		setStatus(0);
		setFiles([]);
	};

	const [ tab, setTab ] = useState(1);

	if (isError) {
		return (
			<Row className="justify-content-center">
				<p>Something went wrong while uploading the video, please try again</p>
			</Row>
		);
	}

	if (status === 0 || status === 1) {
		return (
			<React.Fragment>
				<Nav tabs>
					<NavItem>
						<NavLink
							active={tab === 1}
							onClick={() => {
								setTab(1);
							}}
						>
							<i className="icon-social-youtube" />
							<span className={tab === 1 ? '' : 'd-none'}> Video </span>
							{'\u00A0'}
							<Badge color="success">Premium</Badge>
						</NavLink>
					</NavItem>
					{/* <NavItem>
						<NavLink
							active={tab === 2}
							onClick={() => {
								setTab(2)
							}}
						>
							<i className="icon-picture" />
							<span className={tab === 2 ? '' : 'd-none'}> Image Premium</span>
							<Badge color="success">Premium</Badge>
						</NavLink>
					</NavItem> */}
					<NavItem>
						<NavLink
							active={tab === 3}
							onClick={() => {
								setTab(3);
							}}
						>
							<i className="icon-camrecorder" />
							<span className={tab === 3 ? '' : 'd-none'}> Video</span>
							{'\u00A0'}
							<Badge color="primary">Free</Badge>
						</NavLink>
					</NavItem>
					{/* <NavItem>
						<NavLink
							active={tab === 4}
							onClick={() => {
								setTab(4)
							}}
						>
							<i className="icon-picture" />
							<span className={tab === 4 ? '' : 'd-none'}> Image</span>
							<Badge color="primary">Free</Badge>
						</NavLink>
					</NavItem> */}
				</Nav>
				{/* <TabContent activeTab={tab}> */}
				<br />

				{duration > -1 && status === 1 ? (
					<Row>
						<Col xs="12">
							<Card>
								<CardHeader>
									<Row>
										<Col xs={4}>
											<span className="h6">
												Frames to analyze: {Math.floor(duration / seconds)}
											</span>
										</Col>
										<Col xs={4}>
											{tab === 1 || tab === 2 ? (
												<CheckoutForm
													price={budget}
													images={Math.floor(duration / seconds)}
													video={idVideoTemp}
													setLoading={setLoadingPay}
													isLoading={isLoadingPay}
												/>
											) : tab === 3 || tab === 4 ? (
												<Button block outline color="info" onClick={acceptVideo}>
													Analyze
												</Button>
											) : (
												<p> What are you doing? </p>
											)}
										</Col>
										<Col xs={4}>
											<Button block outline color="danger" onClick={cancelVideo} disabled={isLoadingPay}>
												Cancel
											</Button>
										</Col>
									</Row>
								</CardHeader>
								<CardBody>
									<Label for="exampleCustomRange">
										Please select the rate we will use to analize your video:
									</Label>
									<CustomInput
										type="range"
										id="exampleCustomRange"
										name="customRange"
										min={1}
										max={Math.floor(duration / 4) - 1}
										value={Math.floor(duration / 4) - seconds}
										onChange={(e) => setSeconds(Math.floor(duration / 4) - +e.target.value)}
									/>
									{Math.floor(duration / seconds) <= 4 && (
										<Alert color="warning">
										<b>Looking for less rate? You should try uploading images instead of videos</b>
									</Alert>
									)}
								</CardBody>
								{Math.floor(duration / 4) - 1 < 1 && (
									<Alert color="warning">
										Note: You can't adjust the rate to analyze, because the video is too short
									</Alert>
								)}
								{(Math.floor(duration / 4) - 1) === seconds && (
									<Alert color="warning">
										Note: You this is the minimun available rate. If you need less try with images.
									</Alert>
								)}
								<CardFooter>
									Analize each <b>{seconds}</b> seconds
									<br />
									{(tab === 1 || tab === 2) && <span className="h5">Total: {budget} USD</span>}
								</CardFooter>
							</Card>
						</Col>
					</Row>
				) : (
					<FilePond
						ref={(ref) => (pond.current = ref)}
						files={files}
						allowFileTypeValidation={true}
						acceptedFileTypes={[ 'video/mp4' ]}
						fileValidateTypeLabelExpectedTypesMap={{ 'video/mp4': '.mp4' }}
						fileValidateTypeLabelExpectedTypes="Must have to be an mp4"
						allowMultiple={false}
						maxFiles={1}
						onprocessfileabort={(f) => console.log(f)}
						server={{
							process: (fieldName, file, metadata, load, error, progress, abort) => {
								processFile(fieldName, file, metadata, load, error, progress, abort);
							}
						}}
						onupdatefiles={(fileItems) => {
							// Set currently active file objects to this.state
							setFiles(fileItems.map((fileItem) => fileItem.file));
						}}
					/>
				)}
			</React.Fragment>
		);
	}

	//else status 2 , is loading something
	return (<Progress
		bar
		animated
		striped
		color='info'
		value="33"
	>
		Extracting
	</Progress>)

};

FileUploader.propTypes = {
	//refresh: PropTypes.func.isRequired,
	pending: PropTypes.object.isRequired,
	setTotalProcess: PropTypes.func.isRequired,
};

export default FileUploader;
