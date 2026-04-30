export const environment = {
  production: false,
  apiUrl: '/ThiDomV2/api',
  wsUrl: `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ThiDomV2/api/ws/live`,
};
