import React, { Component } from 'react';
import Dictaphone from "./Dictaphone";
// import surveyJson from "../consts/surveyJSON.json"
import commands from "../const/commands.json"
import Checkbox from "./Checkbox"
import WebcamStreamCapture from './WebcamStreamCapture';

export default class Frame extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkboxes: commands.commands.reduce(
                (options, option) => ({
                    ...options,
                    [option]: false
                }),
                {}
            )

        }
        //add localization 


    }

    sendAns = (answer) => {
        this.setState(prevState => ({
            checkboxes: {
                ...prevState.checkboxes,
                [answer]: !prevState.checkboxes[answer]
            }
        }));
    };
    handleCheckboxChange = changeEvent => {
        const { name } = changeEvent.target;
    
        this.setState(prevState => ({
          checkboxes: {
            ...prevState.checkboxes,
            [name]: !prevState.checkboxes[name]
          }
        }));
      };
    
    createCheckbox = option => (
        <Checkbox
            label={option}
            isSelected={this.state.checkboxes[option]}
            onCheckboxChange={this.handleCheckboxChange}
            key={option}
        />
    );
    createCheckboxes = () => commands.commands.map(this.createCheckbox);


    render() {


        return (
            <div>

                {this.createCheckboxes()}
                <div className="dict">
                    <WebcamStreamCapture/>
                    <Dictaphone sendAns={this.sendAns.bind(this)} voiceCommands={commands.commands} />
                </div>

            </div>
        )
    }
}
