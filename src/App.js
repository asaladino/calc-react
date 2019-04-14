import React, {Component} from 'react';
import './App.css';
import Calc from "./Calc";

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            x1: 123,
            x2: 321,
            calc: new Calc()
        };
    }

    runCalc() {
        const {x1, x2, calc} = this.state;
        calc.loadModel().then(calc => {
            calc.solve(x1, '+', x2);
        })
    }

    render() {
        const {x1, x2} = this.state;
        return (
            <div className="App">
                <h3>What does {x1} + {x2} = ?</h3>
                <ul>
                    <li>Predicted: {x1 + x2}</li>
                    <li>Actual: </li>
                </ul>
            </div>
        );
    }
}
