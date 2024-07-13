import { removeUserDetails } from "@/Redux/Modules/userlogin";
import { store } from "@Redux/../../src/Redux/index";
import Cookies from "js-cookie";
import { prepareURLEncodedParams } from "./prepareUrlEncodedParams";
interface IAPIResponse {
    success: boolean;
    status: number;
    data: any;
}
class FetchService {

    authStatusCodes: number[] = [];

    authErrorURLs: string[] = [
        "/signin",
        "/forgot-password",
    ];

    private _isGlobal: Boolean;

    constructor(isGlobal = false) {
        this._isGlobal = isGlobal;
        store.subscribe(() => { });
    }


    configureAuthorization(config: any) {
        const state = store.getState();

        const accessToken = state?.auth?.user?.access_token;

        // IMPLEMENT STORE/COOCIKES DATA HERE
        config.headers["Authorization"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNzk5MzM0MWQwZmE5ZDdiZjlkNmU0MiIsImVtYWlsIjoic3dhdGhpLmJAbGFic3F1aXJlLmNvbSIsInVzZXJfdHlwZSI6IkxBQl9NQU5BR0VSIiwiZmlyc3RfbmFtZSI6Ikdvd3RoYW0iLCJsYXN0X25hbWUiOiJNYW5kYWRhcHUiLCJpYXQiOjE3MjA4NTE5NTMsImV4cCI6MTcyMTQ1Njc1M30.qniQTJaElHjH9hbqSov6lKU3k_W5yPeBdGzBR7vtH9U"
    }

    setDefualtHeaders(config: any, includeHeaders: boolean) {
        if (includeHeaders) {
            config.headers = {
                "Content-Type": "application/json; charset=utf-8",
            };
        } else {
            config.headers = {};
            // "Content-Type": "application/x-www-form-urlencoded",
        }
    }

    dispatchRemoveUserDetails() {
        store.dispatch(removeUserDetails());
    }

    checkToLogOutOrNot(path: string) {
        return this.authErrorURLs.some((arrayUrl: string) =>
            path.includes(arrayUrl)
        );
    }
    isAuthRequest(path: string) {
        return this.authErrorURLs.includes(path);
    }
    async hit(...args: any): Promise<IAPIResponse> {
        let [path, config, includeHeaders = true, includeUrlOrNot = true] = args;

        this.setDefualtHeaders(config, includeHeaders);

        const authReq = this.isAuthRequest(path);

        if (!authReq) {
            this.configureAuthorization(config);
        }

        // request interceptor starts
        let url = "";
        if (includeUrlOrNot) {
            if (this._isGlobal) {
                url = process.env.NEXT_PUBLIC_LABSQUIRE_URL + path;
            } else {
                url = process.env.NEXT_PUBLIC_LABSQUIRE_DLW_URL + path;
            }
        } else {
            url = path;
        }
        // request interceptor ends

        const response: any = await fetch(url, config);
        if (response.status == 200 || response.status == 201) {

            return {
                success: true,
                status: response.status,
                data: { ...(await response.json()), status: response.status },
            };

        } else if (
            this.authStatusCodes.includes(response.status) &&
            !this.checkToLogOutOrNot(path)
        ) {
            this.dispatchRemoveUserDetails();
            Cookies.remove("user");
            window.location.href = "/";
            return {
                success: false,
                status: response.status,
                data: response,
            };
        } else {
            let responseData = await response.json();

            return {
                status: response?.status,
                success: false,
                data: { status: response?.status, ...responseData },
            };
        }
    }

    async postFile(url: string, file: any) {
        return await this.hit(
            url,
            {
                method: "POST",
                body: file,
            },
            false
        );
    }

    async post(url: string, payload = {}) {
        return await this.hit(url, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    }
    async postWithoutPayload(url: string) {
        return await this.hit(url, { method: "POST" });
    }

    async get(url: string, queryParams = {}) {
        if (Object.keys(queryParams).length > 0) {
            url = prepareURLEncodedParams(url, queryParams);
        }

        return await this.hit(url, {
            method: "GET",
        });
    }
    async getWithOutHeaders(url: string, queryParams = {}) {
        if (Object.keys(queryParams).length > 0) {
            url = prepareURLEncodedParams(url, queryParams);
        }

        return await this.hit(url, {
            method: "GET",
        }, false);
    }

    async delete(url: string, payload = {}) {
        return this.hit(url, {
            method: "DELETE",
            body: JSON.stringify(payload),
        });
    }

    async put(url: string, payload = {}) {
        return this.hit(url, {
            method: "PUT",
            body: JSON.stringify(payload),
        });
    }
    async putToS3(url: string, file: File) {
        return this.hit(
            url,
            {
                method: "PUT",
                body: file,
            },
            true,
            false
        );
    }

    async patch(url: string, payload = {}) {
        return this.hit(url, {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
    }
    async deleteApi(url: string) {
        return this.hit(url, {
            method: "DELETE",
        });
    }

    async putWithOutPayload(url: string) {
        return this.hit(url, {
            method: "PUT",
        });
    }
    async patchWithoutPayload(url: string) {
        return this.hit(url, {
            method: "PATCH",
        });
    }
}

// for app search
export const $LabsquireFetch = new FetchService();
export const $globalFetch = new FetchService(true);






