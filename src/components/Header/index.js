import {Link, withRouter} from 'react-router-dom'
import {FaShoppingCart} from 'react-icons/fa'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const {count, resName} = props

  const logoutFunction = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="navbar">
      <div>
        <Link to="/" className="linkClass">
          <h1>{resName}</h1>
        </Link>
      </div>
      <ul className="unorderList">
        <li className="listItem">My Orders</li>
        <li className="listItem">
          <Link to="/cart">
            <FaShoppingCart />
          </Link>
          <span>{count}</span>
        </li>
        <li>
          <button data-testid="cart" type="button" onClick={logoutFunction}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}
export default withRouter(Header)
