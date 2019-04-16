export default [
    {
        id: 'ml',
        name: 'Neural Network',
        short: 'ML',
        description: `This calculator uses a trained classifier with one hot encoding to perform the calculation.
        It was build with keras and tensorflow, 
        <a href="https://github.com/asaladino/calc-react" target="_blank">checkout the repo on github</a>.
        What is interesting about the model is
        that it doesn't have any understanding of the logic or numbers, it just knows that give a string of characters
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '+', ' '] in a give order 102-29 should yield an 
        answer of 73. The model can perform this calculation with an accuracy of 99.37%, meaning some answers aren't
        going to be correct.`
    },
    {
        id: 'js',
        name: 'Browser',
        short: 'Browser',
        description: `This calculator uses javascript and your browser to perform calculations. Making calculations
        in javascript can produce unexpect results when working with floating point numbers. For example, 0.1 + 0.2 
        should be 0.3 but javascript will produce 0.30000000000000004 as the final answer.`
    }
];