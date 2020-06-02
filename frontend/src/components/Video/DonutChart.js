import React from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import emotionColors from '../../util/emotionColors';

/** La chart de dona para el video Details */

const DonutChart = (props) => {
	//console.log('DonutChart.js', props.data);

	const emotionsChart = {
		labels: [ 'HAPPY', 'SURPRISED', 'ANGRY', 'CONFUSED', 'CALM', 'SAD', 'FEAR', 'DISGUSTED' ],
		datasets: [
			{
				backgroundColor: emotionColors,
				borderColor: 'rgba(255,255,255,.2)',
				data: [
					props.data.happy,
					props.data.surprised,
					props.data.angry,
					props.data.confused,
					props.data.calm,
					props.data.sad,
					props.data.fear,
					props.data.disguted
				]
			}
		]
	};

	return <Doughnut data={emotionsChart} legend={{ display: false }} />;
};

DonutChart.propTypes = {
	data: PropTypes.object.isRequired
};

export default DonutChart;
