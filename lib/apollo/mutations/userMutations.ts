import { gql } from '@apollo/client';

export const userMutations = {
  addNote: gql`
    mutation addNote($id: ID!, $content: String!) {
      addNote(input: {activityId: $id, content: $content}) {
        id
      }
    }
  `,
};
