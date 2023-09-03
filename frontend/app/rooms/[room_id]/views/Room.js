'use client';

import React from 'react';

const { setIn } = require('immutable')

import GameField from './GameField'
import { withRouter } from '@/utils';


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
      this.props.router.push('/rooms/' + this.props.params.room_id)
    }

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(event))
    }
  }

  wsconnect() {
    this.socket = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/rooms/${this.props.params.room_id}/ws`)

    this.socket.addEventListener('message', msg => {
      const event = JSON.parse(msg.data)
      switch (event.type) {
      case 'GAME_STATE':
        if (this.state.game_id && event.data.game_id !== this.state.game_id) {
          this.props.router.push('/rooms/' + this.props.params.room_id)
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
    const { field, game_id, connected } = this.state
    return (
      <GameField
        game_id={ game_id }
        field={ field }
        connected={ connected }
        sendEvent={ this.sendEvent }
        { ...this.props }
      />
    )
  }
}

export default withRouter(Room);
