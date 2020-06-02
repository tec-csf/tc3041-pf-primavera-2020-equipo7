import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
	Badge,
	UncontrolledDropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Nav,
	NavItem
	// InputGroupAddon,
	// InputGroupText,
	// Input
} from 'reactstrap';
import { AppAsideToggler } from '@coreui/react';

// own
import logo from '../../assets/img/brand/logo.svg';
//import sygnet from '../../assets/img/brand/sygnet.svg';
import defaultPicProfile from '../../assets/img/avatar/default.png';

/** Top Navbar */

class DefaultHeader extends Component {
	render() {
		return (
			<React.Fragment>
				<div className="big-logo">
					<img src={logo} width={150} height={60} alt="logo" />
				</div>

				<div className="little-logo">
					<img src={logo} width={100} height={50} alt="logo" />
				</div>

				<Nav navbar>
					<NavItem className="nav-items-header" />
					<NavLink to="/" className="nav-link nav-items-header">
						<i className="fa fa-home" />&nbsp;&nbsp; Home
					</NavLink>
					{/* <NavItem className="nav-items-header" /> */}

					{/* <NavItem className='nav-items-header'/>
					<NavLink to="/my-emotionfycoins" className="nav-link">
					<i className="fa fa-usd" />&nbsp;&nbsp;EmotionfyCoins&nbsp;<Badge color="success">14</Badge>
					</NavLink> */}
				</Nav>

				<Nav className="ml-auto" navbar>
					{/* <div className="big-logo">
						<InputGroupAddon addonType="prepend">
							<InputGroupText>
								<i className="icon-magnifier" />
							</InputGroupText>
							<Input type="text" placeholder={'Search...'} />
						</InputGroupAddon>
					</div>
					<NavItem /> */}
					<NavLink className="nav-items-header nav-link" to="/">
						<i className="fa fa-file" />&nbsp;&nbsp;Projects&nbsp;<Badge color="primary">{this.props.total}</Badge>
					</NavLink>
					<NavItem />

					<NavLink to="/processing" className="nav-link">
						<i className="fa fa-file" />&nbsp;&nbsp;Processing&nbsp;<Badge color="success">{this.props.totalp}</Badge>
					</NavLink>

					<UncontrolledDropdown nav direction="down">
						<DropdownToggle nav>
							<img src={defaultPicProfile} className="img-avatar" alt="profile-pic" />
						</DropdownToggle>
						<DropdownMenu right>
							<DropdownItem header tag="div" className="text-center">
								<strong>{this.props.name}</strong>
							</DropdownItem>
							{/* <DropdownItem>
								<i className="fa fa-user" /> Profile
							</DropdownItem>
							<DropdownItem divider />
							<DropdownItem>
								<i className="fa fa-shield" /> Lock Account
							</DropdownItem> */}
							<DropdownItem onClick={() => this.props.onLogout()}>
								<i className="fa fa-lock" /> Logout
							</DropdownItem>
						</DropdownMenu>
					</UncontrolledDropdown>
				</Nav>

				<div className="big-logo">
					<Badge pill color="danger">
						{this.props.notifications.length}
					</Badge>
				</div>

				<AppAsideToggler className="big-logo" />
			</React.Fragment>
		);
	}
}

export default DefaultHeader;
