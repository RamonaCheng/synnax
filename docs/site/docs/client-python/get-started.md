---
sidebar_position: 1
---

# Get Started

Synnax offers a Python client for communicating with a cluster. 

## Installation

The Python client is available on PyPI, and can be installed using pip:

```bash
pip install synnax
```

## Connecting to a Cluster

To connect to a cluster, import the `Client` class and instantiate it with the host and port of a reachable node in
the cluster:

```python
import synnax

client = synnax.Client(host="localhost",port=8080)
```

## Write Telemetry

To write telemetry to a cluster, we first need to create a channel. If you're unaware of what a channel is, you can
read more about it [here](../concepts#channel). To create a channel, we use the `.channel.create()` method:

```python
from synnax import telem
import numpy as np

ch = client.channel.create(
    # An useful name for the channel. This is mostly for human consumption.
    name="my-temperature-sensor",
    # This defines the data rate for the cahnnel. This is the number of 
    # samples per second that will be stored.
    data_rate=25 * telem.HZ,
    # We're using a built-in data type here. While np.float64 itself isn't an 
    # official data type, Synnax can interpret it as a type of telem.FLOAT64.
    data_type=np.float64,
)
```

Once we have a channel, we can write telemetry to it using the `.data.write()` method:

```python
# ... same imports as above
from datetime import datetime

# Create a numpy array of 1000 random samples.
data = np.random.rand(1000, dtype=np.float64)

# Write the data to the channel. The provided timestamp represents the timestamp for the 
# first sample in the array.
start = datetime.now()
client.data.write(ch, data, start))
```

<details>
<summary> <strong>In case you'd like a recap, here's the entire code block.</strong> </summary>

```python
import synnax
from synnax import telem
import numpy as np
from datetime import datetime

# Open a client.
client = synnax.Client(host="localhost",port=8080)

# Create a channel.
ch = client.channel.create(
    name="my-temperature-sensor",
    data_rate=25 * telem.HZ,
    data_type=np.float64,
)


# Write some data to it.
data = np.random.rand(1000, dtype=np.float64)
start = datetime.now()

client.data.write(ch, data, stamp)
```

</details>

## Read Telemetry

Reading telemetry from a channel is as simple as writing to it. To read data from a channel, we use the `.data.read()`
method:

```python
# ... starting from the end of the previous example


# Calculate the ending timestamp for the data we want to read.
end = telem.Timestamp(start) + 1000 / 25 * telem.Hz

# Read the data from the channel. The provided timestamp represents the timestamp for the
# first sample in the array.
data = client.data.read(ch, start, end)
```

This returns a `numpy.ndarray` of the data that was read from the channel.

<details>
<summary> <strong>And here's it all in one simple script.</strong> </summary>

```python
import synnax
from synnax import telem
import numpy as np
from datetime import datetime

# Open a client.
client = synnax.Client(host="localhost",port=8080)

# Create a channel.
ch = client.channel.create(
    name="my-temperature-sensor",
    data_rate=25 * telem.HZ,
    data_type=np.float64,
)


# Write some data.
data = np.random.rand(1000, dtype=np.float64)
start = datetime.now()
client.data.write(ch, data, stamp)

# Read it back.
end = telem.Timestamp(start) + 1000 / 25 * telem.Hz
data = client.data.read(ch, start, end)
```
</details>
