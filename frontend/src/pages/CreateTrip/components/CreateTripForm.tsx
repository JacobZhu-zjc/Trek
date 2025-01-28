import {useContext, useEffect, useState} from 'react';
import {
    Button,
    Checkbox,
    Group,
    Loader,
    NativeSelect,
    rem,
    Stepper,
    Text,
    TextInput,
    UnstyledButton
} from '@mantine/core';
import {useForm} from '@mantine/form';
import classes from './CreateTripForm.module.css';
import {AreaSearchBox} from '@components/destination-search-boxes/AreaSearchBox';
import {Feature} from 'geojson';
import useLazyDestinationQuery from '../../../hooks/DestinationSearch';
import {useDispatch, useSelector} from 'react-redux';
import {useAuth0} from '@auth0/auth0-react';
import {UserContext} from '../../../App';
import {createTripAsync} from '../../../redux/trips/thunks';
import {AppDispatch} from '../../../redux/store';
import {State} from '@trek-types/redux';
import {useNavigate} from 'react-router-dom';

function CreateTripForm() {
    const dispatch = useDispatch<AppDispatch>();
    const {isAuthenticated} = useAuth0();
    const userContext = useContext(UserContext);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            startLocationOsmId: '',
            startLocationOsmType: '',
            destinationLocationOsmId: '',
            destinationLocationOsmType: '',
            isMaxBudget: true,
            maxBudget: '',
            tripName: '',
            tripShareToEmails: [],
        },

        validate: (values) => {


            if (active === 0) {

                return {
                    startLocationOsmId: values.startLocationOsmId.length < 1 ? 'Start location is required' : null,
                    destinationLocationOsmId: values.destinationLocationOsmId.length < 1 ? 'Destination location is required' : null,
                };
            }

            if (active === 1) {
                if (values.isMaxBudget) {
                    return {
                        maxBudget: values.maxBudget.length < 1 ? 'To disable maximum budget, uncheck the checkbox.' : null,
                    };
                }
            }


            if (active === 2) {
                return {
                    tripName: values.tripName.trim().length < 2 ? 'Trip Name must include at least 2 characters' : null,
                    tripShareToEmails: (Array.isArray(values.tripShareToEmails) && values.tripShareToEmails.every((email) => /^\S+@\S+$/.test(email)))
                        ? null : 'Invalid email(s) in the list'
                };
            }

            return {};
        },
    });

    const [active, setActive] = useState(0);

    const nextStep = () => {
        setActive((current) => {
            if (form.validate().hasErrors) {
                if (form.validate().errors.startLocationOsmId) {
                    setStartLocationError(form.validate().errors.startLocationOsmId as string);
                } else {
                    setStartLocationError(null);
                }
                if (form.validate().errors.destinationLocationOsmId) {
                    setDestinationLocationError(form.validate().errors.destinationLocationOsmId as string);
                } else {
                    setDestinationLocationError(null);
                }
                return current;
            }
            setStartLocationError(null);
            setDestinationLocationError(null);
            return current < 3 ? current + 1 : current;
        })
    };

    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));


    /** Start Location Setting */
    const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
    const [startLocationError, setStartLocationError] = useState<string | null>(null);

    useEffect(() => {
        form.setFieldValue('startLocationOsmId', selectedFeature?.properties?.osm_id || '');
        form.setFieldValue('startLocationOsmType', selectedFeature?.properties?.osm_type || '');
    }, [selectedFeature, form]);

    useEffect(() => {
        setStartLocationError(null);
    }, [selectedFeature]);

    /** Destination Location Setting */
    const [selectedFeatureDestination, setSelectedFeatureDestination] = useState<Feature | null>(null);
    const [destinationLocationError, setDestinationLocationError] = useState<string | null>(null);

    useEffect(() => {
        form.setFieldValue('destinationLocationOsmId', selectedFeatureDestination?.properties?.osm_id || '');
        form.setFieldValue('destinationLocationOsmType', selectedFeatureDestination?.properties?.osm_type || '');
    }, [selectedFeatureDestination, form]);

    useEffect(() => {
        setDestinationLocationError(null);
    }, [selectedFeatureDestination]);


    /** Budget Input Handling */
    const [checked, setChecked] = useState(form.getValues().isMaxBudget);

    useEffect(() => {
        if (!checked) {
            form.setFieldValue('maxBudget', '');
        }
        form.setFieldValue('isMaxBudget', checked);
    }, [checked, form]);

    const currency = [
        {value: 'cad', label: '🇨🇦 CAD'},
        {value: 'eur', label: '🇪🇺 EUR'},
        {value: 'usd', label: '🇺🇸 USD'},
        {value: 'gbp', label: '🇬🇧 GBP'},
        {value: 'aud', label: '🇦🇺 AUD'},
    ];
    const currencySelect = (
        <NativeSelect
            data={currency}
            rightSectionWidth={28}
            styles={{
                input: {
                    fontWeight: 500,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    width: rem(92),
                    marginRight: rem(-2),
                },
            }}
        />
    );

    const {trigger} = useLazyDestinationQuery();

    useEffect(() => {
        trigger();
    }, [checked, trigger]);


    async function handleSubmit() {
        const payload = form.getValues();
        if (isAuthenticated) {
            dispatch(createTripAsync({token: userContext.token, data: payload}));
        }
    }

    const navigate = useNavigate();
    const uuid = useSelector((state: State) => state.trip.current?._id);
    const [pending, setPending] = useState(false);
    const status = useSelector((state: State) => state.trip.status);
    useEffect(() => {
        if (status === 'pending') setPending(true);
        if (status === 'idle' && pending === true) { // check that it WAS pending so it doesnt redirect immediately after loading
            setPending(false);
            navigate(`/trip/${uuid}/overview`);
        }
    }, [status])

    return (
        <>
            <Stepper active={active} color={"lime"} styles={{content: {paddingTop: 50, width: "80%", margin: "auto"}}}>
                <Stepper.Step label="Trip Locations" description="Where are you going?">
                    <AreaSearchBox label="Start Location" placeholder="" description="Where are you starting your trip?"
                                   selectedFeature={selectedFeature} setSelectedFeature={setSelectedFeature}
                                   errorMsg={startLocationError}/>
                    <AreaSearchBox label="Destination" placeholder=""
                                   description="If you have multiple destinations you can add them later"
                                   selectedFeature={selectedFeatureDestination}
                                   setSelectedFeature={setSelectedFeatureDestination}
                                   errorMsg={destinationLocationError}/>
                </Stepper.Step>

                <Stepper.Step label="Budgeting" description="How much will you be spending?">

                    <UnstyledButton onClick={() => setChecked(!checked)} className={classes.button}>
                        <Checkbox
                            color='lime'
                            checked={checked}
                            tabIndex={-1}
                            size="md"
                            mr="xl"
                            styles={{input: {cursor: 'pointer'}}}
                            aria-hidden
                            key={form.key('isMaxBudget')}
                            {...form.getInputProps('isMaxBudget', {type: 'checkbox'})}
                        />

                        <div>
                            <Text fw={500} mb={7} lh={1}>
                                Set Maximum Budget
                            </Text>
                            <Text fz="sm" c="dimmed">
                                Set a maximum budget for your trip for Trek to give better insights on your trip
                            </Text>
                        </div>
                    </UnstyledButton>
                    <TextInput
                        type="number"
                        placeholder=""
                        label="Maximum Budget"
                        rightSection={currencySelect}
                        rightSectionWidth={92}
                        key={form.key('maxBudget')}
                        {...form.getInputProps('maxBudget')}
                        disabled={!checked}
                    />

                </Stepper.Step>

                <Stepper.Step label="Trip Name" description="What should the trip be named?">
                    <TextInput
                        label="Trip Name"
                        placeholder="My Awesome Trip"
                        description="What is the name of your trip?"
                        key={form.key('tripName')}
                        {...form.getInputProps('tripName')}
                    />

                </Stepper.Step>
            </Stepper>

            <Group justify="flex-end" mt="xl">
                {active !== 0 && (
                    <Button variant="default" radius="xl" onClick={prevStep}>
                        Back
                    </Button>
                )}
                {active !== 2 && <Button variant="filled" color="green" radius="xl" onClick={nextStep}>
                    {pending ? <Loader size='xs' color='white' mr={5}></Loader> : <></>}
                    {active === 2 ? "Create Trip" : "Next"}
                </Button>}
                {active === 2 &&
                    <Button variant="filled" color="green" radius="xl" onClick={handleSubmit}>Create Trip</Button>}
            </Group>
        </>
    );
}

export default CreateTripForm;
