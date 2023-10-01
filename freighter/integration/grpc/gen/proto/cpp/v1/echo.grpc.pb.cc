// Generated by the gRPC C++ plugin.
// If you make any local change, they will be lost.
// source: v1/echo.proto

#include "v1/echo.pb.h"
#include "v1/echo.grpc.pb.h"

#include <functional>
#include <grpcpp/support/async_stream.h>
#include <grpcpp/support/async_unary_call.h>
#include <grpcpp/impl/channel_interface.h>
#include <grpcpp/impl/client_unary_call.h>
#include <grpcpp/support/client_callback.h>
#include <grpcpp/support/message_allocator.h>
#include <grpcpp/support/method_handler.h>
#include <grpcpp/impl/rpc_service_method.h>
#include <grpcpp/support/server_callback.h>
#include <grpcpp/impl/server_callback_handlers.h>
#include <grpcpp/server_context.h>
#include <grpcpp/impl/service_type.h>
#include <grpcpp/support/sync_stream.h>
namespace integration {
namespace v1 {

static const char* EchoService_method_names[] = {
  "/integration.v1.EchoService/Exec",
};

std::unique_ptr< EchoService::Stub> EchoService::NewStub(const std::shared_ptr< ::grpc::ChannelInterface>& channel, const ::grpc::StubOptions& options) {
  (void)options;
  std::unique_ptr< EchoService::Stub> stub(new EchoService::Stub(channel, options));
  return stub;
}

EchoService::Stub::Stub(const std::shared_ptr< ::grpc::ChannelInterface>& channel, const ::grpc::StubOptions& options)
  : channel_(channel), rpcmethod_Exec_(EchoService_method_names[0], options.suffix_for_stats(),::grpc::internal::RpcMethod::NORMAL_RPC, channel)
  {}

::grpc::Status EchoService::Stub::Exec(::grpc::ClientContext* context, const ::integration::v1::Message& request, ::integration::v1::Message* response) {
  return ::grpc::internal::BlockingUnaryCall< ::integration::v1::Message, ::integration::v1::Message, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(channel_.get(), rpcmethod_Exec_, context, request, response);
}

void EchoService::Stub::async::Exec(::grpc::ClientContext* context, const ::integration::v1::Message* request, ::integration::v1::Message* response, std::function<void(::grpc::Status)> f) {
  ::grpc::internal::CallbackUnaryCall< ::integration::v1::Message, ::integration::v1::Message, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(stub_->channel_.get(), stub_->rpcmethod_Exec_, context, request, response, std::move(f));
}

void EchoService::Stub::async::Exec(::grpc::ClientContext* context, const ::integration::v1::Message* request, ::integration::v1::Message* response, ::grpc::ClientUnaryReactor* reactor) {
  ::grpc::internal::ClientCallbackUnaryFactory::Create< ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(stub_->channel_.get(), stub_->rpcmethod_Exec_, context, request, response, reactor);
}

::grpc::ClientAsyncResponseReader< ::integration::v1::Message>* EchoService::Stub::PrepareAsyncExecRaw(::grpc::ClientContext* context, const ::integration::v1::Message& request, ::grpc::CompletionQueue* cq) {
  return ::grpc::internal::ClientAsyncResponseReaderHelper::Create< ::integration::v1::Message, ::integration::v1::Message, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(channel_.get(), cq, rpcmethod_Exec_, context, request);
}

::grpc::ClientAsyncResponseReader< ::integration::v1::Message>* EchoService::Stub::AsyncExecRaw(::grpc::ClientContext* context, const ::integration::v1::Message& request, ::grpc::CompletionQueue* cq) {
  auto* result =
    this->PrepareAsyncExecRaw(context, request, cq);
  result->StartCall();
  return result;
}

EchoService::Service::Service() {
  AddMethod(new ::grpc::internal::RpcServiceMethod(
      EchoService_method_names[0],
      ::grpc::internal::RpcMethod::NORMAL_RPC,
      new ::grpc::internal::RpcMethodHandler< EchoService::Service, ::integration::v1::Message, ::integration::v1::Message, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(
          [](EchoService::Service* service,
             ::grpc::ServerContext* ctx,
             const ::integration::v1::Message* req,
             ::integration::v1::Message* resp) {
               return service->Exec(ctx, req, resp);
             }, this)));
}

EchoService::Service::~Service() {
}

::grpc::Status EchoService::Service::Exec(::grpc::ServerContext* context, const ::integration::v1::Message* request, ::integration::v1::Message* response) {
  (void) context;
  (void) request;
  (void) response;
  return ::grpc::Status(::grpc::StatusCode::UNIMPLEMENTED, "");
}


}  // namespace integration
}  // namespace v1
