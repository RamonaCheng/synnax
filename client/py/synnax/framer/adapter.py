#  Copyright 2023 Synnax Labs, Inc.
#
#  Use of this software is governed by the Business Source License included in the file
#  licenses/BSL.txt.
#
#  As of the Change Date specified in that file, in accordance with the Business Source
#  License, use of this software will be governed by the Apache License, Version 2.0,
#  included in the file licenses/APL.txt.

from pandas import DataFrame

from synnax.channel.payload import (
    ChannelPayload,
    ChannelKey,
    ChannelKeys,
    ChannelNames,
    ChannelName,
    ChannelParams,
)
from synnax.channel.retrieve import ChannelRetriever
from synnax.channel.payload import normalize_channel_params
from synnax.framer.frame import Frame
from synnax.telem.series import CrudeSeries, Series
from synnax.exceptions import ValidationError
from synnax.exceptions import QueryError


class ReadFrameAdapter:
    __adapter: dict[ChannelKey, ChannelName] | None
    retriever: ChannelRetriever
    keys: list[ChannelKey]

    def __init__(self, retriever: ChannelRetriever):
        self.retriever = retriever
        self.__adapter = None
        self.keys = list()

    def update(self, channels: ChannelParams):
        normal = normalize_channel_params(channels)
        if normal.variant == "keys":
            self.__adapter = None
            self.keys = normal.params
            return

        fetched = self.retriever.retrieve(normal.params)
        self.__adapter = dict[int, str]()
        for name in normal.params:
            ch = next((c for c in fetched if c.name == name), None)
            if ch is None:
                raise KeyError(f"Channel {name} not found.")
            self.__adapter[ch.key] = ch.name
        self.keys = list(self.__adapter.keys())

    def adapt(self, fr: Frame):
        if self.__adapter is None:
            return fr
        keys = [
            self.__adapter[k] if isinstance(k, ChannelKey) else k for k in fr.columns
        ]
        return Frame(columns_or_data=keys, series=fr.series)


class WriteFrameAdapter:
    __adapter: dict[ChannelName, ChannelKey] | None
    retriever: ChannelRetriever
    __keys: list[ChannelKey] | None

    def __init__(self, retriever: ChannelRetriever):
        self.retriever = retriever
        self.__adapter = None
        self.__keys = None

    def update(self, channels: ChannelParams):
        normal = normalize_channel_params(channels)
        fetched = self.retriever.retrieve(normal.params)
        self.__adapter = dict[ChannelName, ChannelKey]()
        for v in normal.params:
            ch = next((c for c in fetched if c.name == v or c.key == v), None)
            if ch is None:
                raise QueryError(f"Channel {v} not found.")
            self.__adapter[ch.name] = ch.key

    @property
    def keys(self):
        return self.__keys or list(self.__adapter.values())

    def __adapt_ch(self, ch: ChannelKey | ChannelName) -> ChannelPayload:
        payloads =  self.retriever.retrieve(ch)
        if len(payloads) == 0:
            raise QueryError(f"Channel {ch} not found.")
        return payloads[0]

    def adapt(
            self, 
            colums_or_data: 
            ChannelName | 
            ChannelKey | 
            ChannelKeys |
            ChannelNames | 
            Frame |
            dict[ChannelKey | ChannelName, CrudeSeries],
            series: CrudeSeries | list[CrudeSeries] | None = None,
    ) -> Frame:
        if isinstance(colums_or_data, (ChannelName, ChannelKey)):
            if isinstance(series, list) and len(list) > 1:
                raise ValidationError(f"""
                Received a single channel {'name' if isinstance(colums_or_data, ChannelName) else 'key'}
                but multiple series. 
                """)

            pld = self.__adapt_ch(colums_or_data)
            series = Series(data_type=pld.data_type, data=series)
            return Frame([pld.key], [series])

        if isinstance(colums_or_data, list):
            keys = []
            o_series = []
            for i, ch in enumerate(colums_or_data):
                pld = self.__adapt_ch(ch)
                if i >= len(series):
                    raise ValidationError(f"""
                    Received {len(colums_or_data)} channels but only {len(series)} series.
                    """)
                s = Series(data_type=pld.data_type, data=series[i])
                keys.append(pld.key)
                o_series.append(s)

            return Frame(keys, o_series)

        is_frame = isinstance(colums_or_data, Frame)
        is_df = isinstance(colums_or_data, DataFrame)
        if is_frame or is_df:
            if is_df:
                colums_or_data = Frame(colums_or_data)
            if self.__adapter is None:
                return colums_or_data
            keys = [
                self.__adapter[k] if isinstance(k, ChannelName) else k for k in colums_or_data.columns
            ]
            return Frame(columns_or_data=keys, series=colums_or_data.series)

        if isinstance(colums_or_data, dict):
            keys = []
            series = []
            for k, v in colums_or_data.items():
                pld = self.__adapt_ch(k)
                s = Series(data_type=pld.data_type, data=v)
                keys.append(pld.key)
                series.append(s)

            return Frame(keys, series)


        
        raise TypeError(f"""Cannot construct frame from {colums_or_data} and {series}""")





