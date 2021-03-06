import PropTypes from 'prop-types';

export const User = PropTypes.shape({
  id: PropTypes.string,
  email: PropTypes.string,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string,
});

export const Auth = PropTypes.shape({
  user: User,
});

export const Location = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
});

export const Collection = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
});

export const Entity = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
});

export const Game = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  yearPublished: PropTypes.number,
  minPlayers: PropTypes.number,
  maxPlayers: PropTypes.number,
  duration: PropTypes.number,
  durationTyope: PropTypes.string,
  image: PropTypes.shape({
    url: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }),
});

export const Checkin = PropTypes.shape({
  id: PropTypes.string,
  game: Game.isRequired,
  notes: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  players: PropTypes.arrayOf(User),
  winners: PropTypes.arrayOf(User),
});

export default {
  Auth,
  Checkin,
  Collection,
  Entity,
  Game,
  User,
};
