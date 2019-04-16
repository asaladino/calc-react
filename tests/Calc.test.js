import Calc from "../src/Models/Calc";

test('calc to string', () => {
    let x = 30;
    let op = '+';
    let x2 = 100;
    let X = [[x, x2, op === '+' ? 0 : 1]];
    let y = [op === '+' ? x + x2 : x - x2];
    const result = Calc.asString(X, y);
    console.log(result);
});

test('integer encoding', () => {
    let x = 30;
    let op = '+';
    let x2 = 100;
    let X = [[x, x2, op === '+' ? 0 : 1]];
    let y = [op === '+' ? x + x2 : x - x2];
    const solutionAsString = Calc.asString(X, y);
    const solutionAsInteger = Calc.integerEncode(solutionAsString);
    console.log(solutionAsInteger);
});

test('one hot encoding', () => {
    let x = 30;
    let op = '+';
    let x2 = 100;
    let X = [[x, x2, op === '+' ? 0 : 1]];
    let y = [op === '+' ? x + x2 : x - x2];
    const solutionAsString = Calc.asString(X, y);
    const solutionAsInteger = Calc.integerEncode(solutionAsString);
    const solutionAsOneHot = Calc.one_hot_encode(solutionAsInteger);
    console.log(JSON.stringify(solutionAsOneHot, null, '\t'));
});

test('invert encoding', () => {
    let x = 30;
    let op = '+';
    let x2 = 100;
    let X = [[x, x2, op === '+' ? 0 : 1]];
    let y = [op === '+' ? x + x2 : x - x2];
    const solutionAsString = Calc.asString(X, y);
    const solutionAsInteger = Calc.integerEncode(solutionAsString);
    const solutionAsOneHot = Calc.one_hot_encode(solutionAsInteger);
    const equation = Calc.invert(solutionAsOneHot.actual[0]);
    const solution = Calc.invert(solutionAsOneHot.predicted[0]);
    console.log(equation);
    console.log(solution);
});

test('solve', () => {
    let calc = new Calc();
    let x1 = 30;
    let op = '+';
    let x2 = 100;
    calc.loadModel().then(calc => {
        calc.solve(x1, op, x2);
    })
});