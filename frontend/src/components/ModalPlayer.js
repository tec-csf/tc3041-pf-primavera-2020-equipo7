import React, { useState } from 'react';
import { Button, Modal, /*ModalHeader,*/ ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import {
	Player,
	LoadingSpinner,
	ControlBar,
	CurrentTimeDisplay,
	TimeDivider,
	PlaybackRateMenuButton
} from 'video-react'; // https://video-react.js.org/components/player/
import poster from '../assets/img/brand/sygnet.svg';

const ModalWithPlayer = (props) => {
	const [ modal, setModal ] = useState(false);

	const toggle = () => setModal(!modal);

	return (
		<div>
				{props.text ? props.text : 
				<Button outline color="success" onClick={toggle}><i className='icon-eye'></i> </Button>}
	
			<Modal isOpen={modal} toggle={toggle}>
				{/* <ModalHeader toggle={toggle}>Modal title</ModalHeader> */}
				<ModalBody>
					<Player
						//height={400}
						fluid={true} //to disable full height
						muted
						playsInline
						poster={poster}
						src={props.url}
					>
						<LoadingSpinner />
						<ControlBar>
							<CurrentTimeDisplay order={4.1} />
							<TimeDivider order={4.2} />
							<PlaybackRateMenuButton rates={[ 2, 1, 0.5, 0.1 ]} order={7.1} />
						</ControlBar>
					</Player>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={toggle}>
						Ok
					</Button>
					{/* <Button color="secondary" onClick={toggle}>
						Cancel
					</Button> */}
				</ModalFooter>
			</Modal>
		</div>
	);
};

ModalWithPlayer.propTypes = {
	url: PropTypes.string.isRequired,
	text: PropTypes.string
};

export default ModalWithPlayer;
