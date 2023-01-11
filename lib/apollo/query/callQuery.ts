import {gql} from '@apollo/client';

export const callQueries = {
  Call: gql`
    query paginatedCalls($offset: Float!, $limit: Float!) {
      paginatedCalls(offset: $offset, limit: $limit) {
        nodes {
          id
          direction
          from
          to
          duration
          is_archived
          via
          call_type
          created_at
          is_archived
          notes {
            id
            content
          }
        }
        totalCount
        hasNextPage
      }
    }
  `,

  meQuery: gql`
    query {
      me {
        id
        username
      }
    }
  `,
};
