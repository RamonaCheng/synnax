package task_test

import (
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	"github.com/synnaxlabs/synnax/pkg/distribution/core"
	"github.com/synnaxlabs/synnax/pkg/distribution/core/mock"
	"github.com/synnaxlabs/synnax/pkg/distribution/ontology"
	"github.com/synnaxlabs/synnax/pkg/distribution/ontology/group"
	"github.com/synnaxlabs/synnax/pkg/hardware/rack"
	"github.com/synnaxlabs/synnax/pkg/hardware/task"
	"github.com/synnaxlabs/x/gorp"
	"github.com/synnaxlabs/x/kv/memkv"
	"github.com/synnaxlabs/x/query"
	. "github.com/synnaxlabs/x/testutil"
)

var _ = Describe("Task", Ordered, func() {
	var (
		db    *gorp.DB
		svc   *task.Service
		w     task.Writer
		tx    gorp.Tx
		rack_ *rack.Rack
	)
	BeforeAll(func() {
		db = gorp.Wrap(memkv.New())
		otg := MustSucceed(ontology.Open(ctx, ontology.Config{DB: db}))
		g := MustSucceed(group.OpenService(group.Config{DB: db, Ontology: otg}))
		rackSvc := MustSucceed(rack.OpenService(ctx, rack.Config{DB: db, Ontology: otg, Group: g, HostProvider: mock.StaticHostKeyProvider(1)}))
		svc = MustSucceed(task.OpenService(ctx, task.Config{
			DB:           db,
			Ontology:     otg,
			Group:        g,
			Rack:         rackSvc,
			HostProvider: mock.StaticHostKeyProvider(1),
		}))
		rack_ = &rack.Rack{Name: "Test Rack"}
		Expect(rackSvc.NewWriter(db).Create(ctx, rack_)).To(Succeed())
	})
	BeforeEach(func() {
		tx = db.OpenTx()
		w = svc.NewWriter(tx)
	})
	AfterEach(func() {
		Expect(tx.Close()).To(Succeed())
	})
	AfterAll(func() {
		Expect(db.Close()).To(Succeed())
		Expect(svc.Close()).To(Succeed())
	})
	Describe("Key", func() {
		It("Should construct and deconstruct a key from its components", func() {
			rk := rack.NewKey(core.NodeKey(1), 2)
			k := task.NewKey(rk, 2)
			Expect(k.Rack()).To(Equal(rk))
			Expect(k.LocalKey()).To(Equal(uint32(2)))
		})
	})
	Describe("Create", func() {
		It("Should correctly create a module and assign it a unique key", func() {
			m := &task.Task{
				Key:  task.NewKey(rack_.Key, 0),
				Name: "Test Task",
			}
			Expect(w.Create(ctx, m)).To(Succeed())
			Expect(m.Key).To(Equal(task.NewKey(rack_.Key, 1)))
			Expect(m.Name).To(Equal("Test Task"))
		})
		It("Should correctly increment the module count", func() {
			m := &task.Task{
				Key:  task.NewKey(rack_.Key, 0),
				Name: "Test Task",
			}
			Expect(w.Create(ctx, m)).To(Succeed())
			Expect(m.Key).To(Equal(task.NewKey(rack_.Key, 1)))
			Expect(m.Name).To(Equal("Test Task"))
			m = &task.Task{
				Key:  task.NewKey(rack_.Key, 0),
				Name: "Test Task",
			}
			Expect(w.Create(ctx, m)).To(Succeed())
			Expect(m.Key).To(Equal(task.NewKey(rack_.Key, 2)))
			Expect(m.Name).To(Equal("Test Task"))
		})
	})
	Describe("Retrieve", func() {
		It("Should correctly retrieve a module", func() {
			m := &task.Task{
				Key:  task.NewKey(rack_.Key, 0),
				Name: "Test Task",
			}
			Expect(w.Create(ctx, m)).To(Succeed())
			Expect(m.Key).To(Equal(task.NewKey(rack_.Key, 1)))
			Expect(m.Name).To(Equal("Test Task"))
			var res task.Task
			Expect(svc.NewRetrieve().WhereKeys(m.Key).Entry(&res).Exec(ctx, tx)).To(Succeed())
			Expect(res).To(Equal(*m))
		})
	})
	Describe("Delete", func() {
		It("Should correctly delete a module", func() {
			m := &task.Task{
				Key:  task.NewKey(rack_.Key, 0),
				Name: "Test Task",
			}
			Expect(w.Create(ctx, m)).To(Succeed())
			Expect(m.Key).To(Equal(task.NewKey(rack_.Key, 1)))
			Expect(m.Name).To(Equal("Test Task"))
			Expect(w.Delete(ctx, m.Key)).To(Succeed())
			Expect(svc.NewRetrieve().WhereKeys(m.Key).Exec(ctx, tx)).To(MatchError(query.NotFound))
		})
	})
})