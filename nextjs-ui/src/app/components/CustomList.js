import React from 'react';

const List = ({ children }) => (
  <ul>{children}</ul>
);

const ListItem = ({ children }) => (
  <li>{children}</li>
);

export { List, ListItem };