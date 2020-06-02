import React from 'react';
import { TabPane } from 'reactstrap';
//import PropTypes from 'prop-types';

/** Notifications */

const DefaultAside = (props) => {
	return (
		<TabPane tabId="2" className="p-3">
			{props.notifications.map((not, i) => (
				<div key={i}>
					<div className="message">
						<div className="py-3 pb-5 mr-3 float-left">
							<i className="icon-bell" />
						</div>
						<div className="font-weight-bold">Update!</div>
						<small className="text-muted">The current status of your video is: {not.status} | {`${not.time.getHours()}:${not.time.getMinutes()}`} hrs.</small>
					</div>
					<hr />
				</div>
			))}
		</TabPane>
	);
};

export default DefaultAside;
