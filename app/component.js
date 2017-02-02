import React from 'react';

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = { amount: 0 };
  }
  render() {
    return (
      <div>
        <span>Amount: {this.state.amount}</span>
        <button onClick={() => this.setState(addOne)}>Add one</button>
      </div>
    );
  }
}

const addOne = ({ amount }) => ({ amount: amount + 1 });

export default Counter;