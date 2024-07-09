import React, { Component } from 'react';
import HomeBanner from "../component/HomeBanner";
import EverythingUnder from "../component/EverythingUnder";
import CategorySlider from "../component/CategorySlider";
import DealProduct from "../component/DealProduct";
import TrendingProduct from "../component/TrendingProduct";
import bestdeal from "../images/Image-25.png"
import Newsletter from '../component/Newsletter';

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
          <Newsletter />

        </div>
        <div className='row mt-5'>
  <div className='best_deal_section'>
    <div className='container'>
      <div className='row'>
        <div className='col-md-6'>
          <div className='best-deal-left'>
            {/* Content for the left side */}
          </div>
        </div>
        <div className='col-md-6'>
          <div className='best-deal-right'>
            <img src={bestdeal} alt='Best Deal' className='img-fluid' />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
        </div>
    );
  }
}

export default Home;