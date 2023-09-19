import axios from 'axios';
const ENV_DATA = {
  BASE_URL: process.env.REACT_APP_BASE_URL,
};
console.log(process.env)
/**
 * create axios instance
 */
const $http = axios.create({
    baseURL: ENV_DATA.BASE_URL,

    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
 * post api call common function
 * @param endPoint endpoint of api
 * @param params data to send
 * @param successCallback called after success
 * @param errorCallback called after error
 */
const postApiCall = (
    endPoint,
    params,
    successCallback,
    errorCallback,
  ) => {
    $http
      .post(endPoint, params)
      .then((response) => {
        if (
          (response && response?.status === 200) ||
          (response && response?.data?.status === 200)
        ) {
          successCallback(response?.data);
        } else {
          if (response?.response?.status === 400) {
            successCallback(response?.response?.data);
          }
          successCallback(response?.data);
        }
      })
      .catch((error) => {
        errorCallback && errorCallback(error?.response);
      });
  };

  /**
 * get api call common function
 * @param endPoint endpoint of api
 * @param paramsData data to send
 * @param successCallback called after success
 * @param errorCallback called after error
 */
const getApiCall = (
    endPoint,
    paramsData = '',
    successCallback,
    errorCallback,
  ) => {
    $http
      .get(endPoint + paramsData, {})
      .then((response) => {
        successCallback(response);
      })
      .catch((error) => {
        errorCallback(error?.response);
      });
  };



  /**
 * delete api call common function
 * @param endPoint endpoint of api
 * @param paramsData data to send
 * @param successCallback called after success
 * @param errorCallback called after error
 */
const deleteApiCall = (
  endPoint,
  paramsData = '',
  successCallback,
  errorCallback,
) => {
  $http
    .delete(endPoint + paramsData, {})
    .then((response) => {
      successCallback(response);
    })
    .catch((error) => {
      errorCallback(error?.response);
    });
};

  export {postApiCall, getApiCall,deleteApiCall}