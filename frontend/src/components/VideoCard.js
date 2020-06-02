import React from 'react';
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';
//own
import Widget from './UI/Widget03';

const socialChartOpts = {
	responsive: true,
	maintainAspectRatio: false,
	legend: {
		display: false
	},
	scales: {
		xAxes: [
			{
				display: false
			}
		],
		yAxes: [
			{
				display: false
			}
		]
	},
	elements: {
		point: {
			radius: 0,
			hitRadius: 10,
			hoverRadius: 4,
			hoverBorderWidth: 3
		}
	}
};

/** This are the video cards / projects shown in home */

const VideoCard = (props) => {
	//console.log('[VideoCard.js]', props);

	const data = !props.isFree
		? {
				labels: Array.from({ length: props.item.gestures.length }, (_, i) => (_ = i)),
				datasets: [
					{
						backgroundColor: 'rgba(255,255,255,.1)',
						borderColor: 'rgba(255,255,255,.55)',
						pointHoverBackgroundColor: '#fff',
						borderWidth: 2,
						data: props.item.gestures,
						label: 'Gestures in this frame'
					}
				]
			}
		: {};

	return (
		<React.Fragment>
			{props.isFree ? (
				<Widget
					duration={`${Math.floor(props.item.metadata.duration / 60).toFixed(0)} : ${props.item.metadata.duration %
						60}`}
					faces={0}
					color={'free'}
					id={props.item._id}
					url={props.item.metadata.bucket_link}
					name={props.item.name}
					isFree
					refresh={props.refresh}
					simpleDelete={props.simpleDelete}
				/>
			) : (
				<Widget
					duration={`${Math.floor(props.item.general.duration / 60).toFixed(0)} : ${props.item.general
						.duration % 60}`}
					faces={props.item.general.gestures}
					color={props.item.general.emotion}
					id={props.item._id}
					url={props.item.general.link}
					name={props.item.general.name}
					refresh={props.refresh}
					simpleDelete={props.simpleDelete}
				>
					<div className="chart-wrapper">
						<Line data={data} options={socialChartOpts} height={90} />
					</div>
				</Widget>
			)}
		</React.Fragment>
	);
};

VideoCard.propTypes = {
	item: PropTypes.object.isRequired,
	refresh: PropTypes.func.isRequired,
	simpleDelete: PropTypes.func.isRequired,
	isFree: PropTypes.bool
};

export default VideoCard;
