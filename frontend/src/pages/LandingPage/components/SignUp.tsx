import {TextInput, Button} from '@mantine/core';
import { IconArrowRight } from "@tabler/icons-react";

const SignUp = () => {
	return (
		<div className="flex justify-center w-full">

				<TextInput
					className="w-96 pr-4"
					placeholder="Your email address"
				/>
				<Button
					rightSection={<IconArrowRight size={16}/>}
					variant="gradient"
					gradient={{ from: 'teal', to: 'lime', deg: 90 }}
				>
					Sign Up
				</Button>
		</div>

	);
}

export default SignUp;