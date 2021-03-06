import React from "react";
import { connect } from "react-redux";
import {addToCart} from '../store/cart';
import {updateBook} from '../store/books';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';


export class SingleBook extends React.Component{
  constructor (props) {
    super(props);
    this.state = {
      title: this.props.book.title,
      img: this.props.book.img,
      author: this.props.book.author,
      genre: this.props.book.genre,
      description: this.props.book.genre,
      price: this.props.book.price,
      id: this.props.book.id,
      admin: this.props.admin
    }
    this.addToGuestCart = this.addToGuestCart.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange (evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  handleSubmit (evt) {
    evt.preventDefault();
    this.props.updateBook({...this.state})
  }
  
  addToGuestCart(book){
    let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {};
    let title = book.title;
    cart[title] = (cart[title] ? cart[title]: 0);
    let qty = cart[title] + 1;
    cart[title] = qty
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  render(){
    const { title, img, author, genre, description, price, review } = this.state;
    const { admin } = this.props;
    const { handleChange, handleSubmit } = this;
    const userId = this.props.auth.id;
    const book = this.props.book;

    return(
      <div className='single-item-container'>
        {admin ? (
          <div>
            <form onSubmit={ handleSubmit } className='singleInfoBox'>
              <div className='imageBox'>
                <img src={ img } />
              </div>
              <div className='singleInfo'>
                <div className='bookStuff'>
                  <label htmlFor='title'><h1>Title:</h1></label>
                    <input name='title' onChange={ handleChange } value={ title } size={ title.length }/>
                </div>
                <div className='bookStuff'>
                  <label htmlFor='author'><h3>Author:</h3></label>
                    <input name='author' onChange={ handleChange } value={ author } size={ author.length }/>
                </div>
                <div className='bookStuff'>
                  <label htmlFor='genre'><h3>Genre:</h3></label>
                    <input name='genre' onChange={ handleChange } value={ genre } size={ genre.length }/>
                </div>
                <div className='bookStuff'>
                  <label htmlFor='description'><h3>Desctription:</h3></label>
                    <input name='description' onChange={ handleChange } value={ description } size={ description.length }/>
                </div>
                <div className='bookStuff'>
                  <label htmlFor='price'><h3>Price:</h3></label>
                    <input name='price' onChange={ handleChange } value={ price } size={ (price + '').length }/>
                </div>
                <div className='container'>
                  <div className='close-buttons'>
                    <Button type="submit">Save</Button>
                  </div>
                  <div className='close-buttons'>
                    <Button><Link to='/allbooks'>Return to Books</Link></Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className='singleBookBox'>
            <div className='singleInfoBox'>
              <div className='imageBox'>
                <img src={ img } />
              </div>
              <div>
                <h1>{ title }</h1>
                <div className='singleInfo'>
                  <div className='bookStuff'>
                    <h3>Author: </h3>
                    <p>{ author ? author.split('').splice(1,author.length).join('') : ''}</p>
                  </div>
                  <div className='bookStuff'>
                   <h3>Genre: </h3>
                   <p>{ genre }</p>
                  </div>
                  <div className='bookStuff'>
                    <h3>Description: </h3>
                    <p>{ description }</p>
                  </div>
                  <div className='bookStuff'>
                    <h3>Price:</h3> 
                    <p>${ price }</p>
                  </div>

                </div>
              </div>
            </div>
            <div>
              
              {
                userId ?
                  <Button 
                    onClick={()=>this.props.addToCart(userId, title, price)}
                    >Add to Cart
                  </Button>
                :
                  <Button 
                    onClick={()=>this.addToGuestCart(book)}
                    >Add to Guest Cart
                </Button>
              }
            </div>
          </div>
        )}
      </div>
    )
  }
}


const mapState = ({books,auth}, { match })=> {
  const book = books.books.find( book => book.coverId === match.params.id * 1 ) || {};
  return {
    book,
    auth,
    admin: auth.adminAuth
  };
};
  
  const mapDispatch = (dispatch) => {
    return {
      addToCart: (userId, book, price, qty) => dispatch(addToCart(userId, book, price, qty=1)),
      updateBook: (book) => dispatch(updateBook(book))
    };
  };
  
  export default connect(mapState, mapDispatch)(SingleBook);