import React from 'react';

import {storiesOf} from '@storybook/react';
import StoryRouter from 'storybook-react-router';
import {Login} from '../components/Login';

storiesOf('Login', module)
  .addDecorator(StoryRouter())
  .add('empty', () => <Login />)
  .add('with text', () => <Login email="gil@tayar.org" password="apassword" />);
