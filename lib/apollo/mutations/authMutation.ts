import {gql} from '@apollo/client';

export const auth = {
  loginMutation: gql`
    mutation Login($username: String!, $password: String!) {
      login(input: {username: $username, password: $password}) {
        access_token
        refresh_token
      }
    }
  `,

  refreshMutation: gql`
    mutation refreshTokenV2 {
      refreshTokenV2 {
        access_token
        refresh_token
      }
    }
  `,
};

// mutation loginMutation($username: String!, $password: String!) {
//   loginMutation(username: $username, password: $password) {
//     access_token
//     refresh_token
//   }
// }
