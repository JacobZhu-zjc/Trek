import {IconInfoCircle} from "@tabler/icons-react";
import {Alert} from "@mantine/core";
import {ReactNode} from "react";

export default function Success({msg}: { msg?: ReactNode }) {
    return (
        <Alert icon={<IconInfoCircle/>} color={"green"}>{msg ?? "Successfully updated!"}</Alert>
    );
}
