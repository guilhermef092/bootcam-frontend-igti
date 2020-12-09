import React, { Component } from 'react';
import './styles.css';

class Button extends Component {
  render() {
    let classes = 'button ';
    classes += this.props.operation ? 'operation' : '';
    classes += this.props.double ? 'double' : '';
    classes += this.props.triple ? 'triple' : '';

    return (
      <button
        className={classes}
        onClick={(e) =>
          this.props.onClick(this.props.display) && this.props.onClick
        }
      >
        {this.props.display}
      </button>
    );
  }
}

export default Button;
