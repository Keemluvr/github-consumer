import api from './config'

export default {
    /**
     * @param {string} link - 
     */
    list: (link) => {
        return api.get(link)
    },
}