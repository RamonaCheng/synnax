// Copyright 2023 Synnax Labs, Inc.
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.

package unary

import (
	"context"
	"fmt"
	"github.com/cockroachdb/errors"
	"github.com/synnaxlabs/cesium/internal/controller"
	"github.com/synnaxlabs/cesium/internal/core"
	"github.com/synnaxlabs/cesium/internal/domain"
	"github.com/synnaxlabs/cesium/internal/index"
	"github.com/synnaxlabs/x/atomic"
	"github.com/synnaxlabs/x/override"
	"github.com/synnaxlabs/x/telem"
)

type controlledWriter struct {
	*domain.Writer
	channelKey core.ChannelKey
}

func (w controlledWriter) ChannelKey() core.ChannelKey { return w.channelKey }

type DB struct {
	Config
	Domain              *domain.DB
	Controller          *controller.Controller[controlledWriter]
	_idx                index.Index
	openIteratorWriters *atomic.Int32Counter
}

func (db *DB) Index() index.Index {
	if !db.Channel.IsIndex {
		panic(fmt.Sprintf("[control.unary] - database %v does not support indexing", db.Channel.Key))
	}
	return db.index()
}

func (db *DB) index() index.Index {
	if db._idx == nil {
		panic("[ranger.unary] - index is not set")
	}
	return db._idx
}

func (db *DB) SetIndex(idx index.Index) { db._idx = idx }

type IteratorConfig struct {
	Bounds telem.TimeRange
	// AutoChunkSize sets the maximum size of a chunk that will be returned by the
	// iterator when using AutoSpan in calls ot Next or Prev.
	AutoChunkSize int64
}

func IterRange(tr telem.TimeRange) IteratorConfig {
	return IteratorConfig{Bounds: domain.IterRange(tr).Bounds, AutoChunkSize: 0}
}

var (
	DefaultIteratorConfig = IteratorConfig{AutoChunkSize: 5e5}
)

func (i IteratorConfig) Override(other IteratorConfig) IteratorConfig {
	i.Bounds.Start = override.Numeric(i.Bounds.Start, other.Bounds.Start)
	i.Bounds.End = override.Numeric(i.Bounds.End, other.Bounds.End)
	i.AutoChunkSize = override.Numeric(i.AutoChunkSize, other.AutoChunkSize)
	return i
}

func (i IteratorConfig) ranger() domain.IteratorConfig {
	return domain.IteratorConfig{Bounds: i.Bounds}
}

func (db *DB) LeadingControlState() *controller.State {
	return db.Controller.LeadingState()
}

func (db *DB) OpenIterator(cfg IteratorConfig) *Iterator {
	cfg = DefaultIteratorConfig.Override(cfg)
	iter := db.Domain.NewIterator(cfg.ranger())
	i := &Iterator{
		idx:              db.index(),
		Channel:          db.Channel,
		internal:         iter,
		IteratorConfig:   cfg,
		decrementCounter: func() { db.openIteratorWriters.Add(-1) },
	}
	i.SetBounds(cfg.Bounds)
	db.openIteratorWriters.Add(1)
	return i
}

func (db *DB) TryClose() error {
	if db.openIteratorWriters.Value() > 0 {
		return errors.New(fmt.Sprintf("[cesium] - channel has %d unclosed writers/iterators accessing it", db.openIteratorWriters.Value()))
	} else {
		return db.Close()
	}
}

// Read at the unary level
func (db *DB) Read(ctx context.Context, tr telem.TimeRange) (frame core.Frame, err error) {
	iter := db.OpenIterator(IterRange(tr))
	if err != nil {
		return
	}
	defer func() { err = iter.Close() }()
	if !iter.SeekFirst(ctx) {
		return
	}
	for iter.Next(ctx, telem.TimeSpanMax) {
		frame = frame.AppendFrame(iter.Value())
	}
	return
}

func (db *DB) Delete(ctx context.Context, tr telem.TimeRange) error {
	bounds := db.Domain.GetBounds()
	i := db.Domain.NewIterator(domain.IteratorConfig{Bounds: bounds})
	if ok := i.SeekGE(ctx, tr.Start); !ok {
		return errors.New("Start TS not found")
	}
	approxDist, err := db.index().Distance(ctx, telem.TimeRange{
		Start: i.TimeRange().Start,
		End:   tr.Start,
	}, false)
	if err != nil {
		return err
	}
	startOffset := approxDist.Upper

	if ok := i.SeekLE(ctx, tr.End); !ok {
		return errors.New("End TS not found")
	}
	approxDist, err = db.index().Distance(ctx, telem.TimeRange{
		Start: tr.End,
		End:   i.TimeRange().End,
	}, false)
	if err != nil {
		return err
	}
	endOffset := approxDist.Lower + 1
	return db.Domain.Delete(ctx, tr, startOffset*int64(db.Channel.DataType.Density()), endOffset*int64(db.Channel.DataType.Density()))
}

func (db *DB) GarbageCollect(ctx context.Context, maxSizeRead uint32) (bool, error) {
	if db.openIteratorWriters.Value() > 0 {
		return false, nil
	}
	err := db.Domain.CollectTombstone(ctx, maxSizeRead)
	return true, err
}

func (db *DB) Close() error { return db.Domain.Close() }
