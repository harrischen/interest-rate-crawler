import React from "react";

interface IMenuRatesProps {
  rates: {
    [key: string]: string;
  };
}

class MenuRatesComponent extends React.Component<IMenuRatesProps> {
  render() {
    return (
      <>
        <div className="w-44 px-2">Tips</div>
        {Object.keys(this.props.rates).map((i) => (
          <div key={i} className="px-2 flex-1">
            {i}
          </div>
        ))}
      </>
    );
  }
}

export default MenuRatesComponent;
