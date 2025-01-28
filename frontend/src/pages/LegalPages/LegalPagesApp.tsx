import {useEffect} from "react";
import {useGetLegalPageQuery} from "../../redux/services/payloadApi";
import {Box, Flex, Title} from "@mantine/core";
import "./index.css";


export interface Legal {
    id: string;
    title: string;
    content?: {
        root: {
            type: string;
            children: {
                type: string;
                version: number;
                [k: string]: unknown;
            }[];
            direction: ('ltr' | 'rtl') | null;
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
            indent: number;
            version: number;
        };
        [k: string]: unknown;
    } | null;
    content_html?: string | null;
    slug?: string | null;
    updatedAt: string;
    createdAt: string;
}

interface LegalPagesAppProps {
    id: string;
}

const LegalPagesApp = ({id}: LegalPagesAppProps) => {

    useEffect(() => {
        document.title = "Legal";
    }, []);

    const {data, error} = useGetLegalPageQuery(id);

    if (error) {
        console.error(error);
    }


    return (
        <>
            <Flex justify={'center'} align="center" direction={"column"} w={"100%"}>
                <Box maw={900} w={"80%"} miw={300}>
                    <Title order={2} py={"xl"}>{data?.title}</Title>

                    <div className="payload-content"
                         dangerouslySetInnerHTML={{__html: data?.content_html || ""}}
                    />
                </Box>
            </Flex>
        </>);

}

export default LegalPagesApp;
