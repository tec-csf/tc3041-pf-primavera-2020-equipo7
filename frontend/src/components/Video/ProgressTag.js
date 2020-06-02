import React from 'react';
import PropTypes from 'prop-types';

const ProgressTag = (props) => {
	return (
		<React.Fragment>
			<strong>{props.title}</strong>
			<div
				className="progress-bar progress-xs mt-2 progress"
				role="progressbar"
				aria-valuenow={props.value}
				aria-valuemin="0"
				aria-valuemax="100"
				style={{ width: '100%', backgroundColor: props.background }}
			/>
		</React.Fragment>
	);
};

ProgressTag.propTypes = {
	title: PropTypes.string.isRequired,
	background: PropTypes.string.isRequired,
	value: PropTypes.number.isRequired
};

export default ProgressTag;
