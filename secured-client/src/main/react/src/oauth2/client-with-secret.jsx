import React from 'react';
import {
  getClientWithSecretToken,
  getData
} from './security/oauth-service';

const Content = props => <div style={{
  padding: '2%',
}} {...props}/>;

export default class ClientWithSecret extends React.Component {

  state = {
    data: {},
    response: {},
    err: {},
    me: {},
  };

  componentDidMount() {
    getClientWithSecretToken()
      .then(response => this.setState({ response }))
      .then(also => getData(this.state.response, 'http://localhost:9999/me'))
      .then(me => this.setState({ me }))
      .then(also => getData(this.state.response, 'http://localhost:9999'))
      .then(data => this.setState({ data }))
      .catch(err => this.setState({ err }));
  }

  render() {
    return (
      <Content>
        <h4>client with secret oauth2 token testing....</h4>
        <pre>{JSON.stringify(this.state.data, null, 1)}</pre>
        <pre>{JSON.stringify(this.state.response, null, 1)}</pre>
      </Content>
    );
  }
};
