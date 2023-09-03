local log = require('log')
local fiber = require('fiber')
local http_server = require('http.server')
local http_router = require('http.router')
local ws_handshake = require('websocket.handshake')
local ws = require('websocket')

local handler = require('codenames.handler')

return function(host, port)
    local server = http_server.new(host, port, {
        display_errors = false,
    })
    local router = http_router.new()
    server:set_router(router)
    router:route({
        method = 'GET',
        path = '/rooms/:room_id/ws',
    }, function(req)
        fiber.self():name(req:peer().host..':'..req:peer().port..'/handler', { truncate = true })
        local room_id = req:stash('room_id')
        local connection_header = req:header('connection')
        if not connection_header or string.lower(connection_header) ~= 'upgrade' then
            log.warn('ws request without "Connection: Upgrade" header')
            return {
                status = 400,
            }
        end
        local upgrade_header = req:header('upgrade')
        if not upgrade_header or string.lower(upgrade_header) ~= 'websocket' then
            log.warn('ws request without "Upgrade: websocket" header')
            return {
                status = 400,
            }
        end
        if not req:header('sec-websocket-key') then
            log.warn('ws request without "sec-websocket-key" header')
            return {
                status = 400,
            }
        end
        if req:header('sec-websocket-version') ~= '13' then
            log.warn('ws request with unsupported sec-websocket-version: '..req:header('sec-websocket-version'))
            return {
                status = 400,
            }
        end
        local accept_upgrade_response = ws_handshake.reduce_response(
            ws_handshake.accept_upgrade({
                headers = req:headers(),
            })
        )
        local sock = req:hijack()
        local written = sock:write(accept_upgrade_response)
        if not written then
            log.error('failed to write accept_upgrade_response to socket: '..sock:error())
            return
        end
        local peer = ws.new(sock, 10, false, true)
        local ok, err = pcall(handler, room_id, peer)
        if not ok then
            log.error('Finishing with error: '..err)
        end
    end)
    return server
end
