import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import HomepageLayout from '../../layouts/Homepage';

type User = {
  username: string,
};

function AdminHome() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    async function fetchUser() {
      const session = await Auth.currentAuthenticatedUser();
      setUser(session);
    }
    fetchUser();
  }, []);

  if(user === null) {
    return (<p>Who are you?</p>)
  }

  return (
    <HomepageLayout title="Admin Portal">
      <p>Welcome to the admin portal <b>{user.username}</b></p>
      <br />
      <AmplifySignOut />
    </HomepageLayout>
  );
}

export default withAuthenticator(AdminHome);
