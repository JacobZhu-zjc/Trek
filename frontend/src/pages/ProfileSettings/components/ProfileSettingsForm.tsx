import { Button, Group, TextInput, Textarea, Title, TagsInput, Container } from '@mantine/core';
import { useForm } from '@mantine/form';


const ProfileSettingsForm = () => {


    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: 'Gregor Kiczales',
            bio: 'Father of all CS students at UBC.',
            home: 'Vancouver, BC',
            currentlyAt: '',
            facebook: '',
            instagram: '',
            twitter: '',
            youtube: '',
        },
    });

    return (
        <>
            <form onSubmit={form.onSubmit((values) => console.log(values))}>

                <Container px={0} mb={'50px'} mr={'50px'}>
                    <Title order={4} mb={'15px'}>Basic Information</Title>

                    <TextInput
                        label="Name"
                        placeholder="Your beautiful name"
                        key={form.key('name')}
                        {...form.getInputProps('name')}
                    />

                    <TextInput
                        label="Home"
                        placeholder="Alabama, USA"
                        key={form.key('home')}
                        {...form.getInputProps('home')}
                    />

                    <TextInput
                        label="Currently At"
                        placeholder="Far Far Away"
                        key={form.key('currentlyAt')}
                        {...form.getInputProps('currentlyAt')}
                    />

                    <Textarea
                        label="Bio"
                        key={form.key('bio')}
                        {...form.getInputProps('bio')}
                        placeholder="Tell us a little about yourself"
                    />

                    <TagsInput
                        label="Interests"
                        description="This is only used to show your interests to other users."
                        placeholder="Add your travel preferences"
                        data={['Island', 'BC', 'Ocean', 'Mountains', 'Hiking']}
                    />
                </Container>

                <Container px={0} mb={'50px'}>
                    <Title order={4} mb={'15px'}>Link Social Accounts</Title>
                    <TextInput
                        label="Facebook"
                        placeholder="facebook.com/username"
                        key={form.key('facebook')}
                        {...form.getInputProps('facebook')}
                    />
                    <TextInput
                        label="Instagram"
                        placeholder="instagram.com/username"
                        key={form.key('instagram')}
                        {...form.getInputProps('instagram')}
                    />
                    <TextInput
                        label="Twitter"
                        placeholder="twitter.com/username"
                        key={form.key('twitter')}
                        {...form.getInputProps('twitter')}
                    />
                    <TextInput
                        label="YouTube"
                        placeholder="youtube.com/username"
                        key={form.key('youtube')}
                        {...form.getInputProps('youtube')}
                    />

                </Container>



                <Group justify="flex-end" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>



        </>
    )
}


export default ProfileSettingsForm;