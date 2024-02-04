/*
 * Purpose:
 *   - This file is used to show/hide the navbar when the user
 *     scrolls up or down the page
 */

// Set the previous scroll position to the current scroll position
let prevScrollPos = window.scrollY;

window.onscroll = function() {
    /*
     * Get relevant scroll positions
     */
    const currentScrollPos = window.scrollY;
    const bottomPos = document.body.scrollHeight - window.innerHeight - 25;
    const topPos = 100;

    /*
     * Check if the user meets one of the following conditions:
     *   - The user is at the top of the page
     *   - The user is scrolling up
     *   - The user is at the bottom of the page
     */
    const checkOne = currentScrollPos <= topPos;
    const checkTwo = prevScrollPos > currentScrollPos;
    const checkThree = currentScrollPos >= bottomPos;

    /*
     * If the user meets one of the conditions, show the navbar
     * Otherwise, hide the navbar
     */
    if ( checkOne || checkTwo || checkThree ) {
        document.getElementById("navbar").style.top = "0";
    } else {
        document.getElementById("navbar").style.top = "-50px";
    }

    prevScrollPos = currentScrollPos;
}
