import React from 'react';
import { Amplify } from 'aws-amplify';

import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// import awsExports from './aws-exports';
//// https://docs.amplify.aws/gen1/javascript/tools/libraries/configure-categories/

Amplify.configure({
    Auth:{
        Cognito:{
            userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
            userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!
        }
    }
});

const Auth = ({children}:{children: React.ReactNode}) => {

  const { user, signOut } = useAuthenticator((context) => [context.user]);


  return (
    <div className="h-full"> 
        <Authenticator>  {()=><> {children} </>} </Authenticator>
    </div>
  );
}

export default Auth;    