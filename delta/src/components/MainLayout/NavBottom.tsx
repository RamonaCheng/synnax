import { ActiveClusterBadge, ActiveConnectionBadge } from "@/features/cluster";
import { Nav, Divider, Text } from "@synnaxlabs/pluto";
import { getVersion } from "@tauri-apps/api/app";
import { useEffect, useState } from "react";
import "./NavBottom.css";

export const NavBottom = () => {
	const [version, setVersion] = useState<string>("");
	useEffect(() => {
		getVersion().then((v) => setVersion("v" + v));
	}, []);
	return (
		<Nav.Bar location="bottom" size={32}>
			<Nav.Bar.End className="delta-main-layout__nav-bottom__end">
				<Divider direction="vertical" />
				<Text level="p">{version}</Text>
				<Divider direction="vertical" />
				<ActiveClusterBadge />
				<Divider direction="vertical" />
				<ActiveConnectionBadge />
			</Nav.Bar.End>
		</Nav.Bar>
	);
};