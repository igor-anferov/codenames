box.cfg{}

local argparse = require('argparse')

local parser = argparse(arg[-1]..' '..arg[0], "tarantool instance of codenames app")
parser:option("-p --port", "Port to bind HTTP API listener to", 80)
local args = parser:parse()

math.randomseed(os.time())

require('codenames.server')('0.0.0.0', args.port):start()
