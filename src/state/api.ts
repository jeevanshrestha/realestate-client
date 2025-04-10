import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession , getCurrentUser} from "aws-amplify/auth";
import { createNewUserInDatabase } from "../lib/utils"; // Adjust the path as needed
 
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const {idToken} = session.tokens ?? {};
      if(idToken){
        headers.set("Authorization", `Bearer ${idToken}`);
      }
    }
  }),
  reducerPath: "api",
  tagTypes: [],
  endpoints: (build) => ({

    getAuthUsers: build.query<User, void>({
      queryFn: async( _, _queryApi, _extraOptions, fetchWithBQ) => {
        try{

          const session = await fetchAuthSession();
          const {idToken} = session.tokens ?? {};
          const user = await getCurrentUser();
          const userRole = idToken?.payload["custom:role"] as string;

          const endpoint =
            userRole === "manager" ? `/managers/${user.userId}` : `/tenants/${user.userId}`;

            // if user doesn't exist, create new use


               let userDetailsResponse = await fetchWithBQ(endpoint);

               //if user doesn't exist, create new user
              if(userDetailsResponse.error && userDetailsResponse.error.status === 404){
                userDetailsResponse = await createNewUserInDatabase(
                  user,
                  idToken,
                  userRole,
                  fetchWithBQ
                );
              }

               return {
                data: {
                  cognitoInfo:{ ...user},
                  userInfo: userDetailsResponse.data as Tenant | Manager,
                  userRole
                }
               }
        }catch(error: unknown){
          const errorMessage = error instanceof Error ? error.message : "Could not fetch user data.";
          return {error: errorMessage };
        }
      }
    }) 
  }),
});

export const {
  useGetAuthUsersQuery,
} = api;


