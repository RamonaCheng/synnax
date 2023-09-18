#  Copyright 2023 Synnax Labs, Inc.
#
#  Use of this software is governed by the Business Source License included in the file
#  licenses/BSL.txt.
#
#  As of the Change Date specified in that file, in accordance with the Business Source
#  License, use of this software will be governed by the Apache License, Version 2.0,
#  included in the file licenses/APL.txt.

import synnax as sy
import pandas as pd
import numpy as np
import time

client = sy.Synnax()

# |||| PRESS COMMAND |||

press_en_cmd_time = client.channels.create(
    name="press_en_cmd_time",
    is_index=True,
    data_type=sy.DataType.TIMESTAMP,
)

press_en_cmd = client.channels.create(
    name="press_en_cmd",
    index=press_en_cmd_time.key,
    data_type=sy.DataType.FLOAT32,
)


# |||| VENT COMMAND |||

vent_en_cmd_time = client.channels.create(
    name="vent_en_cmd_time",
    is_index=True,
    data_type=sy.DataType.TIMESTAMP,
)

vent_en_cmd = client.channels.create(
    name="vent_en_cmd",
    index=vent_en_cmd_time.key,
    data_type=sy.DataType.FLOAT32,
)


# |||| DAQ |||

daq_time = client.channels.create(
    name="daq_time",
    is_index=True,
    data_type=sy.DataType.TIMESTAMP,
)


press_en = client.channels.create(
    name="press_en",
    index=daq_time.key,
    data_type=sy.DataType.FLOAT32,
)

vent_en = client.channels.create(
    name="vent_en",
    index=daq_time.key,
    data_type=sy.DataType.FLOAT32,
)

data_ch = client.channels.create(
    name="pressure",
    index=daq_time.key,
    data_type=sy.DataType.FLOAT32,
)

print(
    f"""
    Press Command Time: {press_en_cmd_time.key}
    Press Command: {press_en_cmd.key}
    Vent Command Time: {vent_en_cmd_time.key}
    Vent Command: {vent_en_cmd.key}
    DAQ Time: {daq_time.key}
    Press Enable: {press_en.key}
    Vent Enable: {vent_en.key}
    Data: {data_ch.key}
"""
)

rate = (sy.Rate.HZ * 20).period.seconds

state = {
    press_en_cmd.key: np.float32(0),
    vent_en_cmd.key: np.float32(0),
}

i = 0
with client.new_streamer([press_en_cmd.key, vent_en_cmd.key]) as streamer:
    with client.new_writer(
        sy.TimeStamp.now(), [daq_time.key, press_en.key, vent_en.key, data_ch.key],
        name="Writer"
    ) as writer:
        press = 0
        while True:
            time.sleep(rate)
            if streamer.received:
                f = streamer.read()
                for k in f.columns:
                    state[k] = f[k][0]
            if state[press_en_cmd.key] > 0.5:
                press += 10
            if state[vent_en_cmd.key] > 0.5:
                if press > 0:
                    press -= 10

            ok = writer.write({
                daq_time: sy.TimeStamp.now(),
                press_en: state[press_en_cmd.key],
                vent_en: state[vent_en_cmd.key],
                data_ch: np.float32(press),
            })
            i += 1
