package cert_test

import (
	"testing"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

func TestCert(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "Cert Suite")
}
