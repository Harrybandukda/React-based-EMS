import { gql } from 'apollo-angular';

export const USER_LOGIN = gql`
  mutation userLogin($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      email
      token
    }
  }
`;

export const USER_SIGNUP = gql`
  mutation userSignup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      id
      username
      email
      token
    }
  }
`;

export const CURRENT_USER = gql`
  query getCurrentUser {
    getCurrentUser {
      id
      username
      email
    }
  }
`;