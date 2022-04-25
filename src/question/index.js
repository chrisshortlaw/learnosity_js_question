import { PREFIX } from './constants';
import CustomMultiplication from './components/custom_multiplication';
import { isFunction } from 'lodash';

export default class CustomMultiplicationQuestion {
    constructor(init, lrnUtils) {
        this.init = init;
        this.events = init.events;
        this.lrnUtils = lrnUtils;
        this.el = init.$el.get(0);

        this.render().then(() =>{
            this.registerPublicMethods();
            this.handleEvents();

            if (init.state === 'review') {
                init.getFacade().disable();
            }

            init.events.trigger('ready');
        });
    }
    render() {
        const { el, init, lrnUtils } = this;
        const { question, response } = init;

        el.innerHTML = `
            <div class="${PREFIX} lrn-response-validation-wrapper">
                <div class="lrn_response_input">
                   <div class="custom-multiplication-question">
                    </div> 
                </div>            
                <div class="${PREFIX}-checkAnswer-wrapper"></div>
                <div class="${PREFIX}-suggestedAnswers-wrapper"></div>
            </div>
        `;
        // Optional - Render optional Learnosity components like Check Answer Button, Suggested Answers List
        // first before rendering your question's components
        return Promise.all([
            lrnUtils.renderComponent('SuggestedAnswersList', el.querySelector(`.${PREFIX}-suggestedAnswers-wrapper`)),
            lrnUtils.renderComponent('CheckAnswerButton', el.querySelector(`.${PREFIX}-checkAnswer-wrapper`))
        ]).then(([suggestedAnswersList]) => {
            this.suggestedAnswersList = suggestedAnswersList;
            this.cmq = new CustomMultiplication(el.querySelector('.custom-multiplication-question'), {question, response});
            this.cmq.render();
        });
    }
    /**
     * Add public methods to the created question instance that is accessible during runtime
     *
     * Example: questionsApp.question('my-custom-question-response-id').myNewMethod();
     */
    registerPublicMethods() {

        const { init, cmq } = this;
        // Attach the methods you want on this object
        const facade = init.getFacade();

        facade.disable = () => {
            if (cmq) {
                cmq.disable();
                }
            };
        facade.enable = () => {
            if (cmq) {
                cmq.enable();
                }
            };
    }

    handleEvents() {
        const { events, init, cmq } = this;

        cmq.registerEvents({
            onChange(responses) {
                console.log('onChange Event Fired');
                events.trigger('changed', responses);
                
            },
            onValidationUICleared() {
                console.log('INSERT the UI Validation Clearance here');
                cmq.clearValidationUI();
            }
        });

        // "validate" event can be triggered when Check Answer button is clicked or when public method .validate() is called
        // so developer needs to listen to this event to decide if he wants to display the correct answers to user or not
        // options.showCorrectAnswers will tell if correct answers for this question should be display or not.
        // The value showCorrectAnswers by default is the value of showCorrectAnswers inside initOptions object that is used
        // to initialize question app or the value of the options that is passed into public method validate (like question.validate({showCorrectAnswers: false}))
        events.on('validate', options => {

            this.init.getFacade().disable();
    
            const result = this.init.getFacade().isValid();

            cmq.renderValidationUI(result);
            init.getFacade().disable();

            if (options.showCorrectAnswers && !result) {
                init.getFacade().disable();
                cmq.addClass('incorrect');
            } else {
                cmq.addClass('success');
            }
        });    
    }
}
