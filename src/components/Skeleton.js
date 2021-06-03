import Header from './header/Header';
import { Body } from './body/Body';
import { Footer } from './footer/Footer';

import { Box } from '@chakra-ui/react';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

function Skeleton() {
  return (
    <Router>
      <Header />
      <Body />
      <Footer />
    </Router>
  );
}

export default Skeleton;
