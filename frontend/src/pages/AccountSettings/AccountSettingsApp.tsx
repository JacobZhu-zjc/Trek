import { Text, Divider, Flex, Stack, Title } from '@mantine/core';
import EmailNotificationToggles from './components/EmailNotificationToggles';
import { AccountProfileCard } from './components/AccountProfileCard';
import DeleteAccountCard from './components/DeleteAccountCard';


const AccountSettings = () => {


  return (
    <>
      <Stack
        align="flex-start"
        justify="flex-start"
        gap="md"
        p={'20px'}
      >
        <Title order={2}>Account Settings</Title>




        <Flex
          justify="flex-start"
          gap={'xl'}
          align="flex-start"
          direction="row"
          wrap="wrap"
          mt={'50px'}>



          <AccountProfileCard />

          <EmailNotificationToggles />

        </Flex>

        <Divider
          my="xs"
          color='red'
          label={
            <Text c="red">DANGER ZONE</Text>
          }
          labelPosition="center"
          style={{ width: "100%" }}
          mt={"15%"} />

        <DeleteAccountCard />


      </Stack>


    </>
  )
}

export default AccountSettings;