local games = require('codenames.games')

local events = {}

function events.game_state(game_id)
    local field = games.get_state(game_id)
    if field == nil then
        error('No such game')
    end
    return {
        type = 'GAME_STATE',
        data = {
            game_id = game_id,
            field = field,
        },
    }
end

function events.card_open(game_id, row, column)
    return {
        type = 'CARD_OPEN',
        data = {
            game_id = game_id,
            row = row,
            column = column,
        },
    }
end

return events
