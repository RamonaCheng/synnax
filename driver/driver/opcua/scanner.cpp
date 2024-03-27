#include <memory>
#include "nlohmann/json.hpp"
#include "scanner.h"
#include "open62541/client_config_default.h"
#include "open62541/client_highlevel.h"
#include "open62541/client_subscriptions.h"
#include "open62541/plugin/log_stdout.h"

using json = nlohmann::json;

using namespace opcua;

void field_err(const std::string &path, const std::string &message, json &err) {
    json field;
    field["path"] = path;
    field["message"] = message;
    err["errors"].push_back(field);
}

json find_required(json j, const std::string& key, json &err, bool &ok) {
    auto iter = j.find(key);
    if (j.find(key) == j.end()) {
        field_err(key, "required", err);
        ok = false;
        return nullptr;
    }
    return iter.value();
}

// create a find_optional function that takes a json object, a key, and a default value
// if the key is not found in the json object, return the default value, otherwise,
// return the value associated with the key. Use a template to allow for any type of
// default value to be passed in.
template <typename T>
T find_optional(json j, const std::string& key, T default_value) {
    auto iter = j.find(key);
    if (iter == j.end()) {
        return default_value;
    }
    return iter.value().get<T>();
}

ScannerScanCommand::ScannerScanCommand(const json &cmd, json& err, bool &ok) {
    auto ep_val = find_required(cmd, "endpoint", err, ok);
    auto user_val = find_optional<std::string>(cmd, "username", "");
    auto pwd_val = find_optional<std::string>(cmd, "password", "");
    if (!ok) {
        return;
    }
    endpoint = ep_val.get<std::string>();
    username = user_val;
    password = pwd_val;
}

Scanner::Scanner(const ScannerConfig& config) : client(config.client) {}

void Scanner::exec(const std::string type, const json &cmd, json &err, bool &ok) {
    if (type == SCAN_CMD_TYPE) {
        ScannerScanCommand scanCmd(cmd, err, ok);
        if (!ok) return;
        scan(scanCmd, err, ok);
    }
}

const char* getDataTypeName(UA_UInt16 dataTypeId) {
    switch (dataTypeId) {
        case UA_NS0ID_BOOLEAN: return "Boolean";
        case UA_NS0ID_SBYTE: return "SByte";
        case UA_NS0ID_BYTE: return "Byte";
        case UA_NS0ID_INT16: return "Int16";
        case UA_NS0ID_UINT16: return "UInt16";
        case UA_NS0ID_INT32: return "Int32";
        case UA_NS0ID_UINT32: return "UInt32";
        case UA_NS0ID_INT64: return "Int64";
        case UA_NS0ID_UINT64: return "UInt64";
        case UA_NS0ID_FLOAT: return "Float";
        case UA_NS0ID_DOUBLE: return "Double";
        case UA_NS0ID_STRING: return "String";
        case UA_NS0ID_DATETIME: return "DateTime";
        case UA_NS0ID_GUID: return "GUID";
        case UA_NS0ID_BYTESTRING: return "ByteString";
        case UA_NS0ID_XMLELEMENT: return "XmlElement";
        case UA_NS0ID_NODEID: return "NodeId";
        case UA_NS0ID_EXPANDEDNODEID: return "ExpandedNodeId";
        case UA_NS0ID_STATUSCODE: return "StatusCode";
        case UA_NS0ID_QUALIFIEDNAME: return "QualifiedName";
        case UA_NS0ID_LOCALIZEDTEXT: return "LocalizedText";
        case UA_NS0ID_DATAVALUE: return "DataValue";
        case UA_NS0ID_DIAGNOSTICINFO: return "DiagnosticInfo";
            // Add more cases as needed
        default: return "Unknown";
    }
}

// Forward declaration of the callback function for recursive calls
static UA_StatusCode nodeIter(UA_NodeId childId, UA_Boolean isInverse, UA_NodeId referenceTypeId, void *handle);

// Function to recursively iterate through all children
void iterateChildren(UA_Client *client, UA_NodeId nodeId) {
    UA_Client_forEachChildNodeCall(client, nodeId, nodeIter, client);
}

#define MAX_DEPTH 3  // Define the maximum recursion depth

UA_UInt32 depth = 0;


// Callback function to handle each child node
static UA_StatusCode nodeIter(UA_NodeId childId, UA_Boolean isInverse, UA_NodeId referenceTypeId, void *handle) {
    if (isInverse) {
        return UA_STATUSCODE_GOOD;
    }

    UA_Client *client = (UA_Client *)handle;


    // Print indentation based on depth and basic information about the node
    for (UA_UInt32 i = 0; i < depth; i++) {
        printf("  ");
    }
    printf("Depth %u, NodeID: %u, ReferenceType: %u ", depth, childId.identifier.numeric, referenceTypeId.identifier.numeric);

    UA_QualifiedName browseName;
    UA_StatusCode retval = UA_Client_readBrowseNameAttribute(client, childId, &browseName);
    if (retval != UA_STATUSCODE_GOOD) {
        return retval;
    }
    printf("BrowseName: %.*s\n", (int)browseName.name.length, browseName.name.data);

    if (depth >= MAX_DEPTH) {
        return UA_STATUSCODE_GOOD;
    }

//    Fetch the node's browse name
    UA_BrowseRequest bReq;
    UA_BrowseRequest_init(&bReq);
    bReq.requestedMaxReferencesPerNode = 0;
    bReq.nodesToBrowse = UA_BrowseDescription_new();
    bReq.nodesToBrowseSize = 1;
    bReq.nodesToBrowse[0].nodeId = childId;
    bReq.nodesToBrowse[0].resultMask = UA_BROWSERESULTMASK_ALL;

    UA_BrowseResponse bResp = UA_Client_Service_browse(client, bReq);



    // Recursively iterate through this node's children
    depth++;
    iterateChildren(client, childId);
    depth--;

    return UA_STATUSCODE_GOOD;
}

//// Recursive function to browse and print variables
//void browseNodesRecursive(UA_Client *ua_client, UA_NodeId nodeId) {
//    UA_BrowseRequest bReq;
//    UA_BrowseRequest_init(&bReq);
//    bReq.requestedMaxReferencesPerNode = 0;
//    bReq.nodesToBrowse = UA_BrowseDescription_new();
//    bReq.nodesToBrowseSize = 1;
//    bReq.nodesToBrowse[0].nodeId = nodeId;
//    bReq.nodesToBrowse[0].resultMask = UA_BROWSERESULTMASK_ALL;
//
//    UA_BrowseResponse bResp = UA_Client_Service_browse(ua_client , bReq);
//
//    for(size_t i = 0; i < bResp.resultsSize; ++i) {
//        for(size_t j = 0; j < bResp.results[i].referencesSize; ++j) {
//            UA_ReferenceDescription *ref = &(bResp.results[i].references[j]);
//            std::cout << "Reference: " << ref->browseName.name.data << std::endl;
//            if(ref->nodeClass == UA_NODECLASS_VARIABLE) {
//                UA_String nodeIdString = UA_STRING_NULL;
//                UA_NodeId_print(&ref->nodeId.nodeId, &nodeIdString);
//                printf("Variable NodeId: %.*s\n", (int)nodeIdString.length, nodeIdString.data);
//                UA_String_clear(&nodeIdString);
//
//                // Additional code to read and print the variable's name and data type...
//                // Read the variable's BrowseName
//                UA_ReadRequest rr;
//                UA_ReadRequest_init(&rr);
//                rr.nodesToRead = UA_ReadValueId_new();
//                rr.nodesToReadSize = 1;
//                rr.nodesToRead[0].nodeId = ref->nodeId.nodeId;
//                rr.nodesToRead[0].attributeId = UA_ATTRIBUTEID_BROWSENAME;
//                UA_ReadResponse rResp = UA_Client_Service_read(ua_client, rr);
//
//                // Read the variable's DataType
//                rr.nodesToRead[0].attributeId = UA_ATTRIBUTEID_DATATYPE;
//                UA_ReadResponse dtResp = UA_Client_Service_read(ua_client, rr);
//
//                if(rResp.resultsSize > 0 && rResp.results[0].status == UA_STATUSCODE_GOOD && dtResp.resultsSize > 0 && dtResp.results[0].status == UA_STATUSCODE_GOOD) {
//                    UA_QualifiedName qn = *(UA_QualifiedName *)rResp.results[0].value.data;
//                    UA_NodeId dataType = *(UA_NodeId *)dtResp.results[0].value.data;
//
//                    // Convert NodeId to a human-readable data type name
//                    const char* dataTypeName = getDataTypeName(dataType.identifier.numeric);
//
//                    printf("Variable NodeId: %s, Name: %.*s, DataType: %s\n", nodeIdString, (int)qn.name.length, qn.name.data, dataTypeName);
//
//                }
//                UA_ReadRequest_clear(&rr);
//                UA_ReadResponse_clear(&rResp);
//                UA_ReadResponse_clear(&dtResp);
//            }
//
//            // If the reference is a forward reference, recursively browse the target node
////            ignore file directory types
//            if(ref->isForward && ref->nodeClass == UA_NODECLASS_OBJECT) {
//                UA_NodeId childId = UA_NODEID_NULL;
//                UA_NodeId_copy(&ref->nodeId.nodeId, &childId);
//                browseNodesRecursive(ua_client, childId);
//                UA_NodeId_clear(&childId);
//            }
//        }
//    }
//
//    UA_BrowseRequest_clear(&bReq);
//    UA_BrowseResponse_clear(&bResp);
//}

void Scanner::scan(const opcua::ScannerScanCommand &cmd, json &err, bool &ok) {
    UA_Client *ua_client = UA_Client_new();

    UA_ClientConfig_setDefault(UA_Client_getConfig(ua_client));
    UA_StatusCode status;
    UA_ClientConfig *config = UA_Client_getConfig(ua_client);
    if (cmd.username.empty() && cmd.password.empty()) {
        status = UA_Client_connect(ua_client, cmd.endpoint.c_str());
    } else {
        status = UA_Client_connectUsername(
                ua_client,
                cmd.endpoint.c_str(),
                cmd.username.c_str(),
                cmd.password.c_str()
        );
    }
    if (status != UA_STATUSCODE_GOOD) {
        field_err("endpoint", "failed to connect", err);
        ok = false;
        return;
    }

    // Start iterating from the RootFolder
    printf("Starting schema introspection...\n");
    // only grab the object in ns 2 with the name "MyObject"
    UA_NodeId rootFolderId = UA_NODEID_NUMERIC(2, 3);

    // Begin recursive iteration
    iterateChildren(ua_client, rootFolderId);

    return;
}