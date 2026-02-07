import request from './request';

export const statisticsApi = {
  getHomeStats: () => request.get('/statistics/home'),
};
