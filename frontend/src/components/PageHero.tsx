import { Box } from "@mantine/core";

interface PageHeroProps {
  children: React.ReactNode;
}

const PageHero = ({ children }: PageHeroProps): JSX.Element => {
  return (
    <Box className="sticky top-0 z-20 p-6 text-4xl font-bold" style={{ background: "linear-gradient(to left, #ecf5fd, #d1fae5)" }}>
      {children}
    </Box>
  );
}

export default PageHero;
