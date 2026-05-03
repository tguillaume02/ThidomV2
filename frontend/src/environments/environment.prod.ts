export const environment = {
  production: true,
  apiUrl: '/ThiDom/api',
  wsUrl: `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ThiDom/api/ws/live`,
};
