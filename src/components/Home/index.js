import {Component} from 'react'
import Loader from 'react-loader-spinner'
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
  }

  componentDidMount() {
    this.getDetails()
  }

  changeDish = id => {
    const {tabsData} = this.state
    const index = tabsData[0].table_menu_list.findIndex(
      eachval => eachval.menu_category === id,
    )

    this.setState({
      initialDishIndex: index,
      initialDishName: id,
      categoryDish: tabsData[0].table_menu_list[index].category_dishes,
    })
  }

  increaseCart = value => {
    this.setState(prevState => {
      const updatedTabsData = [...prevState.tabsData]

      updatedTabsData[0].table_menu_list = updatedTabsData[0].table_menu_list.map(
        menu => ({
          ...menu,
          category_dishes: menu.category_dishes.map(dish =>
            dish.dish_id === value
              ? {...dish, quantity: dish.quantity + 1}
              : dish,
          ),
        }),
      )

      return {
        tabsData: updatedTabsData,
        categoryDish:
          updatedTabsData[0].table_menu_list[prevState.initialDishIndex]
            .category_dishes,
        totalCount: prevState.totalCount + 1,
      }
    })
  }

  decreaseCart = value => {
    this.setState(prevState => {
      const updatedTabsData = [...prevState.tabsData]

      updatedTabsData[0].table_menu_list = updatedTabsData[0].table_menu_list.map(
        menu => ({
          ...menu,
          category_dishes: menu.category_dishes.map(dish =>
            dish.dish_id === value
              ? {...dish, quantity: dish.quantity - 1}
              : dish,
          ),
        }),
      )

      return {
        tabsData: updatedTabsData,
        categoryDish:
          updatedTabsData[0].table_menu_list[prevState.initialDishIndex]
            .category_dishes,
        totalCount: prevState.totalCount - 1,
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
      this.setState({
        tabsData: updatedData,
        apiStatus: constApiStatus.success,
        initialDishName: updatedData[0].table_menu_list[0].menu_category,
        categoryDish:
          updatedData[0].table_menu_list[initialDishIndex].category_dishes,
      })
    }
  }

  render() {
    const {tabsData, apiStatus, categoryDish} = this.state
    const {totalCount, initialDishName} = this.state
    const categoryData = categoryDish
    console.log(categoryData)
    return (
      <>
        <Header count={totalCount} />
        {constApiStatus.loading === apiStatus ? (
          <div className="products-loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
          </div>
        ) : (
          <ul className="tablsList">
            {tabsData.length > 0 &&
              tabsData[0].table_menu_list.map(eachVal => (
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
        )}
        <ul className="dishesList">
          {tabsData.length > 0 &&
            categoryData.map(eachDish => (
              <li className="dishList" key={eachDish.dish_id}>
                <div className="dataContainer">
                  <h1>{eachDish.dish_name}</h1>
                  <div className="priceContainer">
                    <p>{eachDish.dish_currency}</p>
                    <p>{eachDish.dish_price}</p>
                  </div>
                  <div className="descriptionContainer">
                    <p>{eachDish.dish_description}</p>
                    <p>{eachDish.dish_calories}</p>
                  </div>
                  {!eachDish.dish_Availability ? (
                    <p>Not available</p>
                  ) : (
                    <div className="addCount">
                      <button
                        className="button"
                        type="button"
                        onClick={() => this.decreaseCart(eachDish.dish_id)}
                      >
                        -
                      </button>
                      <p className="count">{eachDish.quantity}</p>
                      <button
                        className="button"
                        type="button"
                        onClick={() => this.increaseCart(eachDish.dish_id)}
                      >
                        +
                      </button>
                    </div>
                  )}
                  {eachDish.addonCat.length > 1 ? (
                    <p>Customizations available</p>
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
  }
}

export default Home
