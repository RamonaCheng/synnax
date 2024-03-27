#include <include/gtest/gtest.h>
#include "nlohmann/json.hpp"
#include "driver/driver/opcua/scanner.h"
#include "client/cpp/synnax/synnax.h"

using json = nlohmann::json;

const synnax::Config test_client_config = {
        "localhost",
        9090,
        "synnax",
        "seldon"
};

synnax::Synnax new_test_client()
{
    return synnax::Synnax(test_client_config);
}

TEST(OPCUAScnannerTest, testScannerCmdParseOnlyEdnpoint) {
    json cmd = {
        {"endpoint", "opc.tcp://localhost:4840"},
    };
    json err = {
            {"errors", std::vector<json>()}
    };
    bool ok = true;
    auto parsedScanCmd = opcua::ScannerScanCommand(cmd, err, ok);
    EXPECT_TRUE(ok);
    EXPECT_EQ(parsedScanCmd.endpoint, "opc.tcp://localhost:4840");
    EXPECT_EQ(parsedScanCmd.username, "");
    EXPECT_EQ(parsedScanCmd.password, "");
}

TEST(OPCUAScannerTest, testScannerCmdParseEndpointUsernamePassword) {
    json cmd = {
        {"endpoint", "opc.tcp://localhost:4840"},
        {"username", "user"},
        {"password", "password"}
    };
    json err = {
            {"errors", std::vector<json>()}
    };
    bool ok = true;
    auto parsedScanCmd = opcua::ScannerScanCommand(cmd, err, ok);
    EXPECT_TRUE(ok);
    EXPECT_EQ(parsedScanCmd.endpoint, "opc.tcp://localhost:4840");
    EXPECT_EQ(parsedScanCmd.username, "user");
    EXPECT_EQ(parsedScanCmd.password, "password");
}

TEST(OPCUAScannerTest, testScannerCmdParseNoEndpoint) {
    json cmd = {
        {"username", "user"},
        {"password", "password"}
    };
    json err = {
            {"errors", std::vector<json>()}
    };
    bool ok = true;
    auto parsedScanCmd = opcua::ScannerScanCommand(cmd, err, ok);
    EXPECT_FALSE(ok);
    auto field_err = err["errors"][0];
    EXPECT_EQ(field_err["path"], "endpoint");
    EXPECT_EQ(field_err["message"], "required");
}

TEST(OPCUAScannerTest, testScannerScan) {
    json cmd = {{"endpoint", "opc.tcp://0.0.0.0:4840/freeopcua/server"}};
    json err = {
            {"errors", std::vector<json>()}
    };
    auto client = std::make_shared<synnax::Synnax>(new_test_client());
    auto scanner = opcua::Scanner(opcua::ScannerConfig{.client = client});
    bool ok = true;
    scanner.exec("scan", cmd, err, ok);
}