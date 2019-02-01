import React, {Component} from 'react'
import {withAuthorization} from '../login-signup/withAuthorization.js'
import {AuthUserContext} from '../login-signup/SessionContext.js'

class AdminPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      users: []
    }
  }

  componentDidMount() {
    this.setState({loading: true})

    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val()

      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key
      }))

      this.setState({
        users: usersList,
        loading: false
      })
    })
  }

  componentWillUnmount() {
    this.props.firebase.users().off()
  }

  render() {
    const {users, loading} = this.state

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <h1>Admin</h1>
            {loading && <div>Loading ...</div>}
            <UserList users={users} />
          </div>
        )}
      </AuthUserContext.Consumer>
    )
  }
}

const UserList = ({users}) => (
  <ul>
    {console.log(users)}
    {users.map(user => (
      <li key={user.uid}>
        <span>
          <strong>ID:</strong> {user.uid}
        </span>
        <span>
          <strong>E-Mail:</strong> {user.email}
        </span>
        <span>
          <strong>Username:</strong> {user.username}
        </span>
      </li>
    ))}
  </ul>
)

const condition = authUser => !!authUser

export const AdminIndex = withAuthorization(condition)(AdminPage)
