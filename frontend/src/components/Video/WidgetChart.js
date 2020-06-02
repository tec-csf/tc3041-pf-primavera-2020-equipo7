import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { Line, Bar, defaults } from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import PropTypes from 'prop-types';

defaults.global.datasets.bar.barPercentage = 0.6; //solve bug for bar style

const WidgetChart = (props) => {
	//console.log('WidgetChart', props);

	const dottedType = {
		tooltips: {
			enabled: false,
			custom: CustomTooltips
		},
		maintainAspectRatio: false,
		legend: {
			display: false
		},
		scales: {
			xAxes: [
				{
					gridLines: {
						color: 'transparent',
						zeroLineColor: 'transparent'
					},
					ticks: {
						fontSize: 2,
						fontColor: 'transparent'
					}
				}
			],
			yAxes: [
				{
					display: false,
					ticks: {
						display: false,
						min: Math.min.apply(Math, props.data.datasets[0].data) - 5,
						max: Math.max.apply(Math, props.data.datasets[0].data) + 5
					}
				}
			]
		},
		elements: {
			line: {
				borderWidth: 1
			},
			point: {
				radius: 4,
				hitRadius: 10,
				hoverRadius: 4
			}
		}
	};

	const dottedCurveType = {
		tooltips: {
			enabled: false,
			custom: CustomTooltips
		},
		maintainAspectRatio: false,
		legend: {
			display: false
		},
		scales: {
			xAxes: [
				{
					gridLines: {
						color: 'transparent',
						zeroLineColor: 'transparent'
					},
					ticks: {
						fontSize: 2,
						fontColor: 'transparent'
					}
				}
			],
			yAxes: [
				{
					display: false,
					ticks: {
						display: false,
						min: Math.min.apply(Math, props.data.datasets[0].data) - 5,
						max: Math.max.apply(Math, props.data.datasets[0].data) + 5
					}
				}
			]
		},
		elements: {
			line: {
				tension: 0.00001,
				borderWidth: 1
			},
			point: {
				radius: 4,
				hitRadius: 10,
				hoverRadius: 4
			}
		}
	};

	const continueType = {
		tooltips: {
			enabled: false,
			custom: CustomTooltips
		},
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
			line: {
				borderWidth: 2
			},
			point: {
				radius: 0,
				hitRadius: 10,
				hoverRadius: 4
			}
		}
	};

	const barsType = {
		tooltips: {
			enabled: false,
			custom: CustomTooltips
		},
		maintainAspectRatio: false,
		legend: {
			display: false
		},
		scales: {
			xAxes: [
				{
					display: false,
					//barPercentage: 0.6
				}
			],
			yAxes: [
				{
					display: false
				}
			]
		}
	};

	return (
		<Card className="text-white bg-primary">
			<CardBody className="pb-0">
				<div className="text-value">{props.title}</div>
			</CardBody>
			<div className="chart-wrapper mx-3" style={{ height: '70px' }}>
				{props.type === 'bars' ? (
					<Bar data={props.data} options={barsType} height={70} />
				) : (
					<Line
						data={props.data}
						options={
							props.type === 'dotted' ? (
								dottedType
							) : props.type === 'dotted-curve' ? (
								dottedCurveType
							) : props.type === 'continue' ? (
								continueType
							) : (
								barsType
							)
						}
						height={70}
					/>
				)}
			</div>
		</Card>
	);
};

WidgetChart.propTypes = {
	title: PropTypes.string.isRequired,
	data: PropTypes.any.isRequired,
	type: PropTypes.oneOf([ 'dotted', 'dotted-curve', 'continue', 'bars' ]).isRequired
};

export default WidgetChart;
