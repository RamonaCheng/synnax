
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.

#include <thread>
#include "driver/pipeline/acq.h"
#include "driver/errors/errors.h"
#include "nlohmann/json.hpp"

using json = nlohmann::json;

//using namespace pipeline;

Acq::Acq(std::unique_ptr<daq::AcqReader> daq_reader,
        synnax::WriterConfig writer_config,
        synnax::StreamerConfig streamer_config) :
        daq_reader(std::move(daq_reader)), writer_config(writer_config), streamer_config(streamer_config) {}

void Acq::start() {
    running = true;
    exec_thread = std::thread(&Acq::run, this);
}

void Acq::stop() {
    running = false;
    exec_thread.join();
}


std::string Acq::runInternal(){

    running = true;
    while (running) {
        auto [frame, error] = daq_reader->read();
        if (!error.ok()) {
            // Any other type means we've encountered a critical hardware failure
            // or configuration error and can't proceed.
            retry = error.type == TYPE_TRANSIENT_HARDWARE_ERROR;
        }
        if (!writer.write(std::move(frame))) {
            auto err = writer.error();
            if (!err.ok()) {
                retry = error.type == freighter::TYPE_UNREACHABLE;
                break;
            }
        }

        auto now = synnax::TimeStamp::now();
        if (now - last_commit > commit_interval) {
            auto ok = writer.commit().second;
            if (!ok) {
                auto err = writer.error();
                retry = error.type == freighter::TYPE_UNREACHABLE;
                break;
            }
            last_commit = now;
        }
    }
}

void Acq::run(){
    bool retry = false;

    // Open daq specific reader
    auto dq_err = daq_reader->start();
    if (!dq_err.ok()) {
        if (dq_err.type == TYPE_TRANSIENT_HARDWARE_ERROR && breaker->wait()) ;
        return;
    }

    // open synnax writer
    auto [writer, wo_err] = client->telem.openWriter(writer_config);
    if (!wo_err.ok()) {
        daq_reader->stop();
        if (wo_err.type == freighter::TYPE_UNREACHABLE && breaker->wait()) runInternal();
        return;
    }

    runInternal();

    daq_reader->stop(); // close daq readeer
    writer.close(); // close synnax writer

    if(retry && breaker->wait()) runInternal();
}


// TODO: remove below
//void Outbound::run() {
//    auto dq_err = daq_reader->start();
//    if (!dq_err.ok()) {
//        if (dq_err.type == TYPE_TRANSIENT_HARDWARE_ERROR && breaker->wait()) run();
//        return;
//    }
//
//    auto [writer, wo_err] = client->telem.openWriter(writer_config);
//    if (!wo_err.ok()) {
//        daq_reader->stop();
//        if (wo_err.type == freighter::TYPE_UNREACHABLE && breaker->wait()) run();
//        return;
//    }
//
//    bool retry = false;
//    while (running) {
//        auto [frame, error] = daq_reader->read();
//        if (!error.ok()) {
//            // Any other type means we've encountered a critical hardware failure
//            // or configuration error and can't proceed.
//            retry = error.type == TYPE_TRANSIENT_HARDWARE_ERROR;
//        }
//        if (!writer.write(std::move(frame))) {
//            auto err = writer.error();
//            if (!err.ok()) {
//                retry = error.type == freighter::TYPE_UNREACHABLE;
//                break;
//            }
//        }
//
//        auto now = synnax::TimeStamp::now();
//        if (now - last_commit > commit_interval) {
//            auto ok = writer.commit().second;
//            if (!ok) {
//                auto err = writer.error();
//                retry = error.type == freighter::TYPE_UNREACHABLE;
//                break;
//            }
//            last_commit = now;
//        }
//    }
//
//    daq_reader->stop();
//    writer.close();
//    if (retry && breaker->wait()) run();
//}
//
