import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import {
  ADD_CHECKIN_FAILURE,
  ADD_CHECKIN_SUCCESS,
  LOAD_CHECKIN,
  LIKE_CHECKIN_FAILURE,
  LIKE_CHECKIN_SUCCESS,
  UNLIKE_CHECKIN_FAILURE,
  UNLIKE_CHECKIN_SUCCESS,
} from '../reducers/checkins';
import { GameFragment } from '../fragments';
import api from '../api';

const GQL_CHECKIN_FRAGMENT = gql`
  fragment CheckinFragment on Checkin {
    id
    game {
      ...GameFragment
    }
    players {
      id
      name
    }
    totalLikes
    totalComments
    isLiked
    createdAt
  }
  ${GameFragment}
`;

const GQL_LIST_CHECKINS = gql`
  query CheckinsQuery($createdBy: UUID, $scope: CheckinScope, $game: UUID) {
    checkins(createdBy: $createdBy, scope: $scope, game: $game) {
      ...CheckinFragment
    }
  }
  ${GQL_CHECKIN_FRAGMENT}
`;

const GQL_ADD_CHECKIN = gql`
  mutation AddCheckin(
    $game: UUID!
    $notes: String
    $rating: Decimal
    $players: [UUID]
    $winners: [UUID]
  ) {
    addCheckin(game: $game, notes: $notes, rating: $rating, players: $players, winners: $winners) {
      ok
      errors
      checkin {
        ...CheckinFragment
      }
    }
  }
  ${GQL_CHECKIN_FRAGMENT}
`;

const GQL_LIST_LIKES = gql`
  query LikesQuery($createdBy: UUID, $checkin: UUID) {
    likes(createdBy: $createdBy, checkin: $checkin) {
      ...LikeFragment
    }
  }
`;

const GQL_ADD_LIKE = gql`
  mutation AddLike($checkin: UUID!) {
    addLike(checkin: $checkin) {
      ok
      errors
      checkin {
        ...CheckinFragment
      }
    }
  }
  ${GQL_CHECKIN_FRAGMENT}
`;

const GQL_REMOVE_LIKE = gql`
  mutation RemoveLike($checkin: UUID!) {
    removeLike(checkin: $checkin) {
      ok
      errors
      checkin {
        ...CheckinFragment
      }
    }
  }
  ${GQL_CHECKIN_FRAGMENT}
`;

export function getCheckins(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: GQL_LIST_CHECKINS,
          variables: params,
        })
        .then(resp => {
          resp.data.checkins.forEach(checkin => {
            dispatch({
              type: LOAD_CHECKIN,
              checkin,
            });
          });
          resolve(resp.data.checkins);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export function addCheckin(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_ADD_CHECKIN,
          variables: data,
          update: (store, { data: { addCheckin } }) => {
            const data = store.readQuery({ query: GQL_LIST_CHECKINS });
            store.writeQuery({
              query: GQL_LIST_CHECKINS,
              data: {
                ...data,
                checkins: [addCheckin, ...data.checkins],
              },
            });
          },
        })
        .then(resp => {
          let { addCheckin } = resp.data;
          if (addCheckin.ok) {
            resolve(addCheckin.checkin);
            return dispatch(addCheckinSuccess(addCheckin.checkin));
          } else {
            reject(addCheckin.errors);
            return dispatch(addCheckinFailure(addCheckin.errors));
          }
        })
        .catch(error => {
          Sentry.captureException(error);
          reject(error);
          return dispatch(addCheckinFailure(error));
        });
    });
  };
}

export function addCheckinSuccess(checkin) {
  return {
    type: CHECKIN_SUCCESS,
    checkin,
  };
}

export function addCheckinFailure(error) {
  Sentry.captureException(error);

  return {
    type: CHECKIN_FAILURE,
    error,
  };
}

export function getLikes(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: GQL_LIST_LIKES,
          variables: params,
        })
        .then(resp => {
          resolve(resp.data.likes);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export function addLike(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_ADD_LIKE,
          variables: data,
        })
        .then(resp => {
          let { addLike } = resp.data;
          if (addLike.ok) {
            resolve(addLike.checkin);
            return dispatch(addLikeSuccess(addLike.checkin));
          } else {
            reject(addLike.errors);
            return dispatch(addLikeFailure(addLike.errors));
          }
        })
        .catch(error => {
          Sentry.captureException(error);
          reject(error);
          return dispatch(addLikeFailure(error));
        });
    });
  };
}

export function addLikeSuccess(checkin) {
  return {
    type: LIKE_CHECKIN_SUCCESS,
    checkin,
  };
}

export function addLikeFailure(error) {
  Sentry.captureException(error);

  return {
    type: LIKE_CHECKIN_FAILURE,
    error,
  };
}

export function removeLike(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_REMOVE_LIKE,
          variables: data,
        })
        .then(resp => {
          let { removeLike } = resp.data;
          if (removeLike.ok) {
            resolve(removeLike.checkin);
            return dispatch(removeLikeSuccess(removeLike.checkin));
          } else {
            reject(removeLike.errors);
            return dispatch(removeLikeFailure(removeLike.errors));
          }
        })
        .catch(error => {
          Sentry.captureException(error);
          reject(error);
          return dispatch(removeLikeFailure(error));
        });
    });
  };
}

export function removeLikeSuccess(checkin) {
  return {
    type: UNLIKE_CHECKIN_SUCCESS,
    checkin,
  };
}

export function removeLikeFailure(error) {
  Sentry.captureException(error);

  return {
    type: UNLIKE_CHECKIN_FAILURE,
    error,
  };
}
