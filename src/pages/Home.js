import React, { Component } from 'react';
import HomeBanner from "../component/HomeBanner";
import EverythingUnder from "../component/EverythingUnder";
import CategorySlider from "../component/CategorySlider";
import DealProduct from "../component/DealProduct";
import TrendingProduct from "../component/TrendingProduct";

class Home extends Component {
  render() {
    return (
      <div className="wrapper">
      <HomeBanner/>
      <div className="container-fluid">
          <EverythingUnder/>
          <CategorySlider/>
          <DealProduct/>
          <TrendingProduct/>
        </div>
        </div>
    );
  }
}

export default Home;