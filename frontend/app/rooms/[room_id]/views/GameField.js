'use client';

import React from 'react';

import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import NoMeetingRoomIcon from '@mui/icons-material/NoMeetingRoom';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PeopleIcon from '@mui/icons-material/People';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { styled } from '@mui/material/styles';

import { withRouter } from '@/utils';
import Card from './Card';
import Score from './Score';
import colors from './colors';

const StyledFieldGrid = styled(Grid)(({ theme }) => ({
  height: 'calc(100% - max(10vh, 36px))',
  width: '100%',
  margin: 0,
  padding: `0 ${theme.spacing(2)} ${theme.spacing(2)} 0`,
}));

const StyledRowGrid = styled(Grid)(({ theme }) => ({
  //marginLeft: 0,
  padding: -theme.spacing(2),
}));

const StyledScoreBoardGrid = styled(Grid)(({ theme }) => ({
  height: 'calc(max(10vh, 36px))',
  width: '100%',
}));

const StyledFab = styled(Fab)(({ theme }) => ({
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
}));

const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  color: '#fff',
}));


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
    const { field, game_id, params, is_captain, connected, sendEvent } = this.props;

    return (
      <React.Fragment>
        <StyledFieldGrid container
          direction='column'
          spacing={ 2 }
          wrap='nowrap'
        >
          {field.map((row, i) => (
            <StyledRowGrid item container
              key={ i }
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
            </StyledRowGrid>
          ))}
        </StyledFieldGrid>
        <StyledScoreBoardGrid container
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
        </StyledScoreBoardGrid>
        <StyledFab onClick={ event => this.openMenu(event.currentTarget) }>
          <MenuIcon fontSize='inherit'/>
        </StyledFab>
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
              this.props.router.push(`/rooms/${params.room_id}/views/players`)
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
              this.props.router.push(`/rooms/${params.room_id}/views/captains`)
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
          <MenuItem onClick={ () => this.props.router.push('/') }>
            <ListItemIcon>
              <NoMeetingRoomIcon/>
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
              Покинуть комнату
            </Typography>
          </MenuItem>
        </Menu>
        <StyledBackdrop open={ !connected }>
          <CircularProgress color="inherit" />
        </StyledBackdrop>
      </React.Fragment>
    )
  }
}

export default withRouter(GameField)
