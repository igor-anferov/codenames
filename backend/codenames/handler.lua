local log = require('log')
local json = require('json')
local frame = require('websocket.frame')

local rooms = require('codenames.rooms')
local games = require('codenames.games')
local writer = require('codenames.writer')
local events = require('codenames.events')
local subscribers = require('codenames.subscribers')

return function(room_id, peer)
    log.warn('Starting...')
    local w = writer(peer)
    local game_id = rooms.get_active_game(room_id)

    w:write(events.game_state(game_id))

    subscribers.add(room_id, w)
    local ok, err = pcall(function()
        while w:is_alive() do
            local msg, err = peer:read()
            if err ~= nil then
                log.warn('Failed to get message from peer: '..err)
                w:kill(4000, 'Protocol error')
                return
            end
            if msg.opcode == nil then
                log.info('Finalizing')
                w:kill(1000, 'OK')
                return
            end
            if msg.opcode ~= frame.TEXT then
                log.warn('Binary message received')
                w:kill(4000, 'Protocol error')
                return
            end
            if not msg.fin then
                log.warn('Message without fin flag received: '..msg.data)
                w:kill(4000, 'Protocol error')
                return
            end
            local ok, event = pcall(json.decode, msg.data)
            if not ok then
                log.warn('Failed to decode json message: '..msg.data)
                w:kill(4000, 'Protocol error')
                return
            end
            if event.type == 'GAME_RESET' then
                box.atomic(function()
                    local game_id = rooms.reset_game(room_id)
                    subscribers.notify(room_id, events.game_state(game_id))
                end)
            elseif event.type == 'CARD_OPEN' then
                box.atomic(function()
                    if rooms.exists(room_id, event.data.game_id) then
                        local opened = games.open_card(
                            event.data.game_id,
                            event.data.row,
                            event.data.column
                        )
                        if opened then
                            rooms.mark_active(room_id, event.data.game_id)
                            subscribers.notify(room_id, events.card_open(
                                event.data.game_id,
                                event.data.row,
                                event.data.column
                            ), w)
                        end
                    end
                end)
            else
                log.warn('Unknown event: '..msg.data)
                w:kill(4000, 'Protocol error')
                return
            end
        end
    end)
    subscribers.delete(room_id, w)
    if not ok then
        w:kill(4000, 'Error')
        log.warn('Handler finished with error: '..err)
    else
        log.info('Handler finished successfully')
    end
end
