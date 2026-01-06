import http from "../http-common";
import axios from 'axios';
import { Toast } from '../components/Toast.jsx';


class UserService {

    //...profile update
    update(name, image) {
    return http
        .post("/user/update", {
            name, image
        })
        .then(response => {
            if (response.data.access_token) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response;
        });
    }




    //...Admin
    createAdmin(data) {
        return http.post("/user/admin", data);
    }

    updateAdmin(id, data) {
        return http.put(`/user/admin/${id}`, data);
    }

    flushCache() {
        return http.get(`/cache-clear`);
    }



 
    //...Get All Users
    findAll(page, role) {
        return http.get(`/user?page=${page}&role=${role}`);
    }

    //file Upload
    async fileUpload(folderName, data) {
        try {
            const response = await axios.post(import.meta.env.VITE_API+'/file-upload/'+folderName, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response;
        } catch (error) {
            // console.error('Error uploading:', error);
            Toast('error', 'Image Required');
        }
    }

    async pdfUpload(folderName, data) {
        try {
            const response = await axios.post(import.meta.env.VITE_API+'/upload-pdf/'+folderName, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response;
        } catch (error) {
            // console.error('Error uploading:', error);
            Toast('error', 'Image Required');
        }
    }



    

    //delete image
    async deleteImage(data) {
        try {
            const response = await axios.post(import.meta.env.VITE_API+'/delete-image/', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response;
        } catch (error) {
            console.error('Error uploading:', error);
        }
    }

}

export default new UserService();