local log = require('log')

local subscribers = {}

local subs = {}

function subscribers.add(room_id, writer)
    subs[room_id] = subs[room_id] or {}
    table.insert(subs[room_id], writer)
    log.info('Adding new subscriber '..tostring(writer)..' to room '..room_id)
end

function subscribers.delete(room_id, writer)
    if not subs[room_id] then
        return
    end
    local n = 0
    for i = #subs[room_id], 1, -1 do
        if subs[room_id][i] == writer then
            log.info('Removing subscriber '..tostring(subs[room_id][i])..' from room '..room_id)
            table.remove(subs[room_id], i)
        else
            n = n + 1
        end
    end
    if n == 0 then
        subs[room_id] = nil
        log.info('Clearing room '..room_id)
    end
end

function subscribers.notify(room_id, msg, exclude)
    if not subs[room_id] then
        return
    end
    for _, w in pairs(subs[room_id]) do
        if w ~= exclude then
            w:write(msg)
        end
    end
end

return subscribers
