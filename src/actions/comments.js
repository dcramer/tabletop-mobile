import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import { COMMENT_SUCCESS, COMMENT_FAILURE } from '../reducers/comments';
import api from '../api';

const GQL_COMMENT_FRAGMENT = gql`
  fragment CommentFragment on Comment {
    id
    createdAt
  }
`;

const GQL_LIST_COMMENTs = gql`
  query CommentsQuery($createdBy: UUID, $checkin: UUID) {
    comments(createdBy: $createdBy, checkin: $checkin) {
      ...CommentFragment
    }
  }
  ${GQL_COMMENT_FRAGMENT}
`;

const GQL_ADD_COMMENT = gql`
  mutation AddComment($checkin: UUID!) {
    addComment(checkin: $checkin, text: $text) {
      ok
      errors
      comment {
        ...CommentFragment
      }
    }
  }
  ${GQL_COMENT_FRAGMENT}
`;

export function getComments(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: GQL_LIST_COMMEJNTS,
          variables: params,
        })
        .then(resp => {
          resolve(resp.data.comments);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export function addComment(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_ADD_COMMENT,
          variables: data,
        })
        .then(resp => {
          let { addComment } = resp.data;
          if (addComment.ok) {
            resolve(addComment.comment);
            return dispatch(addCommentSuccess(addComment.like));
          } else {
            reject(addComment.errors);
            return dispatch(addCommentFailure(addComment.errors));
          }
        })
        .catch(error => {
          reject(error);
          return dispatch(addCommentFailure(error));
        });
    });
  };
}

export function addCommentSuccess(comment) {
  return {
    type: COMMENT_SUCCESS,
    comment,
  };
}

export function addCommentFailure(error) {
  Sentry.captureException(error);

  return {
    type: COMMENT_SUCCESS,
    error,
  };
}
