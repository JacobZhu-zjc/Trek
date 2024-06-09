import SignUp from './components/SignUp';

const SignUpContactPage = () => {
	return (
		<>
			<div className="flex flex-col w-full pt-24 pb-52 items-center">
				<h1 className="text-6xl font-bold py-5">
					Convinced? Get started now.
				</h1>
				<SignUp/>
			</div>
		</>
	);
}

export default SignUpContactPage;