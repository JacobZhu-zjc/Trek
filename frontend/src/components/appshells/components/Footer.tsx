import {Text, Image, Container, Flex} from '@mantine/core';
import classes from './FooterLinks.module.css';
import TrekLogo from '../../../assets/Trek-Dark.svg';
import {Link} from 'react-router-dom';

const data = [
    {
        title: 'About',
        links: [
            {label: 'Team', link: 'https://ubc-cpsc455-2024s.github.io/trekkers-docs-public/team'},
            {label: 'Terms of Use', link: '/legal/terms'},
            {label: 'Privacy Policy', link: '/legal/privacy'},
            {label: 'Copyright Policy', link: '/legal/copyright'},
        ],
    },
    {
        title: 'Community',
        links: [
            {label: 'UBC Department of Computer Science', link: 'https://cs.ubc.ca/'},
            {label: 'CPSC 455', link: 'https://www.students.cs.ubc.ca/~cs-455/2024_S/'},
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
                    <Text fw={800}>{group.title}</Text>
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
                        <Image src={TrekLogo} h="30%" fit="contain"/>
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
