import {FaShoppingCart} from 'react-icons/fa'
import './index.css'

const Header = props => {
  const {count, resName} = props
  return (
    <nav className="navbar">
      <div>
        <h1>{resName}</h1>
      </div>
      <ul className="unorderList">
        <li className="listItem">My Orders</li>
        <li className="listItem">
          <FaShoppingCart />
          <span>{count}</span>
        </li>
      </ul>
    </nav>
  )
}
export default Header
