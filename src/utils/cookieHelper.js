import Cookies from 'universal-cookie';

class CookieHelper {
    constructor() {
        this.cookies = new Cookies();
    };

    // Save a new cookie
    saveCookie(name, value) {
        this.cookies.set(name, value);
    };

    // Get a cookie
    getCookie(name) {
        const foundCookie = this.cookies.get(name);
        return foundCookie ? foundCookie : null;
    };

    // Delete a cookie
    deleteCookie(name) {
        this.cookies.remove(name);
    };
};

export default new CookieHelper();