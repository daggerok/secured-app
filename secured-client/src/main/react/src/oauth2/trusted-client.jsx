import React from 'react';
import {
  getTrustedClientToken,
  getData
} from './security/oauth-service';

const Content = props => <div style={{
  padding: '2%',
}} {...props}/>;

export default class TrustedClient extends React.Component {

  state = {
    data: {},
    response: {},
    err: {},
    me: {},
  };

  componentDidMount() {
    getTrustedClientToken()
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
        <h4>trusted oauth2 client testing....</h4>
        <pre>{JSON.stringify(this.state.data, null, 1)}</pre>
        <pre>{JSON.stringify(this.state.response, null, 1)}</pre>
      </Content>
    );
  }
};
