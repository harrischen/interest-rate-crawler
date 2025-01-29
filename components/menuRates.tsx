import React from "react";

interface IMenuRatesProps {
  rates: {
    [key: string]: string;
  };
}

class MenuRatesComponent extends React.Component<IMenuRatesProps> {
  render() {
    return (
      <div className="menu-rates">
        <div className="menu-tip">Tips</div>
        {Object.keys(this.props.rates).map((i) => (
          <div key={i} className="menu-rate">
            {i}
          </div>
        ))}
      </div>
    );
  }
}

export default MenuRatesComponent;
