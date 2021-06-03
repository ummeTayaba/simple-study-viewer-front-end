import React from 'react';
import {
  ChakraProvider,
  Box,
  Spacer,
  Flex,
  theme,
  ButtonGroup,
  Button,
  IconButton,
  SearchIcon,
} from '@chakra-ui/react';

import Skeleton from './components/Skeleton';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="right" fontSize="xl">
        <Skeleton />
      </Box>
    </ChakraProvider>
  );
}

export default App;
