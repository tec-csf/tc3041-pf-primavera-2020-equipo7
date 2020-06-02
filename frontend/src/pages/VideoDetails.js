import React, { useRef, useState, useEffect } from 'react';
import { Progress, Row, Nav, NavItem, NavLink, TabContent, CustomInput } from 'reactstrap';
import {
	Player,
	LoadingSpinner,
	ControlBar,
	CurrentTimeDisplay,
	TimeDivider,
	PlaybackRateMenuButton
} from 'video-react'; // https://video-react.js.org/components/player/
// own
import MainChart from '../components/Video/MainChart';
import Loader from '../components/Loader';
import DonutChart from '../components/Video/DonutChart';
import { useFetch } from '../util/useFetch';
import poster from '../assets/img/brand/sygnet.svg';

import LittleCharts from '../components/Video/LittleCharts';

const VideoDetails = (props) => {
	//console.log('[VideoDetails.js]', props);
	const { data, isLoading, isError /*loadData, searchByName, isSearching*/ } = useFetch(
		`/videos/${props.match.params.id}`
	);

	const player = useRef();
	//player.current.actions.seek(20)

	const [ currentShow, setCurrentShow ] = useState(1); //image 1  | video 2
	const [ currentSecond, setCurrentSecond ] = useState(0);

	useEffect(
		() => {
			if (player.current && currentShow === 1) {
				player.current.actions.play();
				player.current.actions.seek(currentSecond);
				player.current.actions.pause();
			}
		},
		[ player, currentSecond, currentShow ]
	);

	return (
		<React.Fragment>
			{isError ? (
				<Row className="justify-content-center">
					<div style={{ marginTop: '80px' }} />
					<p>Something went wrong while getting your projects, please try again</p>
				</Row>
			) : isLoading ? (
				<React.Fragment>
					<div style={{ marginTop: '80px' }} />
					<Loader />
				</React.Fragment>
			) : (
				data._id && (
					<div className="animated fadeIn">
						<div style={{ marginTop: '40px' }} />
						<Row className="justify-content-center">
							<span className="h1">{data.name}</span>
						</Row>

						{/* general charts */}
						<div style={{ marginTop: '30px' }} />
						<LittleCharts
							beards={data.beards}
							sunglasses={data.sunglasses}
							eyeglasses={data.eyeglasses}
							smiles={data.smiles}
						/>

						{/* ages */}
						<div className="progress-group mb-5">
							<div className="progress-group-header">
								<i className="icon-arrow-down progress-group-icon" />
								<span className="title">Min Age</span>
								<span className="ml-auto font-weight-bold">{data.ages.min_age}</span>
							</div>
							<div className="progress-group-bars">
								<Progress className="progress-xs" color="dark" value={data.ages.min_age} />
							</div>
						</div>
						<div className="progress-group">
							<div className="progress-group-header">
								<i className="icon-arrow-up progress-group-icon" />
								<span className="title">Max Age</span>
								<span className="ml-auto font-weight-bold">{data.ages.max_age}</span>
							</div>
							<div className="progress-group-bars">
								<Progress className="progress-xs" color="dark" value={data.ages.max_age} />
							</div>
						</div>

						{/* video player */}
						<div style={{ marginTop: '40px' }} />

						<Nav tabs>
							<NavItem>
								<NavLink
									active={currentShow === 1}
									onClick={() => {
										setCurrentShow(1);
									}}
								>
									Video
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									active={currentShow === 2}
									onClick={() => {
										setCurrentShow(2);
									}}
								>
									Image
								</NavLink>
							</NavItem>
						</Nav>
						<TabContent activeTab={currentShow}>
							<br />
							<Row className="justify-content-center">
								{currentShow === 2 && (
									<img src={data.links[currentSecond]} alt="current frame" height={300} />
								)}
								<div style={currentShow === 2 ? { display: 'none' } : {}}>
									<Player
										ref={(ref) => (player.current = ref)}
										height={300}
										fluid={false} //to disable full height
										muted
										playsInline
										poster={poster}
										src={data.link}
									>
										<LoadingSpinner />
										<ControlBar>
											<CurrentTimeDisplay order={4.1} />
											<TimeDivider order={4.2} />
											<PlaybackRateMenuButton rates={[ 2, 1, 0.5, 0.1 ]} order={7.1} />
										</ControlBar>
									</Player>
								</div>
							</Row>
							<br />
						</TabContent>

						<div style={{ marginTop: '10px' }} />
						<CustomInput
							type="range"
							id="exampleCustomRange"
							name="customRange"
							min={0}
							max={data.main.length - 1}
							value={currentSecond}
							onChange={(e) => {
								setCurrentSecond(+e.target.value);
								if (currentShow === 1) {
									player.current.actions.seek(+e.target.value);
								}
							}}
						/>

						{/* main chart */}
						<div style={{ marginTop: '10px' }} />
						<MainChart player={player} main={data.main} setSeconds={setCurrentSecond} />

						{/* pie chart */}
						<div style={{ marginTop: '20px' }} />
						<DonutChart data={data.counts} />

						{/* genders */}
						<div className="progress-group mb-5">
							<div className="progress-group-header">
								<i className="icon-user-female progress-group-icon" />
								<span className="title">Female</span>
								<span className="ml-auto font-weight-bold">{(data.females * 100).toFixed(0)}%</span>
							</div>
							<div className="progress-group-bars">
								<Progress
									className="progress-xs"
									color="dark"
									value={(data.females * 100).toFixed(0)}
								/>
							</div>
						</div>
						<div className="progress-group">
							<div className="progress-group-header">
								<i className="icon-user progress-group-icon" />
								<span className="title">Male</span>
								<span className="ml-auto font-weight-bold">{(data.males * 100).toFixed(0)}%</span>
							</div>
							<div className="progress-group-bars">
								<Progress className="progress-xs" color="dark" value={(data.males * 100).toFixed(0)} />
							</div>
						</div>
					</div>
				)
			)}
		</React.Fragment>
	);
};

export default VideoDetails;
