FROM tarantool/tarantool:2.11.1

ENV TARANTOOL_PORT=3301
ENV HTTP_API_PORT=80

WORKDIR /opt/tarantool

COPY http-scm-1.rockspec ./

RUN : \
  && apk add cmake make gcc libc-dev && tarantoolctl rocks install --local http-scm-1.rockspec \
  && tarantoolctl rocks install --local https://github.com/tarantool/websocket/raw/master/websocket-scm-1.rockspec \
  && tarantoolctl rocks install --local https://raw.githubusercontent.com/moonlibs/indexpiration/master/rockspecs/indexpiration-scm-1.rockspec \
  && tarantoolctl rocks install --local argparse \
  && :

COPY codenames /usr/local/share/tarantool/codenames
COPY instance.lua ./

CMD ["sh", "-c", "tarantool ./instance.lua --port ${HTTP_API_PORT}"]
