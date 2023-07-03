import authorizedRequest from './authorized-request';

export const accountCollectionApi = {
  getAccountCollection: (params) =>
    authorizedRequest
      .get(`/v2/sui/nft/accountCollection`, { params })
      .then((res) => res.data),
};
