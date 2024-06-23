import { Box } from "@mantine/core";

interface PageHeroProps {
  children: React.ReactNode;
}

const PageHero = ({ children }: PageHeroProps): JSX.Element => {
  return (
    <Box className="w-[calc(100%)] z-30 text-4xl leading-10 font-bold p-6" style={{ background: "linear-gradient(to left, #ecf5fd, #d1fae5)" }}>
      {children}
    </Box>
  );
}

export default PageHero;
