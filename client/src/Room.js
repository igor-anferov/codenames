import React from 'react';
import { withRouter, Switch, Route, Redirect } from "react-router-dom";

import RoomMainPage from './RoomMainPage'
import GameField from './GameField'

const { setIn } = require('immutable')

class Room extends React.Component {
  state = {
    field: [],
    game_id: '',
    connected: false,
    reconnectTimeout: 500,
  }

  constructor(props) {
    super(props)

    this.wsconnect = this.wsconnect.bind(this)
    this.reconnect = this.reconnect.bind(this)
    this.sendEvent = this.sendEvent.bind(this)
  }

  componentDidMount() {
    this.wsconnect()
  }

  componentWillUnmount() {
    this.socket.removeEventListener('close', this.reconnect)
    this.socket.close()
  }

  reconnect() {
    setTimeout(this.wsconnect, this.state.reconnectTimeout)
    this.setState({
      connected: false,
      reconnectTimeout: 2 * this.state.reconnectTimeout,
    })
  }

  sendEvent(event) {
    if (event.type === 'CARD_OPEN') {
      this.setState({
        field: setIn(this.state.field, [event.data.row, event.data.column, 'is_open'], true)
      })
    } else if (event.type === 'GAME_RESET') {
      this.setState({
        field: [],
        game_id: '',
        connected: false,
      })
      this.props.history.push('/rooms/' + this.props.roomId)
    }

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(event))
    }
  }

  wsconnect() {
    this.socket = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/rooms/${this.props.roomId}/ws`)

    this.socket.addEventListener('message', msg => {
      const event = JSON.parse(msg.data)
      switch (event.type) {
      case 'GAME_STATE':
        if (this.state.game_id && event.data.game_id !== this.state.game_id) {
          this.props.history.push('/rooms/' + this.props.roomId)
        }
        this.setState({
          ...event.data,
          connected: true,
        })
        return
      case 'CARD_OPEN':
        return this.setState({
          field: setIn(this.state.field, [event.data.row, event.data.column, 'is_open'], true)
        })
      default:
        console.warn('Unsupported event: ', event)
      }
    })

    this.socket.addEventListener('close', this.reconnect)
  }

  render() {
    const { roomId, match } = this.props
    const { field, game_id, connected } = this.state
    return (
      <Switch>
        <Route exact strict path={`${match.url}/views/players`}>
          <GameField
            roomId={ roomId }
            game_id={ game_id }
            field={ field }
            connected={ connected }
            sendEvent={ this.sendEvent }
          />
        </Route>
        <Route exact strict path={`${match.url}/views/captains`}>
          <GameField
            roomId={ roomId }
            game_id={ game_id }
            field={ field }
            connected={ connected }
            sendEvent={ this.sendEvent }
            is_captain
          />
        </Route>
        <Route exact path={ match.url }>
          <RoomMainPage/>
        </Route>
        <Redirect to={ match.url } />
      </Switch>
    )
  }
}

export default withRouter(Room);
