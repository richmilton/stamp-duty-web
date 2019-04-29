import React, { Component } from 'react';
import './App.css';
const ukIsdlt = require('uk-ireland-stampduty-calculator');

const { calculate, buyerTypes, countries, propertyTypes } = ukIsdlt;

const Band = function ({start, end, bandAmount, taxAdded, adjustedRate, index}) {
  const classes = 'col-2 text-right border-left';
  return (
    <div key={`band-${index}`} className="row border-bottom">
      <div className="col-4 text-right">{start}</div>
      <div className={classes}>{end}</div>
      <div className={classes}>{bandAmount}</div>
      <div className={classes}>{adjustedRate}</div>
      <div className={classes}>{taxAdded.toFixed(2)}</div>
    </div>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      propertyValue: 0,
      propertyType: propertyTypes.RESIDENTIAL,
      buyerType: buyerTypes.MOVING_HOUSE,
      country: countries.ENGLAND,
      summaryBands: [],
      tax: 0,
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {

  }

  handleChange(event) {
    // console.log(event.target.value);
    const { name, value } = event.target;
    this.setState({ [name]: value }, () => {
      const { propertyValue, propertyType, country, buyerType } = this.state;
      const { summaryBands, tax } = calculate(
        propertyValue, propertyType, country, buyerType
      );
      this.setState({ summaryBands, tax })
    });
  }

  render() {

    const { summaryBands, tax, propertyType, buyerType, country } = this.state;

    return (
      <div className="App">
        <h3>stampduty calculator</h3>
        <div className="container">
          <div className="row">
            <div className="col-3">
              <input
                className="form-control"
                type="text"
                name="propertyValue"
                placeholder="property value"
                onChange={this.handleChange}
              />
            </div>
            <div className="col-3">
              <select
                className="form-control"
                name="propertyType"
                onChange={this.handleChange}
                defaultValue={propertyType}
              >
                {Object.keys(propertyTypes).sort().reverse().map(propName => (
                  <option
                    key={propertyTypes[propName]}
                    name={propertyTypes[propName]}>
                    {propertyTypes[propName]}
                  </option>
                ))
                }
              </select>
            </div>
            <div className="col-3">
              <select
                className="form-control"
                name="buyerType"
                onChange={this.handleChange}
                defaultValue={buyerType}
              >
                {Object.keys(buyerTypes).sort().reverse().map(propName => (
                  <option
                    key={buyerTypes[propName]}
                    name={buyerTypes[propName]}>
                    {buyerTypes[propName]}
                  </option>
                ))
                }
              </select>
            </div>
            <div className="col-3">
              <select
                onChange={this.handleChange}
                className="form-control"
                name="country"
                defaultValue={country}
              >
                {Object.keys(countries).sort().map(propName => (
                  <option
                    key={countries[propName]}
                    name={countries[propName]}>
                    {countries[propName]}
                  </option>
                ))
                }
              </select>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row border-bottom font-weight-bold">
            bands
          </div>
          <div className="row font-italic border-bottom text-right">
            <div className="col-4">from</div>
            <div className="col-2 border-left">to</div>
            <div className="col-2 border-left">taxable</div>
            <div className="col-2 border-left">rate</div>
            <div className="col-2 border-left">tax</div>
          </div>
          {summaryBands.map((props, index) => Band({index, ...props}))}
          <div className="row text-right border-bottom">
            <div className="col-12">
              {tax.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
