import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { Card, CardBody, CardFooter, Col, Row } from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { AppSwitch } from '@coreui/react';
//own
import ProgressTag from './ProgressTag';
import emotionColors from '../../util/emotionColors';

const mainChartOpts = {
	tooltips: {
		enabled: false,
		custom: CustomTooltips,
		intersect: true,
		mode: 'index',
		position: 'nearest',
		callbacks: {
			labelColor: function(tooltipItem, chart) {
				return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
			}
		}
	},
	maintainAspectRatio: false,
	legend: {
		display: false
	},
	scales: {
		xAxes: [
			{
				gridLines: {
					drawOnChartArea: false
				}
			}
		],
		yAxes: [
			{
				ticks: {
					beginAtZero: true,
					maxTicksLimit: 5,
					stepSize: Math.ceil(100 / 5)
					//max: 100
				}
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

const MainChart = (props) => {
	//console.log('Mainchart.js', props.main);
	const [ mainChart, setMainChart ] = useState({});

	const [ happy, setHappy ] = useState({
		label: 'Happy',
		//backgroundColor: emotionColors[0],
		backgroundColor: 'transparent',
		borderColor: emotionColors[0],
		pointHoverBackgroundColor: '#fff',
		borderWidth: 3,
		data: []
	});
	const [ happyArray, setHappyArray ] = useState([]);

	const [ surprised, setSurprised ] = useState({
		label: 'Surprised',
		backgroundColor: 'transparent',
		borderColor: emotionColors[1],
		pointHoverBackgroundColor: '#fff',
		borderWidth: 3,
		data: []
	});
	const [ surprisedArray, setSurprisedArray ] = useState([]);

	const [ angry, setAngry ] = useState({
		label: 'Angry',
		backgroundColor: 'transparent',
		borderColor: emotionColors[2],
		pointHoverBackgroundColor: '#fff',
		borderWidth: 3,
		//borderDash: [ 8, 5 ],
		data: []
	});
	const [ angryArray, setAngryArray ] = useState([]);

	const [ confused, setConfused ] = useState({
		label: 'Confused',
		backgroundColor: 'transparent',
		borderColor: emotionColors[3],
		pointHoverBackgroundColor: '#fff',
		borderWidth: 3,
		data: []
	});
	const [ confusedArray, setConfusedArray ] = useState([]);

	const [ calm, setCalm ] = useState({
		label: 'Calm',
		backgroundColor: 'transparent',
		borderColor: emotionColors[4],
		pointHoverBackgroundColor: '#fff',
		borderWidth: 3,
		data: []
	});
	const [ calmArray, setCalmArray ] = useState([]);

	const [ sad, setSad ] = useState({
		label: 'Sad',
		backgroundColor: 'transparent',
		borderColor: emotionColors[5],
		pointHoverBackgroundColor: '#fff',
		borderWidth: 3,
		data: []
	});
	const [ sadArray, setSadArray ] = useState([]);

	const [ fear, setFear ] = useState({
		label: 'Fear',
		backgroundColor: 'transparent',
		borderColor: emotionColors[6],
		pointHoverBackgroundColor: '#fff',
		borderWidth: 3,
		data: []
	});
	const [ fearArray, setFearArray ] = useState([]);

	const [ disgusted, setDisgusted ] = useState({
		label: 'Disgusted',
		backgroundColor: 'transparent',
		borderColor: emotionColors[7],
		pointHoverBackgroundColor: '#fff',
		borderWidth: 3,
		data: []
	});
	const [ disgustedArray, setDisgustedArray ] = useState([]);

	//intialize all the graph
	useEffect(
		() => {
			//console.log('llenadnolos');
			let i;
			const lhappyArray = [];
			const lsurprisedArray = [];
			const langryArray = [];
			const lconfusedArray = [];
			const lcalmArray = [];
			const lsadArray = [];
			const lfearArray = [];
			const ldisgustedArray = [];
			for (i = 0; i < props.main.length; i++) {
				lhappyArray.push(props.main[i].happy);
				lsurprisedArray.push(props.main[i].surprised);
				langryArray.push(props.main[i].angry);
				lconfusedArray.push(props.main[i].confused);
				lcalmArray.push(props.main[i].calm);
				lsadArray.push(props.main[i].sad);
				lfearArray.push(props.main[i].fear);
				ldisgustedArray.push(props.main[i].disgusted);
			}

			setHappyArray(lhappyArray);
			setSurprisedArray(lsurprisedArray);
			setAngryArray(langryArray);
			setConfusedArray(lconfusedArray);
			setCalmArray(lcalmArray);
			setSadArray(lsadArray);
			setFearArray(lfearArray);
			setDisgustedArray(ldisgustedArray);

			setHappy((prev) => {
				return { ...prev, data: lhappyArray };
			});
			setSurprised((prev) => {
				return { ...prev, data: lsurprisedArray };
			});
			setAngry((prev) => {
				return { ...prev, data: langryArray };
			});
			setConfused((prev) => {
				return { ...prev, data: lconfusedArray };
			});
			setCalm((prev) => {
				return { ...prev, data: lcalmArray };
			});
			setSad((prev) => {
				return { ...prev, data: lsadArray };
			});
			setFear((prev) => {
				return { ...prev, data: lfearArray };
			});
			setDisgusted((prev) => {
				return { ...prev, data: ldisgustedArray };
			});
		},
		[ props.main ]
	);

	//console.log(happy, surprised, angry, confused, calm, sad, fear, disgusted)
	// listen for changes
	useEffect(
		() => {
			setMainChart({
				labels: Array.from({ length: props.main.length }, (_, i) => (_ = i)),
				datasets: [ happy, surprised, angry, confused, calm, sad, fear, disgusted ]
			});
		},
		[ happy, surprised, angry, confused, calm, sad, fear, disgusted, props.main ]
	);

	//controls
	const [ showHappy, setShowHappy ] = useState(true);
	const [ showSurprised, setShowSurprised ] = useState(true);
	const [ showAngry, setShowAngry ] = useState(true);
	const [ showConfused, setShowConfused ] = useState(true);
	const [ showCalm, setShowCalm ] = useState(true);
	const [ showSad, setShowSad ] = useState(true);
	const [ showFear, setShowFear ] = useState(true);
	const [ showDisgusted, setShowDisgusted ] = useState(true);

	useEffect(
		() => {
			setHappy((prev) => {
				return { ...prev, data: showHappy ? happyArray : [] };
			});
		},
		[ showHappy, happyArray ]
	);

	useEffect(
		() => {
			setSurprised((prev) => {
				return { ...prev, data: showSurprised ? surprisedArray : [] };
			});
		},
		[ showSurprised, surprisedArray ]
	);

	useEffect(
		() => {
			setAngry((prev) => {
				return { ...prev, data: showAngry ? angryArray : [] };
			});
		},
		[ showAngry, angryArray ]
	);

	useEffect(
		() => {
			setConfused((prev) => {
				return { ...prev, data: showConfused ? confusedArray : [] };
			});
		},
		[ showConfused, confusedArray ]
	);

	useEffect(
		() => {
			setCalm((prev) => {
				return { ...prev, data: showCalm ? calmArray : [] };
			});
		},
		[ showCalm, calmArray ]
	);

	useEffect(
		() => {
			setSad((prev) => {
				return { ...prev, data: showSad ? sadArray : [] };
			});
		},
		[ showSad, sadArray ]
	);
	useEffect(
		() => {
			setFear((prev) => {
				return { ...prev, data: showFear ? fearArray : [] };
			});
		},
		[ showFear, fearArray ]
	);
	useEffect(
		() => {
			setDisgusted((prev) => {
				return { ...prev, data: showDisgusted ? disgustedArray : [] };
			});
		},
		[ showDisgusted, disgustedArray ]
	);

	//console.log('Maincharrt', mainChart);

	return (
		<React.Fragment>
			<Row>
				<Col>
					<Card>
						<CardBody>
							<div className="chart-wrapper" style={{ height: 300 + 'px', marginTop: 40 + 'px' }}>
								<Line
									redraw
									data={mainChart}
									options={mainChartOpts}
									height={300}
									getElementAtEvent={(e) => {
										//console.log(e[0]._index); // index
										if (e[0] && e[0]._index) {
											if(props.player.current){
												props.player.current.actions.seek(e[0]._index);
												props.player.current.actions.pause();
											}
											props.setSeconds(e[0]._index);
										}
									}}
								/>
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>

			{/* controls for main chart */}
			<CardFooter>
				<Row className="text-center">
					<Col sm={12} md className="mb-sm-2 mb-0">
						<AppSwitch
							className={'mx-1'}
							variant={'pill'}
							color={'dark'}
							outline={'alt'}
							label
							checked={showHappy}
							onChange={() => setShowHappy((prev) => !prev)}
						/>
						<br />
						<ProgressTag title="Happy" background={emotionColors[0]} value={100} />
					</Col>
					<Col sm={12} md className="mb-sm-2 mb-0">
						<AppSwitch
							className={'mx-1'}
							variant={'pill'}
							color={'dark'}
							outline={'alt'}
							label
							checked={showSurprised}
							onChange={() => setShowSurprised((prev) => !prev)}
						/>
						<br />
						<ProgressTag title="Surprised" background={emotionColors[1]} value={100} />
					</Col>
					<Col sm={12} md className="mb-sm-2 mb-0">
						<AppSwitch
							className={'mx-1'}
							variant={'pill'}
							color={'dark'}
							outline={'alt'}
							label
							checked={showAngry}
							onChange={() => setShowAngry((prev) => !prev)}
						/>
						<br />
						<ProgressTag title="Angry" background={emotionColors[2]} value={100} />
					</Col>
					<Col sm={12} md className="mb-sm-2 mb-0">
						<AppSwitch
							className={'mx-1'}
							variant={'pill'}
							color={'dark'}
							outline={'alt'}
							label
							checked={showConfused}
							onChange={() => setShowConfused((prev) => !prev)}
						/>
						<br />
						<ProgressTag title="Confused" background={emotionColors[3]} value={100} />
					</Col>
					<Col sm={12} md className="mb-sm-2 mb-0">
						<AppSwitch
							className={'mx-1'}
							variant={'pill'}
							color={'dark'}
							outline={'alt'}
							label
							checked={showCalm}
							onChange={() => setShowCalm((prev) => !prev)}
						/>
						<br />
						<ProgressTag title="Calm" background={emotionColors[4]} value={100} />
					</Col>
					<Col sm={12} md className="mb-sm-2 mb-0">
						<AppSwitch
							className={'mx-1'}
							variant={'pill'}
							color={'dark'}
							outline={'alt'}
							label
							checked={showSad}
							onChange={() => setShowSad((prev) => !prev)}
						/>
						<br />
						<ProgressTag title="Sad" background={emotionColors[5]} value={100} />
					</Col>
					<Col sm={12} md className="mb-sm-2 mb-0">
						<AppSwitch
							className={'mx-1'}
							variant={'pill'}
							color={'dark'}
							outline={'alt'}
							label
							checked={showFear}
							onChange={() => setShowFear((prev) => !prev)}
						/>
						<br />
						<ProgressTag title="Fear" background={emotionColors[6]} value={100} />
					</Col>
					<Col sm={12} md className="mb-sm-2 mb-0">
						<AppSwitch
							className={'mx-1'}
							variant={'pill'}
							color={'dark'}
							outline={'alt'}
							label
							checked={showDisgusted}
							onChange={() => setShowDisgusted((prev) => !prev)}
						/>
						<br />
						<ProgressTag title="Disgusted" background={emotionColors[7]} value={100} />
					</Col>
				</Row>
			</CardFooter>
		</React.Fragment>
	);
};

MainChart.propTypes = {
	player: PropTypes.any.isRequired,
	main: PropTypes.array.isRequired,
	setSeconds: PropTypes.func.isRequired,
};

export default React.memo(MainChart);
