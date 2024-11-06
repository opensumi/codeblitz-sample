// src/shims/react-dom-client.js
import ReactDOM from 'react-dom';

export function createRoot(container) {
  return {
    render: (element) => ReactDOM.render(element, container),
  };
}