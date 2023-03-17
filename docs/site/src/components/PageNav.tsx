// Copyright 2023 Synnax Labs, Inc.
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.

import { useEffect, useState } from "react";

import { Icon } from "@synnaxlabs/media";
import { Button, Dropdown, Tree, TreeLeaf } from "@synnaxlabs/pluto";

import { pages } from "@/pages/nav";

export type PageNavLeaf = TreeLeaf;

export interface TOCProps {
  currentPage: string;
}

export const useDocumentSize = (): number | null => {
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    const handleResize = () => {
      setWidth(document.documentElement.clientWidth);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

export const PageNav = ({ currentPage }: TOCProps): JSX.Element | null => {
  const width = useDocumentSize();
  const { visible, toggle } = Dropdown.use(false);
  const tree = <Tree data={pages} value={[currentPage]} />;
  if (width == null) return null;
  if (width > 600) return tree;
  return (
    <Dropdown visible={visible} bordered={false} location="top">
      <Button
        justify="end"
        startIcon={<Icon.Menu />}
        variant="text"
        onClick={() => toggle(!visible)}
        size="large"
      />
      {tree}
    </Dropdown>
  );
};
