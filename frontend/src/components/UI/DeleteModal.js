import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalFooter } from 'reactstrap';
import axios from '../../util/axios';

const ModalExample = (props) => {
	const [ modal, setModal ] = useState(false);

	const toggle = () => setModal((modal) => !modal);

	return (
		<div>
			<Button outline color="danger" onClick={toggle}>
				<i className="icon-trash" />
			</Button>
			<Modal isOpen={modal} toggle={toggle}>
				<ModalHeader toggle={toggle}>Do you want to delete {props.name}?</ModalHeader>
				<ModalFooter>
					<Button
						color="danger"
						onClick={() => {
							axios
								.delete('/videos/' + props.id)
								.then(() => {
									//console.log('deleting video',res);
									props.simpleDelete(props.id, props.isFree ? 'free' : 'payed');
									//props.refresh();
								})
								.catch(console.log);
								toggle();
						}}
					>
						Yes, delete
					</Button>
					<Button color="secondary" onClick={toggle}>
						Cancel
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};

export default ModalExample;
