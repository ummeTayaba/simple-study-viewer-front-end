import {
  Button,
  Box,
  ButtonGroup,
  Flex,
  Spacer,
  IconButton,
} from '@chakra-ui/react';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { AddIcon, ViewIcon } from '@chakra-ui/icons';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';

function Header() {
  return (
    <Flex>
      <Box p="4">
        <ButtonGroup isAttached={true}>
          <Button mr="-px">Study</Button>
          <Link to="/study/list">
            <IconButton aria-label="Search database" icon={<ViewIcon />} />
          </Link>

          <Link to="/study/create">
            <IconButton aria-label="Search database" icon={<AddIcon />} />
          </Link>
        </ButtonGroup>
      </Box>
      <Box p="4">
        <ButtonGroup isAttached={true}>
          <Button mr="-px">Patient</Button>
          <Link to="/patient/list">
            <IconButton aria-label="Search database" icon={<ViewIcon />} />
          </Link>
          
          <Link to="/patient/create">
            <IconButton aria-label="Search database" icon={<AddIcon />} />
          </Link>
        </ButtonGroup>
      </Box>

      <Spacer />

      <ColorModeSwitcher justifySelf="flex-end" />
    </Flex>
  );
}

export default Header;
