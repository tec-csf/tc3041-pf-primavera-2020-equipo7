import React, { useState, useEffect } from 'react';
import { Progress } from 'reactstrap'
import PropTypes from 'prop-types';

/** Status Bar for processing videos */

const StatusBar = (props) => {
	/**
	 * Todas las etapas de subir un video
	 * extract, | 1
	 * process,| 2
	 * save, | 3
	 * complete | 4
	*/
	const [status, setStatus] = useState(0);

	useEffect(() => {
		switch (props.queue.status) {
			case "extract":
				setStatus(1);
				break;
			case "process":
				setStatus(2);
				break;
			case "save":
				setStatus(3);
				break;
			case "complete":
				props.refresh();
				break;
			default:
				console.log('socket wrong info?')
				break;
		}
	}, [props, setStatus])

	return (
		<Progress multi style={{width: '100%'}}>
			{status >= 1 && (
				<Progress
					bar
					animated={status === 1}
					striped={status > 1}
					color={status > 1 ? 'success' : 'info'}
					value="33"
				>
					{status === 1 && 'Extracting'}
				</Progress>
			)}

			{status >= 2 && (
				<Progress
					bar
					animated={status === 2}
					striped={status > 2}
					color={status > 2 ? 'success' : 'info'}
					value="33"
				>
					{status === 2 && 'Processing'}
				</Progress>
			)}
			{status >= 3 && (
				<Progress
					bar
					animated={status === 3}
					striped={status > 3}
					color={status > 3 ? 'success' : 'info'}
					value="33"
				>
					{status === 3 && 'Saving'}
				</Progress>
			)}
		</Progress>
	);
};

StatusBar.propTypes = {
	queue: PropTypes.object.isRequired,
	refresh: PropTypes.func.isRequired,
};

export default StatusBar;
