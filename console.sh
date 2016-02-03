#!/bin/sh
geth --exec 'loadScript("./initialize.js")' attach ipc:/tmp/geth.ipc
geth attach ipc:/tmp/geth.ipc
