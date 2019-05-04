import React, { Component } from 'react';
import './App.css';
const { calculate, buyerTypes, countries, propertyTypes } = require('uk-ireland-stampduty-calculator');

const buyerTypeLabels = {
  [buyerTypes.MOVING_HOUSE]: 'moving home',
  [buyerTypes.INVESTOR]: 'buy to let/additional home',
  [buyerTypes.FIRST_TIME]: 'first time buyer',
};

const Band = function ({start, end, bandAmount, bandLimit, taxAdded, adjustedRate, index}) {
  const col2LeftBorderTextRight = 'col-2 text-right border-left';
  return (
    <div key={`band-${index}`} className="row border-bottom text-monospace">
      <div className="col-2 text-right">{start}</div>
      <div className={col2LeftBorderTextRight}>{bandLimit}</div>
      <div className={col2LeftBorderTextRight}>{bandAmount}</div>
      <div className={col2LeftBorderTextRight}>{adjustedRate}</div>
      <div className="col-4 text-right border-left">{taxAdded}</div>
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
      comment: 'hello',
    };
    this.handleChange = this.handleChange.bind(this);
    this.doCalc = this.doCalc.bind(this);
  }

  componentDidMount() {
    // console.log(Sdc)
    this.doCalc();
  }

  doCalc() {
    const { propertyValue, propertyType, country, buyerType } = this.state;
    const { summaryBands, tax, comment } = calculate(
      propertyValue, propertyType, country, buyerType
    );
    this.setState({ summaryBands, tax, comment })
  }

  handleChange(event) {
    const { name, value } = event.target;
    const integerPattern = /^[-+]?\d*$/;
    if (name === 'propertyValue') {
      if (!integerPattern.test(value)) {
        this.setState({comment: 'whole numbers only please'});
        return;
      } else if (value.length > 9) {
        this.setState({comment: 'maximum input 99999999'});
        return;
      }
    }
    this.setState({ [name]: value }, this.doCalc);
  }

  render() {

    const {
      propertyValue,
      summaryBands,
      tax,
      propertyType,
      buyerType,
      country,
      comment,
    } = this.state;
    const currencySymbol = String.fromCharCode(country === countries.IRELAND ? 8364 : 163);
    const col2LeftBorder = 'col-2 border-left';
    const buyerTypeDropdownComponent = (
      propertyType !== propertyTypes.RESIDENTIAL
      || country === countries.IRELAND
    ) ? '' : (
        <select
          className="form-control"
          name="buyerType"
          onChange={this.handleChange}
          defaultValue={buyerType}
        >
          {Object.keys(buyerTypes).sort().reverse().map(propName => (
            <option
              key={buyerTypes[propName]}
              value={buyerTypes[propName]}>
              {buyerTypeLabels[buyerTypes[propName]]}
            </option>
          ))
          }
        </select>
      );
    const commentDiv = comment === '' ? '' : <div className="col-12 font-italic">{comment}</div>;

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
                value={propertyValue}
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
              {buyerTypeDropdownComponent}
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row border-bottom">
            <div className="col-12 font-weight-bold">
              {`${currencySymbol + tax} tax due`}
            </div>
            {commentDiv}
          </div>
          <div className="row border-bottom">
            <span className="font-weight-bold">Bands</span>
          </div>
          <div className="row font-italic border-bottom text-right">
            <div className="col-2">
              from(
              {currencySymbol}
              )
            </div>
            <div className={col2LeftBorder}>
              to(
              {currencySymbol}
              )
            </div>
            <div className={col2LeftBorder}>
              taxable(
              {currencySymbol}
            )
            </div>
            <div className={col2LeftBorder}>
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
              {tax}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
