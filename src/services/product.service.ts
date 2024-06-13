import { axiosInstance } from "../utils/axios"

export const getProductsApi  = async (data: {page?: string | number, keyword?: string}) => {
    try {
        return await axiosInstance.get('/admin/products', {
            params: data
        });
    } catch (error) {
        console.log('signIn error')
    }
}