import Question from './question/index';
import '../scss/main.scss';
import CustomMultiplicationQuestion from './question/index';

/*global LearnosityAmd*/
LearnosityAmd.define([], function () {
    return {
        Question: CustomMultiplicationQuestion 
    };
});
