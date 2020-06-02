import React, { useRef, useState } from 'react';
import { Row, Nav, NavItem, NavLink, TabContent, CustomInput } from 'reactstrap';
import {
	Player,
	LoadingSpinner,
	ControlBar,
	CurrentTimeDisplay,
	TimeDivider,
	PlaybackRateMenuButton
} from 'video-react'; // https://video-react.js.org/components/player/
// own
import Loader from '../components/Loader';
import { useFetch } from '../util/useFetch';
import poster from '../assets/img/brand/sygnet.svg';

const VideoDetailsFree = (props) => {
	//console.log('[VideoDetailsFree.js]', props);
	const { data, isLoading, isError /*loadData, searchByName, isSearching*/ } = useFetch(
		`/videos/${props.match.params.id}`
	);

	const player = useRef();
	//player.current.actions.seek(20)

	const [ currentShow, setCurrentShow ] = useState(1); //image 1  | video 2
	const [ currentSecond, setCurrentSecond ] = useState(0);

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
								{currentShow === 2 ? (
									<img src={data.images[currentSecond]} alt="current frame" height={500}/>
								) : currentShow === 1 ? (
									<Player
										ref={(ref) => (player.current = ref)}
										height={400}
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
								) : (
									<p>Something wrong</p>
								)}
							</Row>
							<br />
						</TabContent>

						<div style={{ marginTop: '40px' }} />
						<CustomInput
							type="range"
							id="exampleCustomRange"
							name="customRange"
							min={0}
							max={data.images.length - 1}
							value={currentSecond}
							onChange={(e) => {
								setCurrentSecond(+e.target.value);
								if (currentShow === 1) {
									player.current.actions.seek(+e.target.value);
								}
							}}
						/>
					</div>
				)
			)}
		</React.Fragment>
	);
};

export default VideoDetailsFree;
