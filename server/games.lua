local uuid = require('uuid')

local dictionaries = require('codenames.dictionaries')

local games = {}

local space = box.schema.space.create('games', {
    format = {
        { 'game_id', 'string'   },
        { 'row',     'unsigned' },
        { 'column',  'unsigned' },
        { 'word',    'string'   },
        { 'color',   'string'   },
        { 'is_open', 'boolean'  },
    },
    if_not_exists = true,
})

space:create_index('primary', {
    parts = {
        { 'game_id', 'string'   },
        { 'row',     'unsigned' },
        { 'column',  'unsigned' },
    },
    if_not_exists = true,
})

function games.new(language, dict_name, rows, cols)
    if rows < 3 or cols < 3 then
        error('Game field is too small')
    end
    local words = dictionaries.get_words(language, dict_name, rows * cols)
    local colors = {}
    local blue = math.floor(rows * cols / 3 + 0.5)
    local red = blue + 1
    local black = 1
    local white = rows * cols - blue - red - black
    local function add(color, count)
        for i = 1, count do
            local index = 0
            repeat
                index = math.random(1, rows * cols)
            until not colors[index]
            colors[index] = color
        end
    end
    add('blue', blue)
    add('black', black)
    add('white', white)
    for i = 1, rows * cols do
        if not colors[i] then
            colors[i] = 'red'
        end
    end

    local game_id = uuid.str()
    for i = 0, rows - 1 do
        for j = 0, cols - 1 do
            space:insert{ game_id, i, j, words[i * cols + j + 1], colors[i * cols + j + 1], false }
        end
    end
    return game_id
end

function games.get_state(game_id)
    local state = {}
    for _, t in space:pairs{ game_id } do
        state[t.row + 1] = state[t.row + 1] or {}
        state[t.row + 1][t.column + 1] = {
            word = t.word,
            color = t.color,
            is_open = t.is_open,
        }
    end
    if #state > 0 then
        return state
    end
end

function games.open_card(game_id, row, column)
    local t = space:select{ game_id, row, column }
    if #t == 0 then
        error('No such card')
    end
    if t.is_open then
        return false
    end
    space:update({ game_id, row, column }, {{ '=', 6, true }})
    return true
end

function games.delete(game_id)
    for _, t in space:pairs{ game_id } do
        space:delete{ game_id, t.row, t.column }
    end
end

return games
