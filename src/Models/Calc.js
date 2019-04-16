import * as tf from '@tensorflow/tfjs/dist/index';

import _ from 'lodash';

class Solution {
    constructor(actual, predicted) {
        this.actual = actual;
        this.predicted = predicted;
    }
}

export default class Calc {

    static largest = 10000;
    static alphabet = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '+', ' '];

    async loadModel() {
        this.model = await tf.loadLayersModel('/model.json');
        return this;
    }

    solve(x1, op, x2) {
        const solution = Calc.convert(x1, op, x2);
        const result = this.model.predict(tf.tensor(solution.actual));
        const data = result.arraySync();
        let expected = Calc.invert(solution.predicted[0]);
        let predicted = Calc.invert(data[0]);
        return new Solution(expected, predicted);
    }

    static invert(seq) {
        let strings = [];
        for (let pattern of seq) {
            let maxIndex = 0;
            let maxValue = 0;
            for (let i in pattern) {
                if (pattern[i] > maxValue) {
                    maxValue = pattern[i];
                    maxIndex = i;
                }
            }
            strings.push(Calc.alphabet[maxIndex]);
        }
        return strings.join('')
    }


    static convert(x1, operation, x2) {
        const calculation = [[x1, x2, operation === '+' ? 0 : 1]];
        const solution = [operation === '+' ? x1 + x2 : x1 - x2];
        const solutionAsString = Calc.asString(calculation, solution);
        const solutionAsInteger = Calc.integerEncode(solutionAsString);
        return Calc.one_hot_encode(solutionAsInteger);
    }

    static asString(calculation, solution) {
        const numbersToCalculate = 2;
        let maxLength = numbersToCalculate * Math.ceil(Math.log10(Calc.largest + 1)) + numbersToCalculate - 1;
        let solutionAsString = [];
        for (let pattern of calculation) {
            const operation = pattern[2] === 0 ? '+' : '-';
            const equation = _.padStart(pattern[0] + operation + pattern[1], maxLength, ' ');
            solutionAsString.push(equation)
        }
        maxLength = Math.ceil(Math.log10(numbersToCalculate * (Calc.largest + 1)));
        let answerAsString = [];
        for (let pattern of solution) {
            const paddedAnswer = _.padStart(pattern, maxLength, ' ');
            answerAsString.push(paddedAnswer)
        }
        return new Solution(solutionAsString, answerAsString);
    }

    static integerEncode(solution) {
        const Xenc = [];
        for (let pattern of solution.actual) {
            let integer_encoded = [];
            for (let char of pattern) {
                integer_encoded.push(Calc.alphabet.indexOf(char));
            }
            Xenc.push(integer_encoded);
        }
        const yenc = [];
        for (let pattern of solution.predicted) {
            let integer_encoded = [];
            for (let char of pattern) {
                integer_encoded.push(Calc.alphabet.indexOf(char));
            }
            yenc.push(integer_encoded)
        }
        return new Solution(Xenc, yenc);
    }

    static one_hot_encode(solution) {
        let Xenc = [];
        for (let seq of solution.actual) {
            let pattern = [];
            for (let index of seq) {
                let vector = [];
                for (let i = 0; i < Calc.alphabet.length; i++) {
                    vector.push(0);
                }
                vector[index] = 1;
                pattern.push(vector);
            }
            Xenc.push(pattern);
        }
        let yenc = [];
        for (let seq of solution.predicted) {
            let pattern = [];
            for (let index of seq) {
                let vector = [];
                for (let i = 0; i < Calc.alphabet.length; i++) {
                    vector.push(0);
                }
                vector[index] = 1;
                pattern.push(vector);
            }
            yenc.push(pattern);
        }
        return new Solution(Xenc, yenc);
    }
}