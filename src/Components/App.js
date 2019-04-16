import React, {Component} from 'react';
import Calc from "../Models/Calc";
import sources from "../Models/sources";
import {withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid/index";
import Paper from "@material-ui/core/Paper/index";
import Button from "@material-ui/core/Button/index";
import Menu from "@material-ui/core/Menu/index";
import MenuItem from "@material-ui/core/MenuItem/index";
import InfoIcon from '@material-ui/icons/Info';
import InfoDialog from "./InfoDialog";
import _ from 'lodash';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    button: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        width: '100%'
    },
    output: {
        padding: theme.spacing.unit * 2,
        color: theme.palette.text.secondary,
    },
    outputDisplay: {
        textAlign: 'right'
    },
    paper: {
        padding: theme.spacing.unit * 2,
        margin: 'auto',
        maxWidth: 500,
    }
});

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '0'];

class App extends Component {

    state = {
        value: 0,
        operation: null,
        solution: 0,
        prediction: null,
        source: 'js',
        calc: new Calc(),
        decimal: 0,
        loading: true,
        infoOpen: false,
        sourceEl: null
    };

    componentWillMount() {
        const {calc} = this.state;
        calc.loadModel().then(() => {
            this.setState({loading: false});
        });
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' || event.key === 'Esc') {
                this.clear();
            }
        });
        window.addEventListener("keypress", (event) => {
            if (_.has(numbers, event.key)) {
                this.doUpdateValue(Number(event.key));
            }
            if (event.code === "NumpadAdd" || (event.shiftKey && event.code === "Equal")) {
                this.doSetOperation('+');
            }
            if (event.shiftKey && event.code === "Digit5") {
                this.percent();
            }
            if (event.code === "NumpadMultiply" || (event.shiftKey && event.code === "Digit8")) {
                this.doSetOperation('X');
            }
            if (event.code === "NumpadDivide" || event.code === "Slash") {
                this.doSetOperation('/');
            }
            if (event.code === "NumpadDecimal" || event.code === "Period") {
                this.setDecimal();
            }
            if (event.code === "NumpadSubtract" || event.code === "Minus") {
                this.doSetOperation('-');
            }
            if (event.code === "Enter" || event.code === "NumpadEnter" || (!event.shiftKey && event.code === "Equal")) {
                this.doSetOperation('=');
            }

        });
    }

    updateValue = (e) => {
        const number = Number(e.target.innerText);
        this.doUpdateValue(number);
    };

    doUpdateValue = (number) => {
        const {operation, value, decimal} = this.state;
        if (operation === '=') {
            this.setState({
                value: value * 10 + number,
                operation: null,
                solution: 0,
                prediction: null
            });
        }
        if (decimal === 0) {
            this.setState({value: value * 10 + number});
        } else {
            const append = (Math.pow(.1, decimal) * number);
            this.setState({
                value: value >= 0 ? value + append : value - append,
                decimal: decimal + 1
            });
        }
    };

    setOperation = (e) => {
        let operationButton = e.target.innerText;
        this.doSetOperation(operationButton);
    };

    doSetOperation = (operationButton) => {
        const {solution, value, operation, source, calc} = this.state;
        let isEquals = false;
        if (operationButton === '=') {
            isEquals = true;
            operationButton = operation;
        }
        if (operationButton === '+') {
            let newSolution = operation === null ? value : solution + value;
            if (source === 'ml') {
                newSolution = operation === null ? value : calc.solve(value, operation, solution).predicted;
            }
            this.setState({
                solution: newSolution,
                value: 0,
                decimal: 0,
                operation: isEquals ? '=' : operationButton
            });
        }
        if (operationButton === '-') {
            let newSolution = operation === null ? value : solution - value;
            if (source === 'ml') {
                newSolution = operation === null ? value : calc.solve(value, operation, solution).predicted;
            }
            this.setState({
                solution: newSolution,
                value: 0,
                decimal: 0,
                operation: isEquals ? '=' : operationButton
            });
        }
        if (operationButton === 'X') {
            let newSolution = operation === null ? value : solution * value;
            this.setState({
                solution: newSolution,
                value: 0,
                decimal: 0,
                operation: isEquals ? '=' : operationButton
            });
        }
        if (operationButton === '/') {
            let newSolution = operation === null ? value : solution / value;
            this.setState({
                solution: newSolution,
                value: 0,
                decimal: 0,
                operation: isEquals ? '=' : operationButton
            });
        }
    };

    clear = () => {
        this.setState({
            value: 0,
            operation: null,
            solution: 0,
            decimal: 0,
            prediction: null
        });
    };

    solution = () => {
        const {value, solution} = this.state;
        if (value === 0) {
            return solution;
        }
        return value;
    };

    handleClick = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };

    inverse = () => {
        const {operation, solution, value} = this.state;
        if (operation === '=') {
            this.setState({solution: solution * -1});
        } else {
            this.setState({value: value * -1});
        }
    };

    percent = () => {
        const {operation, solution, value} = this.state;
        if (operation === '=') {
            this.setState({solution: solution * 0.01});
        } else {
            this.setState({value: value * 0.01});
        }
    };

    setSource = (e) => {
        this.setState({source: e.target.getAttribute('id')});
        this.clear();
        this.handleClose();
    };

    setDecimal = () => {
        this.setState({decimal: this.state.decimal === 0 ? 1 : this.state.decimal});
    };

    render() {
        const {operation, source, loading, anchorEl: sourceEl} = this.state;
        const {classes} = this.props;
        if (loading) {
            return (
                <div className={classes.root}>
                    <Paper className={classes.paper}>
                        <h3>Loading, one moment please.</h3>
                    </Paper>
                </div>
            );
        }
        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <Grid container className={classes.root} spacing={16} direction="row" justify="space-between"
                          alignItems="center">
                        <Grid item xs={12}>
                            <Paper className={classes.output}>
                                <h1 className={classes.outputDisplay}>{this.solution()}</h1>
                                <Grid container>
                                    <Grid item xs={2}>
                                        <Button aria-owns={sourceEl ? 'source' : undefined} aria-haspopup="true"
                                                onClick={this.handleClick}>
                                            {sources.filter(s => s.id === source)[0].short}
                                        </Button>
                                        <Menu id="source" anchorEl={sourceEl} open={Boolean(sourceEl)}
                                              onClose={this.handleClose}>
                                            {sources.map((s) =>
                                                <MenuItem key={s.id}
                                                          selected={s.id === source}
                                                          id={s.id}
                                                          onClick={this.setSource}>{s.name}</MenuItem>)}
                                        </Menu>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Button
                                            aria-label="Info"
                                            onClick={() => this.setState({infoOpen: true})}>
                                            <InfoIcon/>
                                        </Button>
                                        <InfoDialog
                                            open={this.state.infoOpen}
                                            source={sources.filter(s => s.id === source)[0]}
                                            onClose={() => this.setState({infoOpen: false})}/>
                                    </Grid>
                                    <Grid item xs={2}>
                                        {operation !== null ? <Button disabled={true}>{operation}</Button> : ''}
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={3}>
                            <Button className={classes.button} variant="contained" color="secondary" aria-label="Clear"
                                    onClick={this.clear}>AC</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button className={classes.button} variant="contained" color="secondary"
                                    aria-label="Inverse" onClick={this.inverse}>+/-</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button className={classes.button} variant="contained" color="secondary"
                                    disabled={source === 'ml'}
                                    aria-label="Percent" onClick={this.percent}>%</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button className={classes.button} variant="contained" color="secondary"
                                    disabled={source === 'ml'}
                                    aria-label="Divide" onClick={this.setOperation}>/</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button className={classes.button} variant="contained" color="primary"
                                    aria-label="7" onClick={this.updateValue}>7</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button className={classes.button} variant="contained" color="primary"
                                    aria-label="8" onClick={this.updateValue}>8</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button className={classes.button} variant="contained" color="primary" aria-label="9"
                                    onClick={this.updateValue}>9</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button className={classes.button} variant="contained" color="secondary"
                                    disabled={source === 'ml'}
                                    aria-label="Multiply" onClick={this.setOperation}>X</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button className={classes.button} variant="contained" color="primary"
                                    aria-label="4" onClick={this.updateValue}>4</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button className={classes.button} variant="contained" color="primary"
                                    aria-label="5" onClick={this.updateValue}>5</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button className={classes.button} variant="contained" color="primary"
                                    aria-label="6" onClick={this.updateValue}>6</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button className={classes.button} variant="contained" color="secondary"
                                    aria-label="Subtract" onClick={this.setOperation}>-</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button className={classes.button} variant="contained" color="primary"
                                    aria-label="1" onClick={this.updateValue}>1</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button className={classes.button} variant="contained" color="primary"
                                    aria-label="2" onClick={this.updateValue}>2</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button className={classes.button} variant="contained" color="primary"
                                    aria-label="3" onClick={this.updateValue}>3</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button className={classes.button} variant="contained" color="secondary"
                                    aria-label="Add" onClick={this.setOperation}>+</Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button className={classes.button} variant="contained" color="primary"
                                    onClick={this.updateValue}
                                    aria-label="Zero">0</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button className={classes.button} variant="contained" color="secondary"
                                    disabled={source === 'ml'}
                                    onClick={this.setDecimal}
                                    aria-label="Decimal Point">.</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button className={classes.button} variant="contained" color="secondary" aria-label="Equals"
                                    onClick={this.setOperation}>=</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(App);