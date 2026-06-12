import {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import CartContext from './context/CartContext'
import Home from './components/Home'
import Cart from './components/Cart'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

class App extends Component {
  state = {cartList: []}

  removeCartItem = id => {
    this.setState(prev => {
      const itemCheck = prev.cartList.find(eachId => eachId.dish_id === id)
      if (itemCheck !== undefined) {
        const filterList = prev.cartList.filter(
          eachProd => eachProd.dish_id !== id,
        )
        return {cartList: filterList}
      }
      return prev.cartList
    })
  }

  incrementCartItemQuantity = id => {
    this.setState(prev => {
      const updatedList = prev.cartList.map(eachProd => {
        if (eachProd.dish_id === id) {
          return {...eachProd, quantity: eachProd.quantity + 1}
        }
        return eachProd
      })

      return {cartList: updatedList}
    })
  }

  decrementCartItemQuantity = id => {
    this.setState(prev => {
      const upList = prev.cartList.map(eachProd => {
        if (eachProd.dish_id === id) {
          if (eachProd.quantity > 1) {
            return {...eachProd, quantity: eachProd.quantity - 1}
          }
          return {}
        }
        return eachProd
      })

      const updatedList = upList.filter(eachId => eachId.dish_id !== undefined)

      return {cartList: updatedList}
    })
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  addCartItem = product => {
    const {cartList} = this.state

    const productObject = cartList.find(
      eachCartItem => eachCartItem.dish_id === product.dish_id,
    )

    if (productObject) {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(eachCartItem => {
          if (productObject.dish_id === eachCartItem.dish_id) {
            const updatedQuantity = eachCartItem.quantity + product.quantity

            return {...eachCartItem, quantity: updatedQuantity}
          }

          return eachCartItem
        }),
      }))
    } else {
      const updatedCartList = [...cartList, product]

      this.setState({cartList: updatedCartList})
    }
  }

  render() {
    const {cartList} = this.state
    console.log(cartList)
    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
          removeAllCartItems: this.removeAllCartItems,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <ProtectedRoute exact path="/" component={Home} />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
