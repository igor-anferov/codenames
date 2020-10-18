local fiber = require('fiber')
local log = require('log')
local json = require('json')

return function(peer)
    local writer = {}

    local chan = fiber.channel(8)
    local shutdown = nil

    local f = fiber.new(function()
        log.warn('Starting..')
        repeat
            local msg = chan:get()
            if msg then
                local written = peer:write(json.encode(msg))
                if written == nil then
                    log.warn('failed to write msg to peer websocket: '..peer:error())
                    return
                end
            elseif not shutdown then
                error('Writer channel is closed without calling kill')
            end
        until shutdown
        if not peer.close_received then
            local ok, err = peer:shutdown(shutdown.code, shutdown.reason, 3)
            if err then
                log.warn('failed to shutdown gracefully: '..err)
            end
        end
        log.warn('Shutting down...')
    end)

    f:name(peer.peer:peer().host..':'..peer.peer:peer().port..'/writer', { truncate = true })

    function writer:is_alive()
        return f:status() ~= 'dead'
    end

    function writer:kill(status, reason)
        shutdown = {
            status = status,
            reason = reason,
        }
        chan:close()
    end

    function writer:write(msg)
        if chan:is_full() then
            chan:close()
            return false
        end
        chan:put(msg)
        return true
    end

    return writer
end
