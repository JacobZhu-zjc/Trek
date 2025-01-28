import {IconInfoCircle} from "@tabler/icons-react";
import {Alert} from "@mantine/core";
import {ReactNode} from "react";

export default function Failure({msg}: { msg?: ReactNode }) {
    return (
        <Alert mt="lg" icon={<IconInfoCircle/>} color={"red"}>{msg ?? "Something went wrong!"}</Alert>
    );
}
