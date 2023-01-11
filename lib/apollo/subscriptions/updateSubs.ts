import {gql} from '@apollo/client';

export const subscriptionCall = {
  updateSubstription: gql`
    subscription onUpdatedCall {
      onUpdatedCall {
        id
        direction
        from
        to
        duration
        via
        is_archived
        call_type
        created_at
        notes {
          id
          content
        }
      }
    }
  `,
};
