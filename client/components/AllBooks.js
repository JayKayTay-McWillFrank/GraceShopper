import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchBooks, destroyBook, pagingBooks } from "../store/books";
import { addToCart } from "../store/cart";
import Button from '@material-ui/core/Button';
import {auth} from "../store/auth";
import Alert from 'react-bootstrap/Alert'

export class AllBooks extends React.Component {
  constructor(props){
    super(props);
    this.addToGuestCart = this.addToGuestCart.bind(this);
  }

  componentDidMount() {
    const userId = this.props.auth.id;
    this.props.pagingBooks(0);
    const localcart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {};
    if(localcart){
      for(let key in localcart){
        this.props.addToCart(userId, key, localcart[key])
      }
    }
    localStorage.clear();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.match.params.idx !== this.props.match.params.idx){
      const idx = this.props.match.params.idx || 0;
      this.props.pagingBooks(idx);
    }
  }

  addToGuestCart(book){
    let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {};
    let title = book.title;
    cart[title] = (cart[title] ? cart[title]: 0);
    let qty = cart[title] + 1;
    cart[title] = qty
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  
  render() {
    const { books, view, addToCart, destroyBook, count} = this.props;
    const userId = this.props.auth.id;
    const admin = this.props.auth.adminAuth;
    const pageCount = Math.ceil(count / 10);
    const links = pageCount ? new Array(pageCount).fill('-').map((_, idx) => 
      {
        return {
          text: idx + 1,
          idx
        }
      }
    ) : (
      ''
    );

    return (
      <div>
        <div className="container">
          {books &&
            books.map((book) => {
              return (
                <div className="book-card" key={book.id}>
                  <Link to={`/allbooks/${book.coverId}`}>
                    <img className="cover-art" src={book.img} />
                  </Link>
                  <Link to={`/allbooks/${book.coverId}`}>
                    <h3 className="book-title-div">{book.title}</h3>
                  </Link>
                  <p>${book.price}</p>
                  {
                    admin ? (
                      <div>
                        <Link to={`/allbooks/${book.coverId}`}><button>Edit Item</button></Link>
                        <button onClick={ ()=> {destroyBook(book)}}>Delete Item From Database</button>
                      </div>
                    ) : (
                      <div>
                        {
                          userId ? (
                            <div>
                            {/* <Alert variant="success" dismissable="true" fade="true">
                              <strong>Holy guacamole!</strong>
                            </Alert> */}
                            <Button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => this.props.addToCart(userId, book.title, book.price)}>
                              Add to Cart
                            </Button>
                            </div>
                          ) : (
                            <Button onClick={()=>this.addToGuestCart(book)}>Add to Guest Cart</Button>
                          )
                        }
                      </div>
                    )
                  }
                </div>
              );
            })
          }
        </div>
        <div className='container'>
          {links &&
            links.map( ({ idx, text }) => {
              return (
                <Button key={ idx }>
                  <Link to={`/allbooks/page/${ idx }`}>{ text }</Link>
                </Button>
              )
            })
          }
        </div>
      </div>
    );
  }
}

const mapState = ({ books, auth }) => {
  return { 
    books: books.books,
    view: books.view,
    count: books.count,
    auth
  };
};

const mapDispatch = (dispatch) => {
  return {
    getBooks: () => dispatch(fetchBooks()),
    addToCart: (userId, book, price, qty) => dispatch(addToCart(userId, book, price, qty=1)),
    destroyBook: (book) => dispatch(destroyBook(book)),
    pagingBooks: (idx) => dispatch(pagingBooks(idx))
  };
};

export default connect(mapState, mapDispatch)(AllBooks);
