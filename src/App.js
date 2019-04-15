import React, {Component} from 'react';
import './App.css';
import Calc from "./Calc";

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            x1: 123,
            x2: 321,
            solution: null,
            calc: new Calc()
        };
        this.runCalc = this.runCalc.bind(this);
    }

    runCalc() {
        const {x1, x2, calc} = this.state;
        calc.loadModel().then(calc => {
            const solution = calc.solve(x1, '+', x2);
            this.setState({solution: solution});
        })
    }

    render() {
        const {x1, x2, solution} = this.state;
        return (
            <div className="App">
                <h3>What does {x1} + {x2} = ?</h3>
                <ul>
                    <li>Actual: {solution === null ? '' : solution.x}</li>
                    <li>Predicted: {solution === null ? '' : solution.y}</li>
                </ul>
                <button onClick={this.runCalc}>Solve!</button>
            </div>
        );
    }
}
