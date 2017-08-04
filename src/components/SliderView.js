import React from 'react';

export class SliderView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            valueDown: 45,
            valueUp: 55
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeDown = this.handleChangeDown.bind(this);
        this.handleChangeUp = this.handleChangeUp.bind(this);
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
    render(){
        return (
            <div>
                <p>Slider Platz</p>
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