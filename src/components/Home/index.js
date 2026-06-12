import {Component} from 'react'
import Loader from 'react-loader-spinner'
import CartContext from '../../context/CartContext'
import Header from '../Header'
import './index.css'

const constApiStatus = {
  initial: 'initial',
  success: 'success',
  loading: 'loading',
  failure: 'failure',
}

class Home extends Component {
  state = {
    tabsData: [],
    apiStatus: constApiStatus.initial,
    initialDishIndex: 0,
    totalCount: 0,
    initialDishName: '',
    categoryDish: [],
    mainData: '',
  }

  componentDidMount() {
    this.getDetails()
  }

  changeDish = id => {
    const {tabsData} = this.state
    const index = tabsData.findIndex(eachval => eachval.menu_category === id)

    this.setState({
      initialDishIndex: index,
      initialDishName: id,
      categoryDish: tabsData[index].category_dishes,
    })
  }

  increaseCart = value => {
    const {tabsData} = this.state
    this.setState(prevState => {
      const upData = tabsData.map(menu => ({
        ...menu,
        category_dishes: menu.category_dishes.map(dish =>
          dish.dish_id === value
            ? {...dish, quantity: dish.quantity + 1}
            : dish,
        ),
      }))

      return {
        tabsData: upData,
        categoryDish: upData[prevState.initialDishIndex].category_dishes,
        totalCount: prevState.totalCount + 1,
      }
    })
  }

  decreaseCart = value => {
    const {tabsData} = this.state
    this.setState(prevState => {
      const upData = tabsData.map(menu => ({
        ...menu,
        category_dishes: menu.category_dishes.map(dish => {
          if (dish.dish_id === value) {
            if (dish.quantity === 0) {
              return {
                ...dish,
                quantity: 0,
              }
            }
            return {
              ...dish,
              quantity: dish.quantity - 1,
            }
          }
          return {
            ...dish,
          }
        }),
      }))

      return {
        tabsData: upData,
        categoryDish: upData[prevState.initialDishIndex].category_dishes,
        totalCount: prevState.totalCount === 0 ? 0 : prevState.totalCount - 1,
      }
    })
  }

  getDetails = async () => {
    const {initialDishIndex} = this.state
    this.setState({apiStatus: constApiStatus.loading})
    const url =
      'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'
    const response = await fetch(url)
    const data = await response.json()

    const updatedData = [
      {
        ...data[0],
        table_menu_list: data[0].table_menu_list.map(menu => ({
          ...menu,
          category_dishes: menu.category_dishes.map(dish => ({
            ...dish,
            quantity: 0,
          })),
        })),
      },
    ]

    if (response.ok === true) {
      console.log(updatedData)
      this.setState({
        tabsData: updatedData[0].table_menu_list,
        apiStatus: constApiStatus.success,
        initialDishName: updatedData[0].table_menu_list[0].menu_category,
        categoryDish:
          updatedData[0].table_menu_list[initialDishIndex].category_dishes,
        mainData: updatedData[0].restaurant_name,
      })
    }
  }

  renderLoaderView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProductsView = () => {
    const {tabsData, categoryDish} = this.state
    const {totalCount, initialDishName, mainData} = this.state
    const categoryData = categoryDish

    return (
      <CartContext.Consumer>
        {value => {
          const {addCartItem} = value

          const addItemToCart = data => {
            addCartItem({...data, resName: mainData})
          }

          return (
            <>
              <>
                <Header count={totalCount} resName={mainData} />
                <ul className="tablsList">
                  {tabsData.length > 0 &&
                    tabsData.map(eachVal => (
                      <li className="tabValue" key={eachVal.menu_category_id}>
                        <button
                          type="button"
                          className={
                            eachVal.menu_category === initialDishName
                              ? 'buttonStyle'
                              : 'button'
                          }
                          onClick={() => this.changeDish(eachVal.menu_category)}
                        >
                          {eachVal.menu_category}
                        </button>
                      </li>
                    ))}
                </ul>
              </>
              <ul className="dishesList">
                {tabsData.length > 0 &&
                  categoryData.map(eachDish => (
                    <li className="dishList" key={eachDish.dish_id}>
                      <div className="dataContainer">
                        <h1>{eachDish.dish_name}</h1>
                        <div className="priceContainer">
                          <p>
                            {eachDish.dish_currency} {eachDish.dish_price}
                          </p>
                        </div>
                        <div className="descriptionContainer">
                          <p>{eachDish.dish_description}</p>
                          <p>{eachDish.dish_calories} Calories</p>
                        </div>
                        {!eachDish.dish_Availability ? (
                          <p>Not available</p>
                        ) : (
                          <div className="addCount">
                            <button
                              className="button"
                              type="button"
                              onClick={() =>
                                this.decreaseCart(eachDish.dish_id)
                              }
                            >
                              -
                            </button>
                            <p className="count">{eachDish.quantity}</p>
                            <button
                              className="button"
                              type="button"
                              onClick={() =>
                                this.increaseCart(eachDish.dish_id)
                              }
                            >
                              +
                            </button>
                          </div>
                        )}
                        {eachDish.addonCat.length > 1 ? (
                          <p>Customizations available</p>
                        ) : null}
                        {eachDish.quantity > 0 ? (
                          <button
                            className="addCartButtonStyle"
                            type="button"
                            onClick={() => addItemToCart(eachDish)}
                          >
                            ADD TO CART
                          </button>
                        ) : null}
                      </div>
                      <div className="imgContainer">
                        <img
                          src={eachDish.dish_image}
                          alt={eachDish.dish_name}
                          className="dishImage"
                        />
                      </div>
                    </li>
                  ))}
              </ul>
            </>
          )
        }}
      </CartContext.Consumer>
    )
  }

  renderAllViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case constApiStatus.loading:
        return this.renderLoaderView()
      case constApiStatus.success:
        return this.renderProductsView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderAllViews()}</>
  }
}

export default Home
