import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import CartContext from '../../context/CartContext'
import Header from '../Header'
import './index.css'

const Cart = () => (
  <CartContext.Consumer>
    {value => {
      const {
        removeCartItem,
        incrementCartItemQuantity,
        decrementCartItemQuantity,
        removeAllCartItems,
      } = value
      const {cartList} = value

      const emptyList = () => {
        removeAllCartItems()
      }

      const onRemoveCartItem = id => {
        removeCartItem(id)
      }

      const incrementQuantity = id => {
        incrementCartItemQuantity(id)
      }

      const decrementQuantity = id => {
        decrementCartItemQuantity(id)
      }

      /*  let sum = 0

      cartList.forEach(eachItem => {
        sum += eachItem.quantity
      })  */

      return (
        <div>
          <Header
            resName={
              cartList.length > 0 ? cartList[0].resName : 'UNI Resto Cafe'
            }
            count={cartList.length}
          />
          {cartList.length > 0 ? (
            <>
              <div className="cart-content-container">
                <h1 className="cart-heading">My Cart</h1>
                <button
                  type="button"
                  className="removeButton"
                  onClick={emptyList}
                >
                  Remove All
                </button>
              </div>
              <ul>
                {cartList.map(eachCartItem => (
                  <li className="cart-item" key={eachCartItem.dish_id}>
                    <img
                      className="cart-product-image"
                      src={eachCartItem.dish_image}
                      alt="dishImage"
                    />
                    <div className="cart-item-details-container">
                      <div className="cart-product-title-brand-container">
                        <p className="cart-product-title">
                          {eachCartItem.dish_name}
                        </p>
                      </div>
                      <div className="cart-quantity-container">
                        <button
                          type="button"
                          className="quantity-controller-button"
                          onClick={() =>
                            decrementQuantity(eachCartItem.dish_id)
                          }
                          data-testid="minus"
                        >
                          <BsDashSquare color="#52606D" size={12} />
                        </button>
                        <p className="cart-quantity">{eachCartItem.quantity}</p>
                        <button
                          type="button"
                          className="quantity-controller-button"
                          onClick={() =>
                            incrementQuantity(eachCartItem.dish_id)
                          }
                          data-testid="plus"
                        >
                          <BsPlusSquare color="#52606D" size={12} />
                        </button>
                      </div>
                      <div className="total-price-remove-container">
                        <p className="cart-total-price">
                          SAR {eachCartItem.dish_price * eachCartItem.quantity}
                          /-
                        </p>
                        <button
                          className="remove-button"
                          type="button"
                          onClick={() => onRemoveCartItem(eachCartItem.dish_id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="cart-empty-view-container">
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-empty-cart-img.png"
                className="cart-empty-img"
                alt="cart empty"
              />
              <h1 className="cart-empty-heading">Your Cart Is Empty</h1>

              <Link to="/">
                <button type="button" className="shop-now-btn">
                  Shop Now
                </button>
              </Link>
            </div>
          )}
        </div>
      )
    }}
  </CartContext.Consumer>
)
export default Cart
