local fiber = require('fiber')
local indexpiration = require('indexpiration')

local games = require('codenames.games')

local rooms = {}

local space = box.schema.space.create('rooms', {
    format = {
        { 'room_id',  'string'   },
        { 'game_id',  'string'   },
        { 'activity', 'unsigned' },
    },
    if_not_exists = true,
})

space:create_index('primary', {
    parts = {
        { 'room_id',  'string'   },
    },
    if_not_exists = true,
})

space:create_index('expiration', {
    parts = {
        { 'activity', 'unsigned' },
    },
    if_not_exists = true,
    unique = false,
})

local ttl = 30 * 24 * 60 * 60 * 1000000

indexpiration.upgrade(space, {
    field = 'activity',
    kind = function(t) return t.activity + ttl - fiber.time64() end,
    debug = true,
    on_delete = function(tuple) games.delete(tuple.game_id) end,
})

function rooms.get_active_game(room_id)
    local t = space:select{ room_id }
    if #t > 0 then
        return t[1].game_id
    end
    local game_id = games.new('ru', 'GaGa Games', 5, 6)
    space:put{ room_id, game_id, fiber.time64() + ttl }
    return game_id
end

function rooms.mark_active(room_id, game_id)
    local t = space:select{ room_id }
    if #t == 0 then
        error('No such room')
    end
    if t[1].game_id ~= game_id then
        error('No such game')
    end
    space:put{ room_id, game_id, fiber.time64() + ttl }
end

function rooms.reset_game(room_id)
    local t = space:select{ room_id }
    if #t ~= 0 then
        games.delete(t[1].game_id)
        space:delete{ room_id }
    end
    return rooms.get_active_game(room_id)
end

function rooms.exists(room_id, game_id)
    local t = space:select{ room_id }
    if #t == 0 then
        return false
    end
    if t[1].game_id ~= game_id then
        return false
    end
    return true
end

return rooms
