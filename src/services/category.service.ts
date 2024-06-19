import { axiosInstance } from "../utils/axios"

export const getCategoriesApi  = async (data: {page?: string | number, keyword?: string}) => {
    try {
        return await axiosInstance.get('/admin/category', {
            params: data
        });
    } catch (error) {
        console.log('signIn error')
    }
}

export const createCategoryApi  = async (data: any) => {
    return await axiosInstance.post('/admin/category', data);
}

export const updateCategoryApi  = async (id: any, data: any) => {
    return await axiosInstance.put(`/admin/category/${id}`, data);
}