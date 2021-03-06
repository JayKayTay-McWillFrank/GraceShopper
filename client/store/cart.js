import axios from 'axios'

//constants

const GET_CART = 'GET_CART'
const ADD_BOOK_TO_CART = 'ADD_BOOK_TO_CART'
const REMOVE_BOOK_FROM_CART = 'REMOVE_BOOK_FROM_CART'
const UPDATE_CART = 'UPDATE_CART'
const ORDER_CART = 'ORDER_CART'

//action creators

export const _getCart = (cart) => {
    return {
      type: GET_CART,
      cart
    }
  };

  export const _addToCart = (books) => {
    return {
      type: ADD_BOOK_TO_CART,
      books
    }
  };

  export const _removeFromCart = (book) => {
    return {
      type: REMOVE_BOOK_FROM_CART,
      book
    }
  };

  export const _updateCart = (cart) => {
    return {
      type: UPDATE_CART,
      cart
    }
  };

  export const _orderCart = (cart) =>{
    return {
      type:ORDER_CART,
      cart
    }
  }




//thunks

export const getCart = (userId) => {
    return async (dispatch)=>{
      const cart = (await axios.get(`/api/cart/${userId}/cart`)).data
      dispatch(_getCart(cart))
    }
};

  export const removeFromCart = (userId,book, history) => {
    return async (dispatch)=>{
      const bookId=book.id;
      await axios.delete(`/api/cart/${userId}/cart`,{data: {bookId}})
      dispatch(_removeFromCart(book))
      // history.push('/mycart');
    }
  };

  export const addToCart = (userId, bookToCart, price, qty=1) => {
    return async (dispatch)=>{
      const books = (await axios.post(`/api/cart/${userId}/cart`, {book: bookToCart , price: price, quantity: qty})).data
      dispatch(_addToCart(books))
    }
};

export const updateCart = (userId, book, qty, history) => {
  return async (dispatch)=>{
    const cart = (await axios.put(`/api/cart/${userId}/cart`,{book: book.book , quantity: qty})).data
    dispatch(_updateCart(cart))
    //history.push('/allbooks#mycart');
  }
};

export const orderCart = (userId)=>{
  return async (dispatch)=>{
    const cart = (await axios.get(`/api/cart/${userId}/order`)).data
    dispatch(_orderCart(cart))
  }
}



//reducer

export default function cartReducer(state=[], action) {
    if(action.type === GET_CART){
      return action.cart
    }
    if(action.type === REMOVE_BOOK_FROM_CART){
      state = state.filter(book => book.id !== action.book.id)
      return state
    }
    if(action.type === ADD_BOOK_TO_CART){
      return action.books
    }
    if(action.type === UPDATE_CART){
      return action.cart
    }
    if(action.type === ORDER_CART){
      return action.cart
    }
  
    return state;
  }