/**
 * Purpose:
 *   - This file is used to scroll to the top of the page when the user clicks
 *     on the "to top" button
 *   - This Button will only be applied to my blog posts
 */

window.onscroll = function () {
    const checkOne = document.body.scrollTop > 20;
    const checkTwo = document.documentElement.scrollTop > 20;

    if (checkOne || checkTwo) {
        document.getElementById("toTop").style.display = "block";
    } else {
        document.getElementById("toTop").style.display = "none";
    }
};

function toTop() {
    // For Safari
    document.body.scrollTo({
        top: 0,
        behavior: "smooth",
    });

    // For Chrome, Firefox, IE and Opera
    document.documentElement.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}
