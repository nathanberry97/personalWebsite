let prevScrollPos = window.scrollY;

window.onscroll = function() {
    const currentScrollPos = window.scrollY;
    const bottomPos = document.body.scrollHeight - window.innerHeight - 25;

    if (window.scrollY > 100) {
        if (prevScrollPos > currentScrollPos || currentScrollPos >= bottomPos) {
            document.getElementById("navbar").style.top = "0";
        } else {
            document.getElementById("navbar").style.top = "-50px";
        }

        prevScrollPos = currentScrollPos;
    }
}
