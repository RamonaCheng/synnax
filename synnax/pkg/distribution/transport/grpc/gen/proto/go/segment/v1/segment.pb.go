// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.26.0
// 	protoc        (unknown)
// source: segment/v1/segment.proto

package segmentv1

import (
	v1 "github.com/arya-analytics/freighter/ferrors/v1"
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type IteratorRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Command int32      `protobuf:"varint,1,opt,name=command,proto3" json:"command,omitempty"`
	Span    int64      `protobuf:"varint,2,opt,name=span,proto3" json:"span,omitempty"`
	Range   *TimeRange `protobuf:"bytes,3,opt,name=range,proto3" json:"range,omitempty"`
	Stamp   int64      `protobuf:"varint,4,opt,name=stamp,proto3" json:"stamp,omitempty"`
	Keys    []string   `protobuf:"bytes,5,rep,name=keys,proto3" json:"keys,omitempty"`
}

func (x *IteratorRequest) Reset() {
	*x = IteratorRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_segment_v1_segment_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *IteratorRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*IteratorRequest) ProtoMessage() {}

func (x *IteratorRequest) ProtoReflect() protoreflect.Message {
	mi := &file_segment_v1_segment_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use IteratorRequest.ProtoReflect.Descriptor instead.
func (*IteratorRequest) Descriptor() ([]byte, []int) {
	return file_segment_v1_segment_proto_rawDescGZIP(), []int{0}
}

func (x *IteratorRequest) GetCommand() int32 {
	if x != nil {
		return x.Command
	}
	return 0
}

func (x *IteratorRequest) GetSpan() int64 {
	if x != nil {
		return x.Span
	}
	return 0
}

func (x *IteratorRequest) GetRange() *TimeRange {
	if x != nil {
		return x.Range
	}
	return nil
}

func (x *IteratorRequest) GetStamp() int64 {
	if x != nil {
		return x.Stamp
	}
	return 0
}

func (x *IteratorRequest) GetKeys() []string {
	if x != nil {
		return x.Keys
	}
	return nil
}

type Segment struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	ChannelKey string `protobuf:"bytes,1,opt,name=channel_key,json=channelKey,proto3" json:"channel_key,omitempty"`
	Start      int64  `protobuf:"varint,2,opt,name=start,proto3" json:"start,omitempty"`
	Data       []byte `protobuf:"bytes,3,opt,name=data,proto3" json:"data,omitempty"`
}

func (x *Segment) Reset() {
	*x = Segment{}
	if protoimpl.UnsafeEnabled {
		mi := &file_segment_v1_segment_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Segment) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Segment) ProtoMessage() {}

func (x *Segment) ProtoReflect() protoreflect.Message {
	mi := &file_segment_v1_segment_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Segment.ProtoReflect.Descriptor instead.
func (*Segment) Descriptor() ([]byte, []int) {
	return file_segment_v1_segment_proto_rawDescGZIP(), []int{1}
}

func (x *Segment) GetChannelKey() string {
	if x != nil {
		return x.ChannelKey
	}
	return ""
}

func (x *Segment) GetStart() int64 {
	if x != nil {
		return x.Start
	}
	return 0
}

func (x *Segment) GetData() []byte {
	if x != nil {
		return x.Data
	}
	return nil
}

type IteratorResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Variant  int32            `protobuf:"varint,1,opt,name=variant,proto3" json:"variant,omitempty"`
	NodeId   int32            `protobuf:"varint,2,opt,name=node_id,json=nodeId,proto3" json:"node_id,omitempty"`
	Ack      bool             `protobuf:"varint,3,opt,name=ack,proto3" json:"ack,omitempty"`
	Command  int32            `protobuf:"varint,4,opt,name=command,proto3" json:"command,omitempty"`
	Counter  int32            `protobuf:"varint,5,opt,name=counter,proto3" json:"counter,omitempty"`
	Error    *v1.ErrorPayload `protobuf:"bytes,6,opt,name=error,proto3" json:"error,omitempty"`
	Segments []*Segment       `protobuf:"bytes,7,rep,name=segments,proto3" json:"segments,omitempty"`
}

func (x *IteratorResponse) Reset() {
	*x = IteratorResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_segment_v1_segment_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *IteratorResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*IteratorResponse) ProtoMessage() {}

func (x *IteratorResponse) ProtoReflect() protoreflect.Message {
	mi := &file_segment_v1_segment_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use IteratorResponse.ProtoReflect.Descriptor instead.
func (*IteratorResponse) Descriptor() ([]byte, []int) {
	return file_segment_v1_segment_proto_rawDescGZIP(), []int{2}
}

func (x *IteratorResponse) GetVariant() int32 {
	if x != nil {
		return x.Variant
	}
	return 0
}

func (x *IteratorResponse) GetNodeId() int32 {
	if x != nil {
		return x.NodeId
	}
	return 0
}

func (x *IteratorResponse) GetAck() bool {
	if x != nil {
		return x.Ack
	}
	return false
}

func (x *IteratorResponse) GetCommand() int32 {
	if x != nil {
		return x.Command
	}
	return 0
}

func (x *IteratorResponse) GetCounter() int32 {
	if x != nil {
		return x.Counter
	}
	return 0
}

func (x *IteratorResponse) GetError() *v1.ErrorPayload {
	if x != nil {
		return x.Error
	}
	return nil
}

func (x *IteratorResponse) GetSegments() []*Segment {
	if x != nil {
		return x.Segments
	}
	return nil
}

type WriterRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	OpenKeys []string   `protobuf:"bytes,1,rep,name=open_keys,json=openKeys,proto3" json:"open_keys,omitempty"`
	Segments []*Segment `protobuf:"bytes,2,rep,name=segments,proto3" json:"segments,omitempty"`
}

func (x *WriterRequest) Reset() {
	*x = WriterRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_segment_v1_segment_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *WriterRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*WriterRequest) ProtoMessage() {}

func (x *WriterRequest) ProtoReflect() protoreflect.Message {
	mi := &file_segment_v1_segment_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use WriterRequest.ProtoReflect.Descriptor instead.
func (*WriterRequest) Descriptor() ([]byte, []int) {
	return file_segment_v1_segment_proto_rawDescGZIP(), []int{3}
}

func (x *WriterRequest) GetOpenKeys() []string {
	if x != nil {
		return x.OpenKeys
	}
	return nil
}

func (x *WriterRequest) GetSegments() []*Segment {
	if x != nil {
		return x.Segments
	}
	return nil
}

type WriterResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Error *v1.ErrorPayload `protobuf:"bytes,1,opt,name=error,proto3" json:"error,omitempty"`
}

func (x *WriterResponse) Reset() {
	*x = WriterResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_segment_v1_segment_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *WriterResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*WriterResponse) ProtoMessage() {}

func (x *WriterResponse) ProtoReflect() protoreflect.Message {
	mi := &file_segment_v1_segment_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use WriterResponse.ProtoReflect.Descriptor instead.
func (*WriterResponse) Descriptor() ([]byte, []int) {
	return file_segment_v1_segment_proto_rawDescGZIP(), []int{4}
}

func (x *WriterResponse) GetError() *v1.ErrorPayload {
	if x != nil {
		return x.Error
	}
	return nil
}

type TimeRange struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Start int64 `protobuf:"varint,1,opt,name=start,proto3" json:"start,omitempty"`
	End   int64 `protobuf:"varint,2,opt,name=end,proto3" json:"end,omitempty"`
}

func (x *TimeRange) Reset() {
	*x = TimeRange{}
	if protoimpl.UnsafeEnabled {
		mi := &file_segment_v1_segment_proto_msgTypes[5]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *TimeRange) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*TimeRange) ProtoMessage() {}

func (x *TimeRange) ProtoReflect() protoreflect.Message {
	mi := &file_segment_v1_segment_proto_msgTypes[5]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use TimeRange.ProtoReflect.Descriptor instead.
func (*TimeRange) Descriptor() ([]byte, []int) {
	return file_segment_v1_segment_proto_rawDescGZIP(), []int{5}
}

func (x *TimeRange) GetStart() int64 {
	if x != nil {
		return x.Start
	}
	return 0
}

func (x *TimeRange) GetEnd() int64 {
	if x != nil {
		return x.End
	}
	return 0
}

var File_segment_v1_segment_proto protoreflect.FileDescriptor

var file_segment_v1_segment_proto_rawDesc = []byte{
	0x0a, 0x18, 0x73, 0x65, 0x67, 0x6d, 0x65, 0x6e, 0x74, 0x2f, 0x76, 0x31, 0x2f, 0x73, 0x65, 0x67,
	0x6d, 0x65, 0x6e, 0x74, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x0a, 0x73, 0x65, 0x67, 0x6d,
	0x65, 0x6e, 0x74, 0x2e, 0x76, 0x31, 0x1a, 0x18, 0x66, 0x65, 0x72, 0x72, 0x6f, 0x72, 0x73, 0x2f,
	0x76, 0x31, 0x2f, 0x66, 0x65, 0x72, 0x72, 0x6f, 0x72, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f,
	0x22, 0x96, 0x01, 0x0a, 0x0f, 0x49, 0x74, 0x65, 0x72, 0x61, 0x74, 0x6f, 0x72, 0x52, 0x65, 0x71,
	0x75, 0x65, 0x73, 0x74, 0x12, 0x18, 0x0a, 0x07, 0x63, 0x6f, 0x6d, 0x6d, 0x61, 0x6e, 0x64, 0x18,
	0x01, 0x20, 0x01, 0x28, 0x05, 0x52, 0x07, 0x63, 0x6f, 0x6d, 0x6d, 0x61, 0x6e, 0x64, 0x12, 0x12,
	0x0a, 0x04, 0x73, 0x70, 0x61, 0x6e, 0x18, 0x02, 0x20, 0x01, 0x28, 0x03, 0x52, 0x04, 0x73, 0x70,
	0x61, 0x6e, 0x12, 0x2b, 0x0a, 0x05, 0x72, 0x61, 0x6e, 0x67, 0x65, 0x18, 0x03, 0x20, 0x01, 0x28,
	0x0b, 0x32, 0x15, 0x2e, 0x73, 0x65, 0x67, 0x6d, 0x65, 0x6e, 0x74, 0x2e, 0x76, 0x31, 0x2e, 0x54,
	0x69, 0x6d, 0x65, 0x52, 0x61, 0x6e, 0x67, 0x65, 0x52, 0x05, 0x72, 0x61, 0x6e, 0x67, 0x65, 0x12,
	0x14, 0x0a, 0x05, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x18, 0x04, 0x20, 0x01, 0x28, 0x03, 0x52, 0x05,
	0x73, 0x74, 0x61, 0x6d, 0x70, 0x12, 0x12, 0x0a, 0x04, 0x6b, 0x65, 0x79, 0x73, 0x18, 0x05, 0x20,
	0x03, 0x28, 0x09, 0x52, 0x04, 0x6b, 0x65, 0x79, 0x73, 0x22, 0x54, 0x0a, 0x07, 0x53, 0x65, 0x67,
	0x6d, 0x65, 0x6e, 0x74, 0x12, 0x1f, 0x0a, 0x0b, 0x63, 0x68, 0x61, 0x6e, 0x6e, 0x65, 0x6c, 0x5f,
	0x6b, 0x65, 0x79, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0a, 0x63, 0x68, 0x61, 0x6e, 0x6e,
	0x65, 0x6c, 0x4b, 0x65, 0x79, 0x12, 0x14, 0x0a, 0x05, 0x73, 0x74, 0x61, 0x72, 0x74, 0x18, 0x02,
	0x20, 0x01, 0x28, 0x03, 0x52, 0x05, 0x73, 0x74, 0x61, 0x72, 0x74, 0x12, 0x12, 0x0a, 0x04, 0x64,
	0x61, 0x74, 0x61, 0x18, 0x03, 0x20, 0x01, 0x28, 0x0c, 0x52, 0x04, 0x64, 0x61, 0x74, 0x61, 0x22,
	0xec, 0x01, 0x0a, 0x10, 0x49, 0x74, 0x65, 0x72, 0x61, 0x74, 0x6f, 0x72, 0x52, 0x65, 0x73, 0x70,
	0x6f, 0x6e, 0x73, 0x65, 0x12, 0x18, 0x0a, 0x07, 0x76, 0x61, 0x72, 0x69, 0x61, 0x6e, 0x74, 0x18,
	0x01, 0x20, 0x01, 0x28, 0x05, 0x52, 0x07, 0x76, 0x61, 0x72, 0x69, 0x61, 0x6e, 0x74, 0x12, 0x17,
	0x0a, 0x07, 0x6e, 0x6f, 0x64, 0x65, 0x5f, 0x69, 0x64, 0x18, 0x02, 0x20, 0x01, 0x28, 0x05, 0x52,
	0x06, 0x6e, 0x6f, 0x64, 0x65, 0x49, 0x64, 0x12, 0x10, 0x0a, 0x03, 0x61, 0x63, 0x6b, 0x18, 0x03,
	0x20, 0x01, 0x28, 0x08, 0x52, 0x03, 0x61, 0x63, 0x6b, 0x12, 0x18, 0x0a, 0x07, 0x63, 0x6f, 0x6d,
	0x6d, 0x61, 0x6e, 0x64, 0x18, 0x04, 0x20, 0x01, 0x28, 0x05, 0x52, 0x07, 0x63, 0x6f, 0x6d, 0x6d,
	0x61, 0x6e, 0x64, 0x12, 0x18, 0x0a, 0x07, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x65, 0x72, 0x18, 0x05,
	0x20, 0x01, 0x28, 0x05, 0x52, 0x07, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x65, 0x72, 0x12, 0x2e, 0x0a,
	0x05, 0x65, 0x72, 0x72, 0x6f, 0x72, 0x18, 0x06, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x18, 0x2e, 0x66,
	0x65, 0x72, 0x72, 0x6f, 0x72, 0x73, 0x2e, 0x76, 0x31, 0x2e, 0x45, 0x72, 0x72, 0x6f, 0x72, 0x50,
	0x61, 0x79, 0x6c, 0x6f, 0x61, 0x64, 0x52, 0x05, 0x65, 0x72, 0x72, 0x6f, 0x72, 0x12, 0x2f, 0x0a,
	0x08, 0x73, 0x65, 0x67, 0x6d, 0x65, 0x6e, 0x74, 0x73, 0x18, 0x07, 0x20, 0x03, 0x28, 0x0b, 0x32,
	0x13, 0x2e, 0x73, 0x65, 0x67, 0x6d, 0x65, 0x6e, 0x74, 0x2e, 0x76, 0x31, 0x2e, 0x53, 0x65, 0x67,
	0x6d, 0x65, 0x6e, 0x74, 0x52, 0x08, 0x73, 0x65, 0x67, 0x6d, 0x65, 0x6e, 0x74, 0x73, 0x22, 0x5d,
	0x0a, 0x0d, 0x57, 0x72, 0x69, 0x74, 0x65, 0x72, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12,
	0x1b, 0x0a, 0x09, 0x6f, 0x70, 0x65, 0x6e, 0x5f, 0x6b, 0x65, 0x79, 0x73, 0x18, 0x01, 0x20, 0x03,
	0x28, 0x09, 0x52, 0x08, 0x6f, 0x70, 0x65, 0x6e, 0x4b, 0x65, 0x79, 0x73, 0x12, 0x2f, 0x0a, 0x08,
	0x73, 0x65, 0x67, 0x6d, 0x65, 0x6e, 0x74, 0x73, 0x18, 0x02, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x13,
	0x2e, 0x73, 0x65, 0x67, 0x6d, 0x65, 0x6e, 0x74, 0x2e, 0x76, 0x31, 0x2e, 0x53, 0x65, 0x67, 0x6d,
	0x65, 0x6e, 0x74, 0x52, 0x08, 0x73, 0x65, 0x67, 0x6d, 0x65, 0x6e, 0x74, 0x73, 0x22, 0x40, 0x0a,
	0x0e, 0x57, 0x72, 0x69, 0x74, 0x65, 0x72, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12,
	0x2e, 0x0a, 0x05, 0x65, 0x72, 0x72, 0x6f, 0x72, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x18,
	0x2e, 0x66, 0x65, 0x72, 0x72, 0x6f, 0x72, 0x73, 0x2e, 0x76, 0x31, 0x2e, 0x45, 0x72, 0x72, 0x6f,
	0x72, 0x50, 0x61, 0x79, 0x6c, 0x6f, 0x61, 0x64, 0x52, 0x05, 0x65, 0x72, 0x72, 0x6f, 0x72, 0x22,
	0x33, 0x0a, 0x09, 0x54, 0x69, 0x6d, 0x65, 0x52, 0x61, 0x6e, 0x67, 0x65, 0x12, 0x14, 0x0a, 0x05,
	0x73, 0x74, 0x61, 0x72, 0x74, 0x18, 0x01, 0x20, 0x01, 0x28, 0x03, 0x52, 0x05, 0x73, 0x74, 0x61,
	0x72, 0x74, 0x12, 0x10, 0x0a, 0x03, 0x65, 0x6e, 0x64, 0x18, 0x02, 0x20, 0x01, 0x28, 0x03, 0x52,
	0x03, 0x65, 0x6e, 0x64, 0x32, 0x5d, 0x0a, 0x0f, 0x49, 0x74, 0x65, 0x72, 0x61, 0x74, 0x6f, 0x72,
	0x53, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x12, 0x4a, 0x0a, 0x07, 0x49, 0x74, 0x65, 0x72, 0x61,
	0x74, 0x65, 0x12, 0x1b, 0x2e, 0x73, 0x65, 0x67, 0x6d, 0x65, 0x6e, 0x74, 0x2e, 0x76, 0x31, 0x2e,
	0x49, 0x74, 0x65, 0x72, 0x61, 0x74, 0x6f, 0x72, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a,
	0x1c, 0x2e, 0x73, 0x65, 0x67, 0x6d, 0x65, 0x6e, 0x74, 0x2e, 0x76, 0x31, 0x2e, 0x49, 0x74, 0x65,
	0x72, 0x61, 0x74, 0x6f, 0x72, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x22, 0x00, 0x28,
	0x01, 0x30, 0x01, 0x32, 0x55, 0x0a, 0x0d, 0x57, 0x72, 0x69, 0x74, 0x65, 0x72, 0x53, 0x65, 0x72,
	0x76, 0x69, 0x63, 0x65, 0x12, 0x44, 0x0a, 0x05, 0x57, 0x72, 0x69, 0x74, 0x65, 0x12, 0x19, 0x2e,
	0x73, 0x65, 0x67, 0x6d, 0x65, 0x6e, 0x74, 0x2e, 0x76, 0x31, 0x2e, 0x57, 0x72, 0x69, 0x74, 0x65,
	0x72, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x1a, 0x2e, 0x73, 0x65, 0x67, 0x6d, 0x65,
	0x6e, 0x74, 0x2e, 0x76, 0x31, 0x2e, 0x57, 0x72, 0x69, 0x74, 0x65, 0x72, 0x52, 0x65, 0x73, 0x70,
	0x6f, 0x6e, 0x73, 0x65, 0x22, 0x00, 0x28, 0x01, 0x30, 0x01, 0x42, 0xbd, 0x01, 0x0a, 0x0e, 0x63,
	0x6f, 0x6d, 0x2e, 0x73, 0x65, 0x67, 0x6d, 0x65, 0x6e, 0x74, 0x2e, 0x76, 0x31, 0x42, 0x0c, 0x53,
	0x65, 0x67, 0x6d, 0x65, 0x6e, 0x74, 0x50, 0x72, 0x6f, 0x74, 0x6f, 0x50, 0x01, 0x5a, 0x54, 0x67,
	0x69, 0x74, 0x68, 0x75, 0x62, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x61, 0x72, 0x79, 0x61, 0x2d, 0x61,
	0x6e, 0x61, 0x6c, 0x79, 0x74, 0x69, 0x63, 0x73, 0x2f, 0x64, 0x65, 0x6c, 0x74, 0x61, 0x2f, 0x70,
	0x6b, 0x67, 0x2f, 0x64, 0x69, 0x73, 0x74, 0x72, 0x69, 0x62, 0x75, 0x74, 0x69, 0x6f, 0x6e, 0x2f,
	0x74, 0x72, 0x61, 0x6e, 0x73, 0x70, 0x6f, 0x72, 0x74, 0x2f, 0x67, 0x72, 0x70, 0x63, 0x2f, 0x73,
	0x65, 0x67, 0x6d, 0x65, 0x6e, 0x74, 0x2f, 0x76, 0x31, 0x3b, 0x73, 0x65, 0x67, 0x6d, 0x65, 0x6e,
	0x74, 0x76, 0x31, 0xa2, 0x02, 0x03, 0x53, 0x58, 0x58, 0xaa, 0x02, 0x0a, 0x53, 0x65, 0x67, 0x6d,
	0x65, 0x6e, 0x74, 0x2e, 0x56, 0x31, 0xca, 0x02, 0x0a, 0x53, 0x65, 0x67, 0x6d, 0x65, 0x6e, 0x74,
	0x5c, 0x56, 0x31, 0xe2, 0x02, 0x16, 0x53, 0x65, 0x67, 0x6d, 0x65, 0x6e, 0x74, 0x5c, 0x56, 0x31,
	0x5c, 0x47, 0x50, 0x42, 0x4d, 0x65, 0x74, 0x61, 0x64, 0x61, 0x74, 0x61, 0xea, 0x02, 0x0b, 0x53,
	0x65, 0x67, 0x6d, 0x65, 0x6e, 0x74, 0x3a, 0x3a, 0x56, 0x31, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74,
	0x6f, 0x33,
}

var (
	file_segment_v1_segment_proto_rawDescOnce sync.Once
	file_segment_v1_segment_proto_rawDescData = file_segment_v1_segment_proto_rawDesc
)

func file_segment_v1_segment_proto_rawDescGZIP() []byte {
	file_segment_v1_segment_proto_rawDescOnce.Do(func() {
		file_segment_v1_segment_proto_rawDescData = protoimpl.X.CompressGZIP(file_segment_v1_segment_proto_rawDescData)
	})
	return file_segment_v1_segment_proto_rawDescData
}

var file_segment_v1_segment_proto_msgTypes = make([]protoimpl.MessageInfo, 6)
var file_segment_v1_segment_proto_goTypes = []interface{}{
	(*IteratorRequest)(nil),  // 0: segment.v1.IteratorRequest
	(*Segment)(nil),          // 1: segment.v1.Segment
	(*IteratorResponse)(nil), // 2: segment.v1.IteratorResponse
	(*WriterRequest)(nil),    // 3: segment.v1.WriterRequest
	(*WriterResponse)(nil),   // 4: segment.v1.WriterResponse
	(*TimeRange)(nil),        // 5: segment.v1.TimeRange
	(*v1.ErrorPayload)(nil),  // 6: ferrors.v1.ErrorPayload
}
var file_segment_v1_segment_proto_depIdxs = []int32{
	5, // 0: segment.v1.IteratorRequest.range:type_name -> segment.v1.TimeRange
	6, // 1: segment.v1.IteratorResponse.error:type_name -> ferrors.v1.ErrorPayload
	1, // 2: segment.v1.IteratorResponse.segments:type_name -> segment.v1.Segment
	1, // 3: segment.v1.WriterRequest.segments:type_name -> segment.v1.Segment
	6, // 4: segment.v1.WriterResponse.error:type_name -> ferrors.v1.ErrorPayload
	0, // 5: segment.v1.IteratorService.Iterate:input_type -> segment.v1.IteratorRequest
	3, // 6: segment.v1.WriterService.Write:input_type -> segment.v1.WriterRequest
	2, // 7: segment.v1.IteratorService.Iterate:output_type -> segment.v1.IteratorResponse
	4, // 8: segment.v1.WriterService.Write:output_type -> segment.v1.WriterResponse
	7, // [7:9] is the sub-list for method output_type
	5, // [5:7] is the sub-list for method input_type
	5, // [5:5] is the sub-list for extension type_name
	5, // [5:5] is the sub-list for extension extendee
	0, // [0:5] is the sub-list for field type_name
}

func init() { file_segment_v1_segment_proto_init() }
func file_segment_v1_segment_proto_init() {
	if File_segment_v1_segment_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_segment_v1_segment_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*IteratorRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_segment_v1_segment_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Segment); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_segment_v1_segment_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*IteratorResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_segment_v1_segment_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*WriterRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_segment_v1_segment_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*WriterResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_segment_v1_segment_proto_msgTypes[5].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*TimeRange); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_segment_v1_segment_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   6,
			NumExtensions: 0,
			NumServices:   2,
		},
		GoTypes:           file_segment_v1_segment_proto_goTypes,
		DependencyIndexes: file_segment_v1_segment_proto_depIdxs,
		MessageInfos:      file_segment_v1_segment_proto_msgTypes,
	}.Build()
	File_segment_v1_segment_proto = out.File
	file_segment_v1_segment_proto_rawDesc = nil
	file_segment_v1_segment_proto_goTypes = nil
	file_segment_v1_segment_proto_depIdxs = nil
}