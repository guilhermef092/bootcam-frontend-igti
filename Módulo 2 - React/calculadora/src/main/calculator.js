import React, { Component } from 'react';
import Display from '../components/Display';
import Button from '../components/Button';
import './styles.css';

const initialState = {
  displayValue: '0',
  clearDisplay: false,
  operation: null,
  values: [null, null],
  current: 0,
};

export default class Calculator extends Component {
  state = { ...initialState };

  constructor(props) {
    super(props);

    this.addDigit = this.addDigit.bind(this);
    this.clearMemory = this.clearMemory.bind(this);
    this.setOperation = this.setOperation.bind(this);
  }

  addDigit(number) {
    if (number === '.' && this.state.displayValue.includes('.')) {
      return;
    }

    const clearDisplay =
      this.state.displayValue === '0' || this.state.clearDisplay;
    const currentValue = clearDisplay ? '' : this.state.displayValue;
    const displayValue = currentValue + number;
    this.setState({ displayValue, clearDisplay: false });

    if (number !== '.') {
      const i = this.state.current;
      const newValue = parseFloat(displayValue);
      const values = [...this.state.values];
      values[i] = newValue;
      this.setState({ values });
    }
  }

  clearMemory() {
    this.setState({ ...initialState });
  }

  setOperation(operation) {
    if (this.state.current === 0) {
      this.setState({ operation, current: 1, clearDisplay: true });
    } else {
      const equals = operation === '=';
      const currentOperation = this.state.operation;
      const values = [...this.state.values];
    

      try {
        if (currentOperation === '+') {
          values[0] = values[0] + values[1];
        }
        if (currentOperation === '-') {
          values[0] = values[0] - values[1];
        }
        if (currentOperation === 'x') {
          values[0] = values[0] * values[1];
        }
        if (currentOperation === '/') {
          values[0] = values[0] / values[1];
        }
        if (currentOperation === 'x²') {
          values[0] = values[0] * values[0];
        }
      } catch (e) {
        values[0] = this.state.values[0];
      }

      values[1] = null;

      this.setState({
        displayValue: values[0],
        operation: equals ? null : operation,
        current: equals ? 0 : 1,
        clearDisplay: !equals,
        values,
      });
    }
  }

  render() {
    const { operation, values } = this.state;

    return (
      <div className="calculador">
        <h1>CALCULADORA</h1>
        <Display
          display={this.state.displayValue}
          colorDisplay={operation === '/' && values[1] === 0}
        />

        <div className="container-buttons">
          <Button display="1" onClick={this.addDigit} />
          <Button display="2" onClick={this.addDigit} />
          <Button display="3" onClick={this.addDigit} />
          <Button display="+" onClick={this.setOperation} operation />

          <Button display="4" onClick={this.addDigit} />
          <Button display="5" onClick={this.addDigit} />
          <Button display="6" onClick={this.addDigit} />
          <Button display="-" onClick={this.setOperation} operation />

          <Button display="7" onClick={this.addDigit} />
          <Button display="8" onClick={this.addDigit} />
          <Button display="9" onClick={this.addDigit} />
          <Button display="x" onClick={this.setOperation} operation />

          <Button display="0" onClick={this.addDigit} />
          <Button display="." onClick={this.addDigit} />
          <Button display="C" onClick={this.clearMemory} />
          <Button display="/" onClick={this.setOperation} operation />

          <Button display="=" onClick={this.setOperation} triple />
          <Button display="x²" onClick={this.setOperation} operation />
        </div>
      </div>
    );
  }
}
