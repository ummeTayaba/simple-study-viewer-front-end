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

import { List as PatientList, Create as PatientCreate } from './patient/Patient'

export const Body = () => {
  return (
    <Switch>

      <Route exact path="/">
        <Redirect to="/study/list" />
      </Route>

      <Route exact path="/study/list">
        <StudyList />
      </Route>

      <Route exact path="/study/create">
        <StudyCreate />
      </Route>

      <Route exact path="/study/edit/:id">
        <StudyCreate />
      </Route>
    
      <Route exact path="/patient/list">
        <PatientList />
      </Route>

      <Route exact path="/patient/create">
        <PatientCreate />
      </Route>
    </Switch>
  );
};
