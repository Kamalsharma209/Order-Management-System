import api from './axios';

export const fetchSchedulerLogs = (params = {}) =>
  api.get('/scheduler/logs', { params }).then((res) => res.data);

export const triggerScheduler = (secretKey) =>
  api
    .post('/scheduler/run', {}, { headers: { 'x-secret-key': secretKey } })
    .then((res) => res.data);
