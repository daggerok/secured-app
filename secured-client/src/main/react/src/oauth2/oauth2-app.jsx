import React from 'react';
import TrustedClient from './trusted-client';
import ClientWithSecret from './client-with-secret';

const Content = props => <div style={{
  padding: '2%',
}} {...props}/>;

export default () => (
  <Content>
    <ClientWithSecret/>
    <TrustedClient/>
  </Content>
);
