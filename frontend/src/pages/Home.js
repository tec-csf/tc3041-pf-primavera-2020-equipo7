import React, { useContext, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
//owns
import ModalPlayer from '../components/ModalPlayer';
import VideoCard from '../components/VideoCard';
import FileUploader from '../components/FileUploader';

//import ImageCard from '../components/UI/Widget03';
import Loader from '../components/Loader';
import { useFetch } from '../util/useFetch';
//context
import userContext from '../context/userContext';

/**
 * Cuando el usuario ya inicio sesión
*/

const Home = () => {
	//const userToken = useContext(userContext).token;
	const { setTotalProjects, setTotalProcess, notification } = useContext(userContext);
	const { data, isLoading, loadData, isError, simpleDelete /*searchByName, isSearching*/ } = useFetch('/videos/');

	useEffect(
		() => {
			if (data.payed && data.free) {
				setTotalProjects(data.payed.length + data.free.length);
			}
			if (data.processing) {
				setTotalProcess(Object.keys(data.processing).length);
			} else {
				setTotalProcess(0);
			}
		},
		[ data, setTotalProjects, setTotalProcess ]
	);

	useEffect(
		() => {
			if (notification) {
				const userInfo = JSON.parse(notification);
				if (userInfo.status === 'complete') {
					loadData();
					//setProcessingVideos((prev) => {});
				}
			}
		},
		[ notification, loadData ]
	);

	return (
		<div className="animated fadeIn">
			<div style={{ marginTop: '50px' }} />
			<Row className="justify-content-center">
				<span className="h1">Welcome to Emotionfy</span>
			</Row>
			<Row className="justify-content-center">
				<div>
					<ModalPlayer url={'props.url'} text="Need help?" />
				</div>
			</Row>

			<div style={{ marginTop: '50px' }} />

			{!isLoading && (
				<FileUploader
					//refresh={loadData}
					pending={data.pending && data.pending.length >= 1 ? data.pending[0] : {}}
					setTotalProcess={setTotalProcess}
				/>
			)}

			<div style={{ marginTop: '80px' }} />
			{!isError && (
				<Row className="justify-content-center">
					<span className="h1">Your Projects</span>
				</Row>
			)}
			<div style={{ marginTop: '20px' }} />
			{isError ? (
				<Row className="justify-content-center">
					<p>Something went wrong while getting your projects, please try again</p>
				</Row>
			) : isLoading ? (
				<Loader />
			) : data.payed && data.payed.length === 0 && (data.free && data.free.length === 0) ? (
				<Row className="justify-content-center">
					<p>Looks like you don't have any project yet. Start uploading some video with faces there.</p>
				</Row>
			) : (
				<React.Fragment>
					<Row>
						{data.payed &&
							data.payed.map((item) => (
								<Col xs={12} sm={6} md={3} key={item._id}>
									<VideoCard item={item} refresh={loadData} simpleDelete={simpleDelete} />
								</Col>
							))}
					</Row>
					{data.free &&
					data.free.length > 0 && (
						<React.Fragment>
							<Row className="justify-content-center">
								<span className="h3">Your Free Projects</span>
							</Row>
							<div style={{ marginTop: '20px' }} />
							<Row>
								{data.free &&
									data.free.map((item) => (
										<Col xs={12} sm={6} md={3} key={item._id}>
											<VideoCard
												item={item}
												isFree
												refresh={loadData}
												simpleDelete={simpleDelete}
											/>
										</Col>
									))}
							</Row>
						</React.Fragment>
					)}
				</React.Fragment>
			)}
		</div>
	);
};

export default Home;
