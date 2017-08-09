import React from 'react';
import PropTypes from 'prop-types';
import {SliderComponent} from './SliderComponent';

export class SliderView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            valueDown: 0,
            valueUp: 10
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeDown = this.handleChangeDown.bind(this);
        this.handleChangeUp = this.handleChangeUp.bind(this);
        this.change = this.change.bind(this);
    }
    handleSubmit(e){
        this.props.getNumbers(this.state.valueDown, this.state.valueUp);
        e.preventDefault();
    }
    handleChangeDown(e){
        this.setState({
            valueDown: e.target.value
        });
    }
    handleChangeUp(e){
        this.setState({
            valueUp: e.target.value
        });
    }
    change(down, up){
        this.setState({
            valueDown: down,
            valueUp: up
        });
    }
    render(){
        return (
            <div>
                <div className="slider">
                    <SliderComponent max={this.props.maxValue} min={this.props.minValue} getValues={this.change} />
                </div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                      Between
                      <input type="text" value={this.state.valueDown} onChange={this.handleChangeDown} disabled/>
                    </label>
                    <label>
                      and
                      <input type="text" value={this.state.valueUp} onChange={this.handleChangeUp} disabled/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
             </div>
        );
    }
}

SliderView.propTypes = {
    getNumbers: PropTypes.func
}