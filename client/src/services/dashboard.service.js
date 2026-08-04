import API from "./auth.service";

/*
|--------------------------------------------------------------------------
| Dashboard APIs
|--------------------------------------------------------------------------
*/

export const getDashboardStats = async () => {
    return await API.get("/dashboard/stats");
};

export const getRecentRepositories = async () => {
    return await API.get("/dashboard/recent");
};