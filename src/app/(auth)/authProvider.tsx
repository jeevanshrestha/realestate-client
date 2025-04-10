import React from 'react';
import { Amplify } from 'aws-amplify';
import { usePathname, useRouter } from 'next/navigation';
import {useEffect, useState} from 'react';
import { Authenticator, useAuthenticator, View, Heading, RadioGroupField, Radio } from '@aws-amplify/ui-react';
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

const formFields = { 
  signIn:{
        username:{
          placeholder:'Enter your email',
          label: 'Email',
          isRequired: true,
          },
          
          password:{
            placeholder:'Enter your password',
            label: 'Password',
            isRequired: true,
        }
    },
    signUp:{
        username:{
          order:1,
          placeholder:'Choose a username',
          label: 'Username',
          isRequired: true,
          },
          
          email:{
            order:2,
            placeholder:'Enter your email address',
            label: 'Email',
            isRequired: true,
          },
          password:{
            order:3,
            placeholder:'Choose a password', 
            label: 'Password',
            isRequired: true,
        },
        confirm_password:{
          order:3,
          placeholder:'Confirm your password', 
          label: 'Confirm Password',
          isRequired: true,
      }
    } 
}



const Auth = ({children}:{children: React.ReactNode}) => {

  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname.match(/^\/(signin|signup)$/);
  const isDashboardPage = pathname.startsWith("/manager") || pathname.startsWith("/tenant");

  //Redirect authenticated users from the auth pages.
  useEffect(()=>{
    if(user && isAuthPage){
      router.push("/"); // Redirect to the home page or dashboard
    }

  },[user, isAuthPage, router]);


  //Allow access to public pages without Authentication


  if(!isAuthPage && !isDashboardPage){
    return <>{children}</>
  }

  const components ={
    Header(){
      return (
        <View className="mt-4 mb-7">
          <Heading level={3} className="!text-2xl !font-bold">RENT
            <span className='text-secondary-500 font-light hover:!text-primary-300'>
              IFUL
            </span>
          </Heading>
          <p className='text-muted-foreground mt-2'>
            <span className="font-bold">Welcome!</span> Please sign in to continue.
          </p>
          </View>
      )
    },
    SignIn:{
      Footer(){
        const { toSignUp} = useAuthenticator();
        return(
          <View className="text-center mt-4 ">
           <p className='text-muted-foreground mt-2'>
            Don&apos;t have an account?{" "}
          </p>
           <button
           onClick={toSignUp} 
            className='text-primary hove:underline bg-transparent border-none p-0'>
              Sign up here.
            </button>
          </View> 
        ); 
      },

    },
    SignUp:{
      FormFields(){
        const {validationErrors} = useAuthenticator();

        return(
          <>
            <Authenticator.SignUp.FormFields />
            <RadioGroupField 
              legend="Role"
              name="custom:role"
              errorMessage={validationErrors?.["custom.role"]}
              hasError ={!!validationErrors?.["custom:role"]}
              isRequired
              >
                <Radio value="tenant" >Tenant</Radio>
                <Radio value="manager" >Manager</Radio>
              </RadioGroupField> 
          </>
        );
      },
      
      Footer(){
        const { toSignIn} = useAuthenticator();
        return(
          <View className="text-center mt-4 ">
           <p className='text-muted-foreground mt-2'>
            Already have an account?{" "}
          </p>
           <button
           onClick={toSignIn} 
            className='text-primary hove:underline bg-transparent border-none p-0'>
              Sign in here.
            </button>
          </View> 
        ); 
      },

    },
  }

  return (
    <div className="h-full"> 
        <Authenticator
         initialState={pathname.includes("signup") ? "signUp" : "signIn"}
          signUpAttributes={["email"]}
          components={components}
          formFields={formFields}
        >
          {( ) => ( <>   {children} </> )}
        </Authenticator>
    </div>
  );
}

export default Auth;  