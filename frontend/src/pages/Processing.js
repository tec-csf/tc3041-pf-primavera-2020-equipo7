import React, { useContext, useEffect, useState } from 'react';
//import PropTypes from 'prop-types';
import { Row } from 'reactstrap';
import Loader from '../components/Loader';
import { useFetch } from '../util/useFetch';
//context
import userContext from '../context/userContext';
import StatusBar from '../components/Video/StatusBar';

const Processing = () => {
	const { setTotalProjects, notification, setTotalProcess } = useContext(userContext);
	const { data, isLoading, loadData, isError } = useFetch('/videos/');
	const [ processingVideo, setProcessingVideos ] = useState([]);

	useEffect(
		() => {
			if (notification) {
				const userInfo = JSON.parse(notification);
				if (userInfo.status === 'complete') {
					loadData();
					//setProcessingVideos((prev) => {});
				} else {
					setProcessingVideos((prev) => {
						const indexEl = prev.findIndex((v) => v.id === userInfo.id);
						console.log('indexel', indexEl);
						const copy = [ ...prev ];
						if (indexEl >= 0) {
							copy[indexEl] = { ...userInfo };
							return copy;
						} else {
							return prev.concat({ ...userInfo });
						}
					});
				}
			}
		},
		[ setProcessingVideos, notification, loadData ]
	);

	useEffect(
		() => {
			if (data.payed && data.free) {
				setTotalProjects(data.payed.length + data.free.length);
			}
			if (data.processing) {
				const inprogress = Object.keys(data.processing);
				const processArray = [];
				setTotalProcess(inprogress.length);
				let i = 0;
				for (; i < inprogress.length; i++) {
					processArray.push(JSON.parse(data.processing[inprogress[i]]));
				}
				console.log('current process', processArray);
				setProcessingVideos([ ...processArray ]);
			} else {
				setTotalProcess(0);
			}
		},
		[ data, setTotalProjects, setTotalProcess ]
	);

	return (
		<div className="animated fadeIn">
			<div style={{ marginTop: '100px' }} />
			{isError && (
				<Row className="justify-content-center">
					<p>Something went wrong while getting your projects, please try again</p>
				</Row>
			)}
			<Row className="justify-content-center">
				{isLoading ? (
					<Loader />
				) : processingVideo.length > 0 ? (
					processingVideo.map((item, index) => (
						<React.Fragment key={index}>
							<p>Your video in queue {index} (this might take a while)</p>
							<StatusBar refresh={loadData} queue={item} />
							<br />
							<br />
						</React.Fragment>
					))
				) : (
					<p>There are no video in progress</p>
				)}
			</Row>
		</div>
	);
};

Processing.propTypes = {};

export default Processing;
