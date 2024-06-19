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

export const createProductApi  = async (data: any) => {
    return await axiosInstance.post('/admin/products', data);
}

export const updateProductApi  = async (id: any, data: any) => {
    return await axiosInstance.put(`/admin/products/${id}`, data);
}