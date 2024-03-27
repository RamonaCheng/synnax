// Copyright 2024 Synnax Labs, Inc.
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.


#include "client/cpp/synnax/hardware/hardware.h"

using namespace synnax;

Rack::Rack(RackKey key, std::string name) :
        key(key),
        name(name) {
}

Rack::Rack(std::string name) : name(name) {
}

Rack::Rack(const api::v1::Rack &a) :
        key(a.key()),
        name(a.name()) {
}

void Rack::to_proto(api::v1::Rack *rack) const {
    rack->set_key(key.value);
    rack->set_name(name);
}


const std::string RETRIEVE_RACK_ENDPOINT = "/hardware/rack/retrieve";
const std::string CREATE_RACK_ENDPOINT = "/hardware/rack/create";

std::pair<Rack, freighter::Error> HardwareClient::retrieveRack(std::uint32_t key) const {
    auto req = api::v1::HardwareRetrieveRackRequest();
    req.add_keys(key);
    auto [res, err] = rack_retrieve_client->send(RETRIEVE_RACK_ENDPOINT, req);
    if (err) return {Rack(), err};
    auto rack = Rack(res.racks(0));
    rack.tasks = TaskClient(rack.key, task_create_client, task_retrieve_client, task_delete_client);
    return {rack, err};
}

freighter::Error HardwareClient::createRack(Rack &rack) const {
    auto req = api::v1::HardwareCreateRackRequest();
    rack.to_proto(req.add_racks());
    auto [res, err] = rack_create_client->send(CREATE_RACK_ENDPOINT, req);
    if (err) return err;
    rack.key = res.racks().at(0).key();
    rack.tasks = TaskClient(rack.key, task_create_client, task_retrieve_client, task_delete_client);
    return err;
}

std::pair<Rack, freighter::Error> HardwareClient::createRack(const std::string &name) const {
    auto rack = Rack(name);
    auto err = createRack(rack);
    return {rack, err};
}

freighter::Error HardwareClient::deleteRack(std::uint32_t key) const {
    auto req = api::v1::HardwareDeleteRackRequest();
    req.add_keys(key);
    auto [res, err] = rack_delete_client->send(CREATE_RACK_ENDPOINT, req);
    return err;
}

Task::Task(TaskKey key, std::string name, std::string type, std::string config) :
        key(key),
        name(name),
        type(type),
        config(config) {
}

Task::Task(RackKey rack, std::string name, std::string type, std::string config) :
        key(TaskKey(rack, 0)),
        name(name),
        type(type),
        config(config) {
}

Task::Task(const api::v1::Task &a) :
        key(a.key()),
        name(a.name()),
        type(a.type()),
        config(a.config()) {
}

void Task::to_proto(api::v1::Task *task) const {
    task->set_key(key);
    task->set_name(name);
    task->set_type(type);
    task->set_config(config);
}

const std::string RETRIEVE_MODULE_ENDPOINT = "/hardware/task/retrieve";
const std::string CREATE_MODULE_ENDPOINT = "/hardware/task/create";
const std::string DELETE_MODULE_ENDPOINT = "/hardware/task/delete";

std::pair<Task, freighter::Error> TaskClient::retrieve(std::uint64_t key) const {
    auto req = api::v1::HardwareRetrieveTaskRequest();
    req.add_keys(key);
    auto [res, err] = task_retrieve_client->send(RETRIEVE_MODULE_ENDPOINT, req);
    if (err) return {Task(), err};
    return {Task(res.tasks(0)), err};
}

freighter::Error TaskClient::create(Task &task) const {
    auto req = api::v1::HardwareCreateTaskRequest();
    task.to_proto(req.add_tasks());
    auto [res, err] = task_create_client->send(CREATE_MODULE_ENDPOINT, req);
    if (err) return err;
    task.key = res.tasks().at(0).key();
    return err;
}

freighter::Error TaskClient::del(std::uint64_t key) const {
    auto req = api::v1::HardwareDeleteTaskRequest();
    req.add_keys(key);
    auto [res, err] = task_delete_client->send(DELETE_MODULE_ENDPOINT, req);
    return err;
}

std::pair<std::vector<Task>, freighter::Error> TaskClient::list() const {
    auto req = api::v1::HardwareRetrieveTaskRequest();
    req.set_rack(rack.value);
    auto [res, err] = task_retrieve_client->send(RETRIEVE_MODULE_ENDPOINT, req);
    if (err) return {std::vector<Task>(), err};
    std::vector<Task> tasks = {res.tasks().begin(), res.tasks().end()};
    return {tasks, err};
}

