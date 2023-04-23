/*document.getElementById("heading-compose").addEventListener("click", function (event) {
    document.getElementById(".side-two").css({
        "left": "0"
    });
});
document.getElementById("newMessage-back").addEventListener("click", function (event) {
    document.getElementById(".side-two").css({
        "left": "-100%"
    });
});
*/


$(function () {
    $(".heading-compose").click(function () {
        $(".side-two").css({
            "left": "0"
        });
    });

    $(".newMessage-back").click(function () {
        $(".side-two").css({
            "left": "-100%"
        });
    });
}) 