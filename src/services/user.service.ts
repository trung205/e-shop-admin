import { axiosInstance } from "../utils/axios"

export const getUsersApi  = async (data: {page?: string | number, keyword?: string}) => {
    try {
        return await axiosInstance.get('/admin/user', {
            params: data
        });
    } catch (error) {
        console.log('signIn error')
    }
}