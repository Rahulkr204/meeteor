import React from 'react';
import './css/index.css';
import MeetForm from './components/MeetForm'
import { Box, Heading, ThemeProvider, CSSReset } from "@chakra-ui/core";

const App = () => {    
	return (
        <ThemeProvider>
            <CSSReset />
            <Box bg="gray.800" w="320px" p="2">
                <Heading h="15%" as="h3" size="lg" color="gray.50" d="flex" alignItems="center" justifyContent="center">
                    {`Meeteor ⚡️`}
                </Heading>
                <MeetForm/>
            </Box>
        </ThemeProvider>
            
	);
};

export default App;