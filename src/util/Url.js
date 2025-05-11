let publicUrl = '';

function setPublicUrl(url) {
    publicUrl = url;
}

function getPublicUrl() {
    return publicUrl;
}

module.exports = {
    setPublicUrl,
    getPublicUrl,
};
