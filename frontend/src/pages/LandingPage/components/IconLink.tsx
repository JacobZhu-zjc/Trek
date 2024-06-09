import {ActionIcon} from "@mantine/core";
import React, {ElementType} from "react";

interface IconLinkProps {
	href: string,
	LinkIcon: ElementType
}

const IconLink: React.FC<IconLinkProps> = ({ href, LinkIcon }) => {
	return (
		<div className="p-1">
			<ActionIcon
				color="teal"
				component="a"
				href={href}
				target="_blank"
				rel="noopener noreferrer"
			>
				<LinkIcon />
			</ActionIcon>
		</div>

	);
}

export default IconLink;