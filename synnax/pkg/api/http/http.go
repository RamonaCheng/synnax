package http

import (
	"go/types"

	"github.com/synnaxlabs/freighter/fhttp"
	"github.com/synnaxlabs/synnax/pkg/api"
	"github.com/synnaxlabs/synnax/pkg/auth"
)

func New(router *fhttp.Router) (a api.Transport) {
	a.AuthLogin = fhttp.UnaryPostServer[auth.InsecureCredentials, api.TokenResponse](router, "/api/v1/auth/login")
	a.AuthRegistration = fhttp.UnaryPostServer[api.RegistrationRequest, api.TokenResponse](router, "/api/v1/auth/register")
	a.AuthChangePassword = fhttp.UnaryPostServer[api.ChangePasswordRequest, types.Nil](router, "/api/v1/auth/protected/change-password")
	a.AuthChangeUsername = fhttp.UnaryPostServer[api.ChangeUsernameRequest, types.Nil](router, "/api/v1/auth/protected/change-username")
	a.ChannelCreate = fhttp.UnaryPostServer[api.ChannelCreateRequest, api.ChannelCreateResponse](router, "/api/v1/channel/create")
	a.ChannelRetrieve = fhttp.UnaryGetServer[api.ChannelRetrieveRequest, api.ChannelRetrieveResponse](router, "/api/v1/channel/retrieve")
	a.ConnectivityCheck = fhttp.UnaryGetServer[types.Nil, api.ConnectivityCheckResponse](router, "/api/v1/connectivity/check")
	a.FrameWriter = fhttp.StreamServer[api.FrameWriterRequest, api.FrameWriterResponse](router, "/api/v1/frame/write")
	a.FrameReader = fhttp.StreamServer[api.FrameIteratorRequest, api.FrameIteratorResponse](router, "/api/v1/frame/iterate")
	a.OntologyRetrieve = fhttp.UnaryGetServer[api.OntologyRetrieveRequest, api.OntologyRetrieveResponse](router, "/api/v1/ontology/retrieve")
	return a
}