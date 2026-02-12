import Cookies from "js-cookie";

export async function getToken() {
    return Cookies.get("userToken");
}
