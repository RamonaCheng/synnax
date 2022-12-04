package fgrpc

import (
	"context"
	"github.com/synnaxlabs/freighter"
	"github.com/synnaxlabs/x/address"
	"google.golang.org/grpc/metadata"
)

func parseMetaData(ctx context.Context, serviceName string) freighter.MD {
	grpcMD, ok := metadata.FromIncomingContext(ctx)
	md := freighter.MD{
		Target:   address.Address(serviceName),
		Protocol: reporter.Protocol,
		Params:   make(freighter.Params),
	}
	if ok {
		for k, v := range grpcMD {
			md.Params[k] = v
		}
	}
	return md
}

func attachMetaData(ctx context.Context, md freighter.MD) {
	var toAppend []string
	for k, v := range md.Params {
		if vStr, ok := v.(string); ok {
			toAppend = append(toAppend, k, vStr)
		}
	}
	metadata.AppendToOutgoingContext(ctx, toAppend...)
}