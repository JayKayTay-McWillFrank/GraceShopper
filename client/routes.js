import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
import {Login, Signup, Home, AllBooks, SingleBook, Users, AddBook, CheckoutForm, SingleUser, OrderHistory, EditUser} from './components'
import {me} from './store'
import Cart from './components/Cart'

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn, admin} = this.props

    return (
      <div id="route-container">
        <hr />
        {isLoggedIn ? (
          <Switch>
            <Route path="/home" component={Home} />
            <Route exact path='/allbooks' component={AllBooks} />
            <Route exact path='/allbooks/:id' component={SingleBook} />
            <Route path='/allbooks/page/:idx?' component={AllBooks} />
            <Route path='/add-book' component={AddBook} />
            <Route exact path='/users' component={Users} />
            <Route exact path='/users/:id' component={SingleUser} />
            <Route path = '/users/edit/:id' component={EditUser} />
            <Route path="/orders" component={OrderHistory}/>
            <Route path='/checkout' component={CheckoutForm} />
            <Redirect to="/allbooks" />
          </Switch>
        ) : (
          <Switch>
            <Route exact path='/allbooks' component={AllBooks} />
            <Route exact path='/allbooks/:id' component={SingleBook} />
            <Route path='/allbooks/page/:idx?' component={AllBooks} />
            <Route path='/mycart' component={Cart} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path='/checkout' component={CheckoutForm} />
            <Redirect to="/allBooks" />
          </Switch>
        )}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined as having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id,
    admin: state.auth.adminAuth
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))
