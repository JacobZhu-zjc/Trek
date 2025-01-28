import {useForm} from '@mantine/form';
import {
    Select,
    MultiSelect,
    NumberInput,
    Textarea,
    Button,
    Title,
    Text,
    Stack,
    RangeSlider,
    Checkbox,
    Box
} from '@mantine/core';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../../redux/store.ts";
import {useAuth0} from "@auth0/auth0-react";
import {useEffect, useState} from "react";
import {getAuthdUserAsync, putUserExperienceAsync} from "../../../redux/users/thunks.ts";
import {UserExperience} from "@trek-types/user.ts";
import {State} from "@trek-types/redux.ts";
import Success from '@components/alerts/Success.tsx';
import Failure from '@components/alerts/Failure.tsx';

interface ExperienceForm extends UserExperience {
    budgetAccommodation: [number, number]
    budgetActivities: [number, number]
    budgetDining: [number, number]
}

const ExperienceSettingsForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {user, getAccessTokenSilently, isAuthenticated} = useAuth0()
    const [subtoken, setSubToken] = useState("");
    const [success, setSuccess] = useState<boolean | null>(null);
    if (user && user.sub && subtoken !== user.sub) {
        setSubToken(user?.sub);
    }

    useEffect(() => {
        try {
            (async () => {
                try {
                    if (isAuthenticated) {
                        const token = await getAccessTokenSilently();
                        const name = user?.name ?? "";
                        const email = user?.email ?? "";
                        const picture = user?.picture ?? "";
                        dispatch(getAuthdUserAsync({token, subtoken, name, email, picture}));
                    }

                } catch (err) {
                    console.error("access token error occurred: " + err);
                }
            })();
        } catch (err) {
            console.error("Error occurred: " + err);
        }
    }, [dispatch, getAccessTokenSilently, subtoken]);

    const profile = useSelector((state: State) => state.user.self);
    const [exp, setExp] = useState<ExperienceForm>({
        accommodationBudget: {lo: 0, hi: 1000},
        activities: [],
        activitiesBudget: {lo: 0, hi: 1000},
        ageRange: 18,
        climateAndWeather: [],
        connectivityNeeds: "",
        culture: [],
        dining: [],
        diningBudget: {lo: 0, hi: 1000},
        healthAndAccessibility: "",
        language: "",
        occupation: "",
        passports: [],
        safety: "",
        tosAgreement: false,
        transportPreferences: [],
        travelFrequency: "",
        travelStyle: [],
        tripDuration: "",
        visas: [],
        budgetActivities: [0, 1000],
        budgetAccommodation: [0, 1000],
        budgetDining: [0, 1000]
    });
    useEffect(() => {
        if (profile && profile.experience) {
            const accommodation = profile.experience.accommodationBudget;
            const activities = profile.experience.activitiesBudget;
            const dining = profile.experience.diningBudget;
            const experienceSettings: ExperienceForm = {
                ...profile.experience,
                budgetAccommodation: [accommodation.lo, accommodation.hi],
                budgetActivities: [activities.lo, activities.hi],
                budgetDining: [dining.lo, dining.hi]
            };
            form.setValues(experienceSettings);
            setExp(experienceSettings);
        }
    }, [profile]);
    const form = useForm({
        initialValues: {
            travelFrequency: exp.travelFrequency,
            ageRange: exp.ageRange,
            occupation: exp.occupation,
            passports: exp.passports,
            visas: exp.visas,
            connectivityNeeds: exp.connectivityNeeds,
            activities: exp.activities,
            dining: exp.dining,
            climateAndWeather: exp.climateAndWeather,
            culture: exp.culture,
            language: exp.language,
            healthAndAccessibility: exp.healthAndAccessibility,
            safety: exp.safety,
            travelStyle: exp.travelStyle,
            tripDuration: exp.tripDuration,
            transportPreferences: exp.transportPreferences,
            budgetAccommodation: [exp.accommodationBudget.lo, exp.accommodationBudget.hi] as [number, number], // [0, 1000]
            budgetDining: [exp.diningBudget.lo, exp.diningBudget.hi] as [number, number], // [0, 1000]
            budgetActivities: [exp.activitiesBudget.lo, exp.activitiesBudget.hi] as [number, number], // [0, 1000]
            tosAgreement: exp.tosAgreement,
        },
    });

    async function handleSubmit(values: typeof form.values) {
        const token = await getAccessTokenSilently();
        const experience: UserExperience = {
            travelFrequency: values.travelFrequency,
            ageRange: values.ageRange,
            occupation: values.occupation,
            passports: values.passports,
            visas: values.visas,
            connectivityNeeds: values.connectivityNeeds,
            activities: values.activities,
            dining: values.dining,
            climateAndWeather: values.climateAndWeather,
            culture: values.culture,
            language: values.language,
            healthAndAccessibility: values.healthAndAccessibility,
            safety: values.safety,
            travelStyle: values.travelStyle,
            tripDuration: values.tripDuration,
            transportPreferences: values.transportPreferences,
            accommodationBudget: {lo: values.budgetAccommodation[0], hi: values.budgetAccommodation[1]},
            diningBudget: {lo: values.budgetDining[0], hi: values.budgetDining[1]},
            activitiesBudget: {lo: values.budgetDining[0], hi: values.budgetActivities[1]},
            tosAgreement: values.tosAgreement,
        };
        window.scrollTo(0, 0);
        setSuccess(null);
        dispatch(putUserExperienceAsync({token: token, exp: experience})).unwrap()
            .then(() => setSuccess(true))
            .catch(() => setSuccess(false));
    }

    return (
        <>
            <Box mt="lg"></Box>
            {success && <Success/>}
            {success === false && <Failure/>}
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack
                    bg="var(--mantine-color-body)"
                    align="flex-start"
                    justify="flex-start"
                    gap="xs"
                >
                    <Title order={4} mt="lg">General Tripper Preferences</Title>
                    <Select
                        label="Travel Frequency"
                        placeholder="Select your travel frequency"
                        data={['Less than once a year', 'Once a year', '2-4 times a year', '5-10 times a year', 'I live on the road!']}
                        {...form.getInputProps('travelFrequency')}
                    />

                    <NumberInput
                        label="Age Range"
                        placeholder="Enter your age"
                        min={18}
                        max={100}
                        {...form.getInputProps('ageRange')}
                    />

                    <Select
                        label="Occupation"
                        placeholder="Select your occupation"
                        data={['Student', 'Employed', 'Self-Employed', 'Retired', 'Unemployed']}
                        {...form.getInputProps('occupation')}
                    />

                    <MultiSelect
                        label="Passports"
                        placeholder="Select passports you have"
                        data={['USA', 'Canada', 'UK', 'Australia', 'Others']}
                        {...form.getInputProps('passports')}
                    />

                    <MultiSelect
                        label="Visas"
                        placeholder="Select visas you have"
                        data={['USA', 'Canada', 'UK', 'Schengen', 'Others']}
                        {...form.getInputProps('visas')}
                    />

                    <Select
                        label="Work and Connectivity Needs"
                        placeholder="Select connectivity needs"
                        data={[
                            {value: 'No connectivity needed', label: 'No connectivity needed'},
                            {value: 'Occasional connectivity', label: 'Occasional connectivity'},
                            {value: 'Frequent connectivity', label: 'Frequent connectivity'},
                            {value: 'High connectivity', label: 'High connectivity'},
                        ]}
                        {...form.getInputProps('connectivityNeeds')}
                    />


                    <Title order={4} mt="lg">Activities and Interests</Title>
                    <MultiSelect
                        label="Activities"
                        placeholder="Select activities you enjoy"
                        data={['Hiking', 'Cultural tours', 'Beach lounging', 'Adventure sports']}
                        {...form.getInputProps('activities')}
                    />

                    <MultiSelect
                        label="Dining"
                        placeholder="Select dining preferences"
                        data={['Fine dining', 'Local cuisine', 'Street food', 'Vegetarian/vegan']}
                        {...form.getInputProps('dining')}
                    />

                    <MultiSelect
                        label="Climate and Weather"
                        placeholder="Select preferred weather"
                        data={['Sunny', 'Cold', 'Mild']}
                        {...form.getInputProps('climateAndWeather')}
                    />

                    <MultiSelect
                        label="Culture"
                        placeholder="Select cultural experiences"
                        data={['Museums', 'Historical sites', 'Local festivals']}
                        {...form.getInputProps('culture')}
                    />

                    <Select
                        label="Language"
                        placeholder="Select language comfort"
                        data={['Comfortable with different languages', 'Prefer English-speaking countries']}
                        {...form.getInputProps('language')}
                    />

                    <Textarea
                        label="Health and Accessibility"
                        placeholder="Describe any health or accessibility needs"
                        {...form.getInputProps('healthAndAccessibility')}
                        radius="lg"
                    />

                    <Textarea
                        label="Safety"
                        placeholder="Describe any safety concerns or preferences"
                        {...form.getInputProps('safety')}
                        radius="lg"
                    />

                    <Title order={4} mt="lg">Travel Style and Budget</Title>
                    <MultiSelect
                        label="Travel Style"
                        placeholder="Select your travel style"
                        data={['Luxury', 'Budget', 'Family-friendly', 'Relaxed', 'Solo travel', 'Couples']}
                        {...form.getInputProps('travelStyle')}
                    />

                    <Select
                        label="Duration of Trips"
                        placeholder="Select typical duration of trips"
                        data={['Weekend getaways', 'One week', 'Two weeks', 'One month']}
                        {...form.getInputProps('tripDuration')}
                    />

                    <MultiSelect
                        label="Transport Preferences"
                        placeholder="Select preferred modes of transport"
                        data={['Flights', 'Trains', 'Road trips']}
                        {...form.getInputProps('transportPreferences')}
                    />
                </Stack>
                <Box style={{width: 500}}>
                    <Title order={6} mt="lg">Accommodation Budget Range</Title>
                    <Text c="dimmed">How much do you typically spend on accomodations per night?</Text>
                    <RangeSlider
                        min={0}
                        max={1000}
                        marks={[
                            {value: 0, label: '$0'},
                            {value: 1000, label: '$1000'},
                        ]}
                        value={exp.budgetAccommodation}
                        onChange={(value) => {
                            form.setFieldValue('budgetAccommodation', value);
                            setExp({...exp, budgetAccommodation: value});
                        }}
                        label={(value) => `$${value}`}
                    />
                    <Title order={6} mt="lg">Dining Budget Range</Title>
                    <Text c="dimmed">How much do you typically spend on dining per day?</Text>
                    <RangeSlider
                        min={0}
                        max={1000}
                        marks={[
                            {value: 0, label: '$0'},
                            {value: 1000, label: '$1000'},
                        ]}
                        value={exp.budgetDining}
                        onChange={(value) => {
                            form.setFieldValue('budgetDining', value);
                            setExp({...exp, budgetDining: value});
                        }}
                        label={(value) => `$${value}`}
                    />

                    <Title order={6} mt="lg">Activities Budget Range</Title>
                    <Text c="dimmed">How much do you typically spend on activities per day?</Text>
                    <RangeSlider
                        min={0}
                        max={1000}
                        marks={[
                            {value: 0, label: '$0'},
                            {value: 1000, label: '$1000'},
                        ]}
                        value={exp.budgetActivities}
                        onChange={(value) => {
                            form.setFieldValue('budgetActivities', value);
                            setExp({...exp, budgetActivities: value});
                        }}
                        label={(value) => `$${value}`}
                    />
                </Box>


                <Box style={{width: 600}}>

                    <Title order={4} mt="xl" mb={2}>Terms of Service</Title>

                    <Text c="dimmed">Trek uses advanced ML/AI technologies and third-party APIs to analyze your
                        preferences and provide tailored travel recommendations and enhance your trip planning
                        experience</Text>


                    <Checkbox
                        mt="md"
                        label="I agree to the use of my preferences for personalized experiences and recommendations"
                        key={form.key('tosAgreement')}
                        checked={exp.tosAgreement}
                        {...form.getInputProps('tosAgreement', {type: 'checkbox'})}
                    />
                </Box>

                <Button type="submit" mt="xl">Submit</Button>
            </form>

        </>
    );
};

export default ExperienceSettingsForm;
