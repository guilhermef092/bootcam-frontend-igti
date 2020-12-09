import React, { Component } from 'react';
import './styles.css';

class Display extends Component {
  render(props) {
    const css = this.props.colorDisplay ? 'display red' : 'display';

    return <div className={css}>{this.props.display}</div>;
  }
}

export default Display;
