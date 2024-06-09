import { Text, Image, Container, Flex } from '@mantine/core';
import classes from './FooterLinks.module.css';
import TrekLogo from '../../../assets/Trek.svg';
import { Link } from 'react-router-dom';

const data = [
    {
        title: 'Project',
        links: [
            { label: 'Team', link: 'https://ubc-cpsc455-2024s.github.io/project-04_trekkers/team' },
            { label: 'GitHub', link: 'https://github.com/ubc-cpsc455-2024S/project-04_trekkers' },
            { label: 'Releases', link: 'https://ubc-cpsc455-2024s.github.io/project-04_trekkers/docs/category/release-notes' },
            { label: 'Dev Blog', link: 'https://ubc-cpsc455-2024s.github.io/project-04_trekkers/blog' },
        ],
    },
    {
        title: 'Community',
        links: [
            { label: 'UBC Department of Computer Science', link: 'https://cs.ubc.ca/' },
            { label: 'CPSC 455', link: 'https://www.students.cs.ubc.ca/~cs-455/2024_S/' },
        ],
    },
];

function Footer() {
    const groups = data.map((group) => {
        const links = group.links.map((link, index) => (
            <Text
                key={index}
                className={classes.link}
                component="a"
                href={link.link}
            >
                {link.label}
            </Text>
        ));

        return (
            <Flex className={classes.wrapper} key={group.title}>
                <Container>
                    <Text className={classes.title}>{group.title}</Text>
                    {links}
                </Container>
            </Flex>
        );
    });

    return (
        <footer className={classes.footer}>
            <Container className={classes.inner}>
                <div className={classes.logo}>
                    <Link to="/">
                        <Image src={TrekLogo} h="30%" fit="contain" />
                    </Link>
                </div>
                <div className={classes.groups}>{groups}</div>
            </Container>
            <Container className={classes.afterFooter}>
                <Text c="dimmed" size="sm">
                    © 2024 Trekkers. All rights reserved.
                </Text>
            </Container>
        </footer>
    );
}

export default Footer;