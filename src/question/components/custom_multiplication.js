#!javascript
import {isFunction} from 'lodash';

/*jshint: 'esversion': 11 */

export default class CustomMultiplication {
    constructor(mount, { question, response }) {
        this.mount = mount;
        this.question = question;
        this.response = response;
        this.components = {
            displays: {},
            handlers: {},
        }
    }

    enable() {
        this.disabled = false;
    }

    disable() {
        this.disabled = true;
    }

    registerEvents(events){
        this.events = Object.assign({
            onChange: null,
            onValidationUICleared: null
        }, events);
    }
    /**
     * Triggers events registered with registerEvent
     */

    triggerEvent(name, ...args) {
        const { events } = this;

        console.log(`isFunction(${name}): ${isFunction(events[name])}`);

        if (events && isFunction(events[name])) {
            events[name](...args);
        }
    }
    /**
     * Render function creates HTML and mounts it to the DOM.
     * Adhering to DRY principles, we render the HTML using JavaScript's
     * DOM API. 
     * Document fragment is created. Along with a display (comprised of 3 divs),
     * and 3 columns containing buttons numbered 0 - 9.
     * @return Void - appends DOM fragment to this.mount 
     *
     */
    render() {
        const { mount }  = this
        const elem = this
        const math_question = document.createDocumentFragment();
        const num_buttons = {
            'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4,
            'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9
                            };
        const display_list = ['hundreds', 'tens', 'ones'];

        this.insertStyles();

        
         // Loops over array and creates a div
         // which contains two further divs: 
         // a display and a button container 
         // Example:
         // <div class="hundreds-col">
         //     <div class="hundreds-display"></div>
         //      <div class="hundreds-buttons"></div>
         // </div>
        
        display_list.forEach(
            function(a){
            const div = document.createElement('div');
            div.setAttribute('class', `${a}-col`);
            const display_div = document.createElement('div');
            display_div.setAttribute('class', `${a}-display`);
            display_div.append("0");
            const num_button_container = document.createElement('div');
            num_button_container.setAttribute('class', `${a}-buttons`);
             // For loop outputs html for button 
             // which is appended to num_button_container
             // Example:
             // <div class="hundreds-buttons">
             //      <button class='hundreds-num-btn' name="zero" value=0>
             //      0
             //      </button>
             //      ...
             //  </div>
             // 
             //  Additionally, an event listener shall be added
             //  which will listen for a click event
             //  When clicked, the 
             //  function will return the 
             //  target.className, target.value
             //  and the value of the button to 
             //  the updateDisplay function
             
            for (const key in num_buttons){
                    const num_button = document.createElement('button');
                    num_button.setAttribute('class', `${a}-num-btn`);
                    num_button.setAttribute('name', key);
                    num_button.setAttribute('value', num_buttons[key]);
                    num_button.addEventListener('click', function(e) {
                                        elem.updateDisp(e.target.className, e.target.value);
                                        elem.addClass('click', e.target);
                                        });                    
                    num_button.append(num_buttons[key]);
                    num_button_container.append(num_button);
                                            }
            div.append(display_div, num_button_container);
            math_question.append(div);
                }); // END OF FOREACH

            mount.appendChild(math_question);

            // Assign display divs to this Object for reuse

            this.components.displays = Object.assign(
                                                    {
                                                        'hundreds': document.querySelector('.hundreds-display'),
                                                        'tens': document.querySelector('.tens-display'),
                                                        'ones': document.querySelector('.ones-display')
                                                    }, this.components.displays);
            console.log('Question mounted Successfully');
            }

    clearValidationUI() {

            const { hundreds, tens, ones } = this.components.displays;

            // Trigger Learnosity Event

            this.triggerEvent('onValidationUICleared');

            // Get Dom Elements and set them to the initial state
            hundreds.innerText = "0";
            tens.innerText = "0";
            ones.innerText = "0";

        }
    // If result is True, apply classes to elements in the DOM
    // Alerts the user they have answered correctly
    renderValidationUI(a_result) {

        const cmq = this;

        console.log('renderValidationUI fired');

        if (a_result) {

            console.log(`Correct Answer Fired`);
            cmq.addClass('success');
            // Turn clicked buttons Green with white text to reflect correct answer.
            // Change text color of this.display to green.

        } else {
            console.log('renderValidationUI: Incorrect Answer Posted');
            cmq.addClass('incorrect');
            // Switch UI elements to reflect correct answer
            // And display correct answer.
            }
        }
    updateDisp(btnClassName, value) {
        const { hundreds, tens, ones } = this.components.displays;

        switch(btnClassName) {
            case 'hundreds-num-btn':
                hundreds.innerText = `${value}`;
                break;
            case 'tens-num-btn':
                tens.innerText = `${value}`;
                break;
            case 'ones-num-btn':
                ones.innerText = `${value}`;
                break;
            default:
                throw Error(`${name}: Event did not return valid className`);
            }
        this.updateResponse();
    } // END OF CLASS
    /**
     *
     *
     *
     * Updates response object following click event by student
     * @return {None} void - Changes this.response to reflect changes; triggers 'onChange'
     */
    updateResponse(){
        const { hundreds, tens, ones } = this.components.displays;
        const student_response = parseInt(`${hundreds.innerText}${tens.innerText}${ones.innerText}`);
        this.response = this.response || {};
        this.response.value = student_response;         
        this.triggerEvent('onChange', this.response);
    }

    insertStyles(){
        const head = document.querySelector('head');

        const style = document.createElement('style');

        style.innerText = ` 
                
            .success {
                background-color: forestgreen;
                color: white;
            }

            .clicked {
                background-color: cadetblue;
                color: white;
            }

            .incorrect {
                background-color: magenta;
                color: white;
            }


            .custom-multiplication-question {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                width: 40vw;
                margin: auto;
            }

            .hundreds-col, 
            .tens-col, 
            .ones-col {
                display: flex;
                flex-direction: column;
                width: 33%;
            }

            .hundreds-buttons,
            .tens-buttons,
            .ones-buttons {
                display: flex;
                flex-direction: column;
                width: 100%;
            }

            .hundreds-display,
            .tens-display,
            .ones-display {
                min-width: 2 rem;
                width: 30%;
                align-self: center;
                font-size: larger;
                text-align: center;
                padding-bottom: 5px;
            }

            .hundreds-num-btn,
            .tens-num-btn,
            .ones-num-btn {
                min-width: 2 rem;
                width: 100%;
                margin: 10px 10px;
                padding: 5px 5px;
            }
        `;
        head.append(style);
    }
    /**
     *  Adds classes to the supplied target HTMLElement following an event
     *  @param {HTMLElement} target - A HTML Element
     *  @param {String} event - A string stating the event to which we are responding
     *  @return None. Sets Class attribute on HTMLELement
     *
     */
    addClass(event, target=null) {
        // TODO: Clear Candidate for Refactor: to a setState function with addClass, removeClass helpers
        // Check if target is HTMLElement
        // If not, throw error

        const cmq = this;

        switch(event){
            case 'click':
            if (!target instanceof HTMLElement) {
                    throw Error(`addClass: ${target} must be instance of HTMLELement.`);
                }
                //remove previously clicked element
                const oldbutton = document.querySelector(`.${target.parentNode.getAttribute('class')} .clicked`);

                console.log(`RemoveClass QuerySelector: ${oldbutton}, ParentNode: ${target.parentNode.getAttribute('class')}`);

                if (oldbutton) {
                    cmq.removeClass(oldbutton, 'clicked');
                } 
                const class_string = target.getAttribute('class');
                const new_class = class_string.concat(" ", 'clicked');
                target.setAttribute('class', new_class);
                break;
            case 'success':
                // Get array of correctly clicked buttons and change the requisite class 
                // to that of success
                cmq.setCorrect();
                break;
            case 'incorrect':
                // Get array of clicked buttons
                               // Add a success class to the correct ones
                // Add an incorrect class to the incorrect ones
                // Highlight the correct button.
                cmq.setIncorrect();
                break;
            default:
                throw Error(`addClass: '${event}' is not a recognised event for this function`);
        }
    }
    /**
     * Removes a class from a HTMLElement
     * Note: Does not test for presence of class. If class was not present initially, classes are still set.
     *
     * @param {HTMLElement} target - a htmlElement with classes
     * @param {String} className - a string corresponding to a class name
     * @return Void - changes class attribute to filtered list
     */
    removeClass(target, className) {
        // Return classes as list
        const class_list = target.getAttribute('class').split(" ");
        // filter out the class corresponding to classname

        const removed_list = class_list.filter(function(el) { if (el != className){ return el }});

        target.setAttribute('class', removed_list.join(" "));
    }
    /**
     *
     *
     * Highlights the correct answers in green
     *
     */ 
    setCorrect(){

       const correct_answers = document.querySelectorAll('.clicked');
        // loop over each answer and remove '.clicked' class
        for (var i =0; i < correct_answers.length; i++){
            this.removeClass(correct_answers[i], 'clicked');
        }

        const answer_array = [document.querySelector('.hundreds-num-btn[name="three"]'), document.querySelector('.tens-num-btn[name="two"]'), document.querySelector('.ones-num-btn[name="eight"]')];

        for (var i=0; i < answer_array.length; i++){
            this.removeClass(answer_array[i], 'clicked')
            const class_string = answer_array[i].getAttribute('class').concat(" ", 'success');
            answer_array[i].setAttribute('class', class_string);
        }
    }
    /**
     *
     * Following Incorrect Answer switches the UI to display correct
     * answer
     *
     * 
    */
    setIncorrect(){ 

       const incorrect_answers = document.querySelectorAll('.clicked');
        // loop over each answer and remove '.clicked' class
        for (var i = 0; i < incorrect_answers.length; i++){
            this.removeClass(incorrect_answers[i], 'clicked')
        }

        const answer_array = [document.querySelector('.hundreds-num-btn[name="three"]'), document.querySelector('.tens-num-btn[name="two"]'), document.querySelector('.ones-num-btn[name="eight"]')];

        answer_array.forEach(function(answer){
            const class_string = answer.getAttribute('class').concat(" ", 'clicked');
            answer.setAttribute('class', class_string);
        });
        const [hundreds, tens, ones] = [document.querySelector('.hundreds-display'), document.querySelector('.tens-display'), document.querySelector('.ones-display')];

        hundreds.innerText = "3";
        tens.innerText = "2";
        ones.innerText = "8";
    }
}
