import {
  Button,
  Box,
  ButtonGroup,
  Flex,
  Spacer,
  IconButton,
} from '@chakra-ui/react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { StudyCreate } from './study/StudyCreate'
import { StudyList } from './study/StudyList'

export const Body = () => {
  return (
    <Switch>

      <Route exact path="/study/list">
        <StudyList />
      </Route>

      <Route exact path="/study/create">
        <StudyCreate />
      </Route>
    
      <Route exact path="/patient/list">
        <div>Patient List</div>
      </Route>

      <Route exact path="/patient/create">
        <div>Patient create</div>
      </Route>
    </Switch>
  );
};
