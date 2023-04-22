exports.fullday = function(){;
    let date = new Date();
    const opt = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    let d = date.toLocaleDateString("en-us",opt);
    return d;
}
exports.day = function(){

    let date = new Date();
    const opt = {
        weekday: "long"
    }
    let d = date.toLocaleDateString("en-us",opt);
    return d;
}
