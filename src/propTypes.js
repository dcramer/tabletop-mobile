import PropTypes from 'prop-types';

export const User = PropTypes.shape({
  id: PropTypes.string,
  displayName: PropTypes.string.isRequired,
});

export const Location = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
});

export const Publisher = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
});

export const Game = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  publisher: Publisher.isRequired,
  minPlayers: PropTypes.number,
  maxPlayers: PropTypes.number,
  duration: PropTypes.number,
  durationTyope: PropTypes.string,
});

export const CheckIn = PropTypes.shape({
  id: PropTypes.string,
  game: Game.isRequired,
  notes: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  players: PropTypes.arrayOf(User),
  winners: PropTypes.arrayOf(User),
});

export default {
  CheckIn,
  Game,
  Publisher,
  User,
};
