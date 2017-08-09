import React from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

export class SliderComponent extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            
        };
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(e){
        let down = e[0];
        let up = e[1];
        this.props.getValues(down, up);
    }
    render() {
        var output;
        if(this.props.max > 100){
            output = <Range 
                defaultValue={[0,10]}
                max={this.props.max}
                min={this.props.min}
                pushable={10}
                onChange={this.handleChange}
            />;
        }else{
            output = <Range 
                defaultValue={[0,5]}
                max={this.props.max}
                min={this.props.min}
                pushable={5}
                onChange={this.handleChange}
            />;
        }
        return (
            <div>
                {output}
            </div>
        );
    }
}