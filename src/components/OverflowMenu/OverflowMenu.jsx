// Framework and third-party non-ui
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

// Component specific modules (Component-styled, etc.)
import { OverflowMenuContainer, StyledMenu } from './OverflowMenu-styled';

// App components

// Third-party components (buttons, icons, etc.)
import { MenuItem } from 'calcite-react/Menu';
import Popover from 'calcite-react/Popover';
import HandleVerticalIcon from 'calcite-ui-icons-react/HandleVerticalIcon';

// JSON

class OverflowMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  showMenu() {
    this.setState(prevState => ({
      open: !prevState.open,
    }));
  }

  closeMenu() {
    this.setState({
      open: false,
    });
  }

  render() {
    return (
      <OverflowMenuContainer>
        <Popover
          targetEl={<HandleVerticalIcon onClick={this.showMenu} />}
          open={this.state.open}
          onRequestClose={this.closeMenu}
          targetContainerStyles={{
            display: 'flex',
          }}
        >
          <StyledMenu>
            <MenuItem onClick={() => window.open('https://intranet.bloomu.edu/documents/police/BusSchedule.pdf')}>
              Shuttle Schedule
            </MenuItem>
            <MenuItem onClick={() => this.props.history.push('/alerts')}>Status Alerts</MenuItem>
            <MenuItem onClick={() => this.props.history.push('/feedback')}>Feedback</MenuItem>
            <MenuItem onClick={() => this.props.history.push('/issue')}>Report an Issue</MenuItem>
            <MenuItem onClick={() => this.props.history.push('/about')}>About</MenuItem>
          </StyledMenu>
        </Popover>
      </OverflowMenuContainer>
    );
  }
}

export default withRouter(OverflowMenu);