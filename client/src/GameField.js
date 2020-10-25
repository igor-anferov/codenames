import React from 'react';

import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import NoMeetingRoomIcon from '@material-ui/icons/NoMeetingRoom';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import PeopleIcon from '@material-ui/icons/People';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

import Card from './Card';
import Score from './Score';
import colors from './colors';

const styles = theme => ({
  field: {
    height: 'calc(100% - max(10vh, 36px))',
    width: '100%',
    margin: 0,
    padding: `${theme.spacing(1)}px 0`,
  },
  row: {
    marginLeft: 0,
  },
  scoreBoard: {
    height: 'calc(max(10vh, 36px))',
    width: '100%',
  },
  fab: {
    fontSize: 'calc(max(6vh, 26px))',
    backgroundColor: colors.white.normal.back,
    color: colors.white.normal.text,
    height: 'calc(max(10vh, 36px))',
    width: 'calc(max(10vh, 36px))',
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    margin: '0 auto',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
})

class GameField extends React.Component {
  state = {
    menuAnchorEl: undefined,
  }

  constructor(props) {
    super(props);
    this.openMenu = this.openMenu.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
  }

  openMenu(anchor) {
    this.setState({ menuAnchorEl: anchor })
  }

  closeMenu() {
    this.setState({ menuAnchorEl: undefined })
  }

  countClosed(field, color) {
    let res = 0
    for (let i = 0; i < field.length; i++) {
      for (let j = 0; j < field[i].length; j++) {
        if (!field[i][j].is_open && field[i][j].color === color) {
          res++
        }
      }
    }
    return res
  }

  render() {
    const { classes, field, game_id, roomId, is_captain, connected, sendEvent, history } = this.props

    return (
      <React.Fragment>
        <Grid container
          className={ classes.field }
          direction='column'
          spacing={ 2 }
          wrap='nowrap'
        >
          {field.map((row, i) => (
            <Grid item container
              key={ i }
              className={ classes.row }
              spacing={ 2 }
              wrap='nowrap'
              xs
            >
              {row.map((cell, j) => (
                <Grid item
                  key={ j }
                  xs
                >
                  <Card {...cell} is_captain={ is_captain } onClick={() => {
                    if (!cell.is_open && !is_captain) {
                      sendEvent({
                        type: 'CARD_OPEN',
                        data: {
                          game_id: game_id,
                          row: i,
                          column: j,
                        },
                      })
                    }
                  }}/>
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
        <Grid container
          className={ classes.scoreBoard }
          alignItems='stretch'
          wrap='nowrap'
        >
          <Grid item xs>
            <Score color='blue'>
              { this.countClosed(field, 'blue') }
            </Score>
          </Grid>
          <Grid item xs>
            <Score color='red'>
              { this.countClosed(field, 'red') }
            </Score>
          </Grid>
        </Grid>
        <Fab className={ classes.fab } onClick={ event => this.openMenu(event.currentTarget) }>
          <MenuIcon fontSize='inherit'/>
        </Fab>
        <Menu
          keepMounted
          anchorEl={ this.state.menuAnchorEl }
          open={ Boolean(this.state.menuAnchorEl) }
          onClose={ this.closeMenu }
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <MenuItem onClick={ () =>
            sendEvent({
              type: 'GAME_RESET',
            })
          }>
            <ListItemIcon>
              <RotateLeftIcon/>
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
              Начать игру заново
            </Typography>
          </MenuItem>
          {is_captain ? (
            <MenuItem onClick={ () => {
              history.push('/rooms/' + roomId + '/views/players')
              this.closeMenu()
            }}>
              <ListItemIcon>
                <PeopleIcon/>
              </ListItemIcon>
              <Typography variant="inherit" noWrap>
                Перейти к полю для игроков
              </Typography>
            </MenuItem>
          ) : (
            <MenuItem onClick={ () => {
              history.push('/rooms/' + roomId + '/views/captains')
              this.closeMenu()
            }}>
              <ListItemIcon>
                <SupervisorAccountIcon/>
              </ListItemIcon>
              <Typography variant="inherit" noWrap>
                Перейти к полю для капитанов
              </Typography>
            </MenuItem>
          )}
          <MenuItem onClick={ () => history.push('/') }>
            <ListItemIcon>
              <NoMeetingRoomIcon/>
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
              Покинуть комнату
            </Typography>
          </MenuItem>
        </Menu>
        <Backdrop className={classes.backdrop} open={ !connected }>
          <CircularProgress color="inherit" />
        </Backdrop>
      </React.Fragment>
    )
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(GameField))
