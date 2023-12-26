let prevScrollPos = window.scrollY;

window.onscroll = function() {
    const currentScrollPos = window.scrollY;

    if (window.scrollY > 100) {
        if (prevScrollPos > currentScrollPos) {
            document.getElementById("navbar").style.top = "0";
        } else {
            document.getElementById("navbar").style.top = "-50px";
        }

        prevScrollPos = currentScrollPos;
    }
}
