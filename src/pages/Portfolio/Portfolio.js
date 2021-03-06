// TODO Make this the 'simple portfolio', no transactions just edit values
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getExchangeRates } from '../../actions/priceActions'
import { prettyCrypto } from '../../utils'

import SingleHolding from './SingleHolding'

import Fiat from '../../components/Helpers/Fiat'
import Section from '../../components/Bulma/Section'
import Loading from '../../components/Helpers/Loading'

import './Portfolio.scss'

const mapStateToProps = ({ portfolio, preferences, price, transactions, marketData, file }) => {
  return {
    portfolio,
    preferences,
    price,
    transactionView: transactions.transactionView,
    loading: marketData.isFetchingCoinList || file.isFetching,
    coinList: marketData.coinList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getInitialData: () => {
      dispatch(getExchangeRates())
    }
  }
}

class Portfolio extends Component {
  componentDidMount () {
    this.props.getInitialData()
  }

  render () {
    const { portfolio, loading, coinList } = this.props
    const dayChangeClass = Math.sign(portfolio.dayChange) >= 0 ? 'has-text-success' : 'has-text-danger'

    return (
      <div className='Portfolio'>
        <div className='submenu' />
        <div className='content'>
          <Section title='Portfolio'>
            <nav className='level is-mobile'>
              <div className='level-item has-text-centered'>
                <div>
                  <p className='heading'>Total Value</p>
                  <p className='is-size-4'><Fiat value={portfolio.totalValue} /></p>
                </div>
              </div>
              <div className='level-item has-text-centered'>
                <div>
                  <p className='heading'>Total Value (BTC)</p>
                  <p className='is-size-4'>{prettyCrypto(portfolio.totalValueBtc)} BTC</p>
                </div>
              </div>
              <div className='level-item has-text-centered'>
                <div>
                  <p className='heading'>24h Change</p>
                  <p className={`is-size-4 ${dayChangeClass}`}><Fiat value={portfolio.dayChange} /></p>
                </div>
              </div>
              <div className='level-item has-text-centered'>
                <div>
                  <p className='heading'>24h Change (BTC)</p>
                  <p className={`is-size-4 ${dayChangeClass}`}>{prettyCrypto(portfolio.dayChangeBtc)} BTC</p>
                </div>
              </div>
            </nav>
            <div className='SingleHoldingLayout'>
              {
            !loading
            ? Object.keys(portfolio.portfolioOverview).map((token) => {
              const tokenInfo = coinList[token]
              if (tokenInfo) {
                return (
                  <div className='SingleHoldingContainer'>
                    <SingleHolding
                      key={token}
                      abbreviation={token} />
                  </div>
                )
              }
              return null
            }
          ) : <Loading />
        }
            </div>
          </Section>
        </div>
      </div>
    )
  }
}

const PortfolioContainer = connect(mapStateToProps, mapDispatchToProps)(Portfolio)

export default PortfolioContainer
