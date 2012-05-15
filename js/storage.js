og.Data.Storage = {
    isSupported: function () {
        try {
            return ('localStorage' in window && window['localStorage'] !== null);           
        } catch (e) {
            return false;
        }
    },
    Add: function (key, value) {
        try {
                localStorage.setItem(key, value);
                //or localStorage[key] = value; //like associative arrays
            } catch (e) {
                alert(e.Description);
                return -1;
            }
    },
    Get: function (key) {
        return localStorage.getItem(key);
        //or localStorage[key];
    }
}