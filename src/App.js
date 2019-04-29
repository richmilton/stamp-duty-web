import React, { Component } from 'react';
import './App.css';
const ukIsdlt = require('uk-ireland-stampduty-calculator');

const { calculate, buyerTypes, countries, propertyTypes } = ukIsdlt;

const buyerTypeLabels = {
  [buyerTypes.MOVING_HOUSE]: 'moving home',
  [buyerTypes.INVESTOR]: 'buy to let/additional home',
  [buyerTypes.FIRST_TIME]: 'first time buyer',
};

const Band = function ({start, end, bandAmount, bandLimit, taxAdded, adjustedRate, index}) {
  const classes = 'col-2 text-right border-left';
  return (
    <div key={`band-${index}`} className="row border-bottom text-monospace">
      <div className="col-2 text-right">{start}</div>
      <div className={classes}>{end}</div>
      <div className={classes}>{bandAmount}</div>
      <div className={classes}>{adjustedRate}</div>
      <div className="col-4 text-right border-left">{taxAdded.toFixed(2)}</div>
    </div>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      propertyValue: 200000,
      propertyType: propertyTypes.RESIDENTIAL,
      buyerType: buyerTypes.MOVING_HOUSE,
      country: countries.ENGLAND,
      summaryBands: [],
      tax: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.doCalc = this.doCalc.bind(this);
  }

  componentDidMount() {
    this.doCalc();
  }

  doCalc() {
    const { propertyValue, propertyType, country, buyerType } = this.state;
    const { summaryBands, tax } = calculate(
      propertyValue, propertyType, country, buyerType
    );
    this.setState({ summaryBands, tax })
  }

  handleChange(event) {
    // console.log(event.target.value);
    const { name, value } = event.target;
    this.setState({ [name]: value }, this.doCalc);
  }

  render() {

    const { propertyValue, summaryBands, tax, propertyType, buyerType, country } = this.state;
    const currencySymbol = String.fromCharCode(country === countries.IRELAND ? 8364 : 163);

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
                maxLength="10"
                defaultValue={propertyValue}
              />
              {`${currencySymbol}price`}
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
            <div className="col-3">
              <select
                className="form-control"
                name="buyerType"
                onChange={this.handleChange}
                defaultValue={buyerType}
                style={
                  (
                    propertyType !== propertyTypes.RESIDENTIAL
                    || country === countries.IRELAND
                  ) ? { display: 'none' } : {}
                }
              >
                {Object.keys(buyerTypes).sort().reverse().map(propName => (
                  <option
                    key={buyerTypes[propName]}
                    name={buyerTypes[propName]}>
                    {buyerTypeLabels[buyerTypes[propName]]}
                  </option>
                ))
                }
              </select>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row border-bottom font-weight-bold">
            <div className="col-12">
              {`${currencySymbol + tax.toFixed(2)} tax due`}
            </div>
          </div>
          <div className="row border-bottom font-weight-bold">
            Bands
          </div>
          <div className="row font-italic border-bottom text-right">
            <div className="col-2">
              from(
              {currencySymbol}
              )
            </div>
            <div className="col-2 border-left">
              to(
              {currencySymbol}
              )
            </div>
            <div className="col-2 border-left">
              taxable(
              {currencySymbol}
            )
            </div>
            <div className="col-2 border-left">
              rate(
              {String.fromCharCode(37)}
              )
            </div>
            <div className="col-4 border-left">
              tax(
              {currencySymbol}
              )
            </div>
          </div>
          {summaryBands.map((props, index) => Band({index, ...props}))}
          <div className="row text-right border-bottom text-monospace">
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
