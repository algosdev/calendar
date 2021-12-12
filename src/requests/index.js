import queryStringify from '../helpers/qs'
import request from './axios'
const train = {
  getAll: (filter) => request.get(`v1/train${queryStringify(filter)}`),
  getDestinations: (filter) =>
    request.get(`v1/train/destionation${queryStringify(filter)}`),
  getSingle: (id) => request.get(`v1/train/${id}`),
  create: (data) => request.post(`v1/train`, data),
  update: (id, data) => request.put(`v1/train/${id}`, data),
}
const comment = {
  getReasons: (filter) =>
    request.get(`v1/comment/reason${queryStringify(filter)}`),
  getComments: (id, filter) =>
    request.get(`v1/comment/by/${id}${queryStringify(filter)}`),
  create: (data) => request.post(`v1/comment`, data),
  update: (id, data) => request.put(`v1/comment/${id}`, data),
}
const requests = {
  train,
  comment,
}
export default requests
