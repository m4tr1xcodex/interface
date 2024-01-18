export const openNewBackgroundTab = (url) => {
    var myWindow = window.open(url);   // Opens a new window
    myWindow.focus();
    myWindow.location.reload();
}

export const removeTrailingSlash = (str) => {
    return str.replace(/\/+$/, '');
}