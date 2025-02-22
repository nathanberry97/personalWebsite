function toTop() {
    document.body.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
}

window.onscroll = function() {
    const checkOne = document.body.scrollTop > 20;
    const checkTwo = document.documentElement.scrollTop > 20;

    if (checkOne || checkTwo) {
        document.getElementById("toTop").style.display = "block";
    } else {
        document.getElementById("toTop").style.display = "none";
    }
};
