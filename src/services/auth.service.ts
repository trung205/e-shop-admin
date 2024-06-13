import { axiosInstance } from "../utils/axios"

export const signIn = async (data: {email: string, password: string}) => {
    try {
        return await axiosInstance.post('/admin/auth/signin', data);
    } catch (error) {
        console.log('signIn error')
    }
}