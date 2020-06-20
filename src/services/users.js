import api from './config'

export default {
    /**
     * @param {string} link - destination link pagination
     */
    list: (link) => {
        return api.get(link)
    },

    userCreatedAt: ( username ) => {
        return api.get(`/users/${username}`)
    }
}