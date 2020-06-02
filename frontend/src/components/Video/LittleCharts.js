import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
//own
import WidgetChart from './WidgetChart';

/** Estas son las pequeñas charts de al principio */
const LittleCharts = (props) => {
	//console.log('LittleCharts.js', props);

	const [ sunglasses, setSunglasses ] = useState({
		labels: [],
		datasets: [
			{
				data: []
			}
		]
	});

	const [ eyeglasses, setEyeglasses ] = useState({
		labels: [],
		datasets: [
			{
				data: []
			}
		]
	});

	const [ smiles, setSmiles ] = useState({
		labels: [],
		datasets: [
			{
				data: []
			}
		]
	});

	const [ beards, setBeards ] = useState({
		labels: [],
		datasets: [
			{
				data: []
			}
		]
	});

	useEffect(
		() => {
			setSunglasses({
				labels: Array.from({ length: props.sunglasses.length }, (_, i) => (_ = i)),
				datasets: [
					{
						label: 'Sunglasses at this second',
						backgroundColor: 'rgba(255,255,255,.2)',
						borderColor: 'rgba(255,255,255,.55)',
						data: props.sunglasses
					}
				]
			});
			setEyeglasses({
				labels: Array.from({ length: props.eyeglasses.length }, (_, i) => (_ = i)),
				datasets: [
					{
						label: 'Eyeglasses at this second',
						backgroundColor: 'rgba(255,255,255,.2)',
						borderColor: 'rgba(255,255,255,.55)',
						data: props.eyeglasses
					}
				]
			});
			setSmiles({
				labels: Array.from({ length: props.smiles.length }, (_, i) => (_ = i)),
				datasets: [
					{
						label: 'Smiles at this second',
						backgroundColor: 'rgba(255,255,255,.2)',
						borderColor: 'rgba(255,255,255,.55)',
						data: props.smiles
					}
				]
			});
			setBeards({
				labels: Array.from({ length: props.beards.length }, (_, i) => (_ = i)),
				datasets: [
					{
						label: 'Beadrs at this second',
						backgroundColor: 'rgba(255,255,255,.3)',
						borderColor: 'transparent',
						data: props.beards
					}
				]
			});
		},
		[ props ]
	);

	return (
		<Row>
			<Col xs="12" sm="6" lg="3">
			{/* "dotted-curve" */}
				<WidgetChart type="continue" data={sunglasses} title="Sunglasses" />
			</Col>
			<Col xs="12" sm="6" lg="3">
			{/* dotted */}
				<WidgetChart type="bars" data={eyeglasses} title="Eyeglasses" />
			</Col>
			<Col xs="12" sm="6" lg="3">
				<WidgetChart type="continue" data={smiles} title="Smile" />
			</Col>

			<Col xs="12" sm="6" lg="3">
				<WidgetChart type="bars" data={beards} title="Beard" />
			</Col>
		</Row>
	);
};

LittleCharts.propTypes = {
	beards: PropTypes.array.isRequired,
	smiles: PropTypes.array.isRequired,
	eyeglasses: PropTypes.array.isRequired,
	sunglasses: PropTypes.array.isRequired
};

export default LittleCharts;
