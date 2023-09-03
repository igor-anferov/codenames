local dictionaries = {}

local space = box.schema.space.create('dictionaries', {
    format = {
        { 'language', 'string' },
        { 'name',     'string' },
        { 'word',     'string' },
    },
    if_not_exists = true,
})

space:create_index('primary', {
    parts = {
        { 'language', 'string' },
        { 'name',     'string' },
        { 'word',     'string' },
    },
    if_not_exists = true,
})

function dictionaries.get_words(language, name, cnt)
    local variants = space:select{ language, name }
    if #variants < cnt then
        error('Can not peek '..cnt..' words from '..#variants..' words dictionary')
    end
    local used = {}
    local res = {}
    for i = 1, cnt do
        local index = 0
        repeat
            index = math.random(1, #variants)
        until not used[index]
        used[index] = true
        res[#res + 1] = variants[index].word
    end
    return res
end

box.once('Filling GaGa Games dictionary', box.atomic, function()
    for _, word in pairs(string.split(require('codenames.dictionaries.ru-GaGaGames'), ', ')) do
        space:put{ 'ru', 'GaGa Games', word }
    end
end)

return dictionaries
