import { HttpMethod } from "../../data/AppConstants"
import { apiRequest } from "../API/ApiRequest"
import { handleError } from "../Handling/handleError"
import { handleSuccess } from "../Handling/handleSuccess"

export const fetch = async (API, Token) => {
    try {
        return await apiRequest(API, HttpMethod.GET, Token)
    } catch (err) {
        handleError(err)
    }
}

export const remove = async (API, Token) => {
    try {
        const res = await apiRequest(API, HttpMethod.DELETE, Token);
        handleSuccess(res)
    } catch (err) {
        handleError(err)
    }
};

export const create = async (API, Token, form) => {
    try {
        const res = await apiRequest(API, HttpMethod.POST, Token, form);
        Token ? handleSuccess(res) : handleSuccess('Log in Successfully')
        return res
    } catch (err) {
        console.log("error")
        handleError(err)
    }
};

export const update = async (API, Token, form) => {
    try {
        const res = await apiRequest(API, HttpMethod.PUT, Token, form)
        handleSuccess(res)
    } catch (err) {
        handleError(err)
    }
};