package storage

import (
	"github.com/synnaxlabs/cesium"
	"github.com/synnaxlabs/x/telem"
)

type (
	TS                 = cesium.DB
	TSWriter           = cesium.Writer
	TSIterator         = cesium.Iterator
	TSStreamWriter     = cesium.StreamWriter
	TSStreamIterator   = cesium.StreamIterator
	TSWriteRequest     = cesium.WriteRequest
	TSWriteResponse    = cesium.WriteResponse
	TSIteratorRequest  = cesium.IteratorRequest
	TSIteratorResponse = cesium.IteratorResponse
	WritableTS         = cesium.Writable
	StreamWritableTS   = cesium.StreamWritable
	ReadableTS         = cesium.Readable
	StreamIterableTS   = cesium.StreamIterable
	Channel            = cesium.Channel
	Frame              = cesium.Frame
	ChannelKey         uint16
	IteratorConfig     = cesium.IteratorConfig
	WriterConfig       = cesium.WriterConfig
)

const AutoSpan = telem.TimeSpan(-1)
