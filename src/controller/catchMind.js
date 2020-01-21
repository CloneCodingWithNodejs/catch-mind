/* eslint-disable import/prefer-default-export */
import events from '../events';

export const goHome = (req, res) => {
  res.render('home', { events: JSON.stringify(events) });
};
