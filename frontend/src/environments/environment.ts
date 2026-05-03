export const environment = {
  production: false,
  apiUrl: '/ThiDom/api',
  wsUrl: `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ThiDom/api/ws/live`,
};
